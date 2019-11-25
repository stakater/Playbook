# Example Scenario

Konfigurator Operator looks for `KonfiguratorTemplate` Custom Resource in the namespaces specified, render the configuration and then mount these configmaps/secrets to the specified resource.

In this example we will generate fluentd configurations dynamically so that our application specific logs can be parsed using regex.

1. See already rendered configmap `konfigurator-stakater-logging-fluentd-elasticsearch-rendered` in `logging` namespace without sample app config.
2. Deploy a sample application with regex to use by Konfigurator in a separate namespace.
3. Konfigurator operator will read the newly created resource and render the new config.
4. `Reloader` will reload the pod as soon as the config is changed. 
4. Verify if the newly renedered config is mounted on the specified pod.

## Konfigurator Operator

Konfigurator Operator is deployed with following values in `logging` namespace. 

```
apiVersion: helm.fluxcd.io/v1
kind: HelmRelease
metadata:
  name: stakater-logging-konfigurator
  namespace: logging
spec:
  releaseName: stakater-logging-konfigurator
  chart:
    repository: https://stakater.github.io/stakater-charts/
    name: konfigurator
    version: 0.0.20
  values:
    kubernetes:
      host: https://kubernetes.default

    konfigurator:
      deployCRD: true
      labels:
        provider: stakater
        group: com.stakater.platform
        version: v0.0.20
      image:
        name: stakater/konfigurator
        tag: "v0.0.20"
        pullPolicy: IfNotPresent
      env:
      - name: WATCH_NAMESPACE
        valueFrom:
          fieldRef:
            fieldPath: metadata.namespace
```

## KonfiguratorTemplate resource for fluentd

Following is a Konfigurator Template that templatize `fluent.conf` and mounts this as a configMap on the `stakater-logging-fluentd-elasticsearch` DaemonSet so that the fluentd pod can use this config. This is also deployed in `logging` namespace.

```
apiVersion: konfigurator.stakater.com/v1alpha1
kind: KonfiguratorTemplate
metadata:
  name: fluentd
  namespace: logging
  labels:
    app: konfigurator
spec:
  renderTarget: ConfigMap
  app:
    name: stakater-logging-fluentd-elasticsearch
    kind: DaemonSet
    volumeMounts:
      - mountPath: /etc/fluent
        container: stakater-logging-fluentd-elasticsearch
  templates:
    fluent.conf: |
      # Do not collect fluentd's own logs to avoid infinite loops.
      <match fluent.**>
          @type null
      </match>

      @include /etc/fluent/config.d/*.conf        

      <match kubernetes.var.log.containers.**fluentd**.log>
          @type null
      </match>

      # Do not collect tiller logs as they are too frequent and of very less value
      <match kubernetes.var.log.containers.**tiller**.log>
          @type null
      </match>      

      <filter kubernetes.var.log.containers.**.log>
          @type kubernetes_metadata
      </filter>

      # Workaround until fluent-slack-plugin adds support for nested values
      <filter kubernetes.var.log.containers.**.log>
          @type record_transformer
          enable_ruby
          <record>
              kubernetes_pod_name ${record["kubernetes"]["pod_name"]}
              kubernetes_namespace_name ${record["kubernetes"]["namespace_name"]}
          </record>
      </filter>

      # Get distinct pods per application
      {{- $podsWithAnnotations := whereExist .Pods "ObjectMeta.Annotations.fluentdConfiguration" -}}
      {{- $distinctPods := distinctPodsByOwner $podsWithAnnotations -}}

      # Create concat filters for supporting multiline
      {{- range $pod := $distinctPods -}}
          {{- $config := first (parseJson $pod.ObjectMeta.Annotations.fluentdConfiguration) }}

          {{- range $containerConfig := $config.containers }}
              {{- if (len $pod.Spec.Containers) eq 1 }}
              <filter kubernetes.var.log.containers.{{ (index $pod.ObjectMeta.OwnerReferences 0).Name }}**_{{ $pod.ObjectMeta.Namespace }}_{{ (index $pod.Spec.Containers 0).Name }}**.log>
              {{- else }}
      <filter kubernetes.var.log.containers.{{ (index $pod.ObjectMeta.OwnerReferences 0).Name }}**_{{ $pod.ObjectMeta.Namespace }}_{{ $containerConfig.containerName }}**.log>
              {{- end }}
          @type concat
          key log
          multiline_start_regexp {{ $containerConfig.expressionFirstLine }}
          flush_interval 5s
          timeout_label @LOGS
      </filter>
      {{- end }}
      {{- end }}

      # Relabel all logs to ensure timeout logs are treated as normal logs and not ignored
      <match **>
          @type relabel
          @label @LOGS
      </match>

      <label @LOGS>
          # Create regexp filters for parsing internal logs of applications
          {{- range $pod := $distinctPods -}}
              {{- $config := first (parseJson $pod.ObjectMeta.Annotations.fluentdConfiguration) }}
              {{- range $containerConfig := $config.containers }}
                  {{- if (len $pod.Spec.Containers) eq 1 }}
                      <filter kubernetes.var.log.containers.{{ (index $pod.ObjectMeta.OwnerReferences 0).Name }}**_{{ $pod.ObjectMeta.Namespace }}_{{ (index $pod.Spec.Containers 0).Name }}**.log>
                  {{- else }}
                      <filter kubernetes.var.log.containers.{{ (index $pod.ObjectMeta.OwnerReferences 0).Name }}**_{{ $pod.ObjectMeta.Namespace }}_{{ $containerConfig.containerName }}**.log>
                  {{- end }}
                          @type parser
                          key_name log
                          reserve_data true
                          <parse>
                              @type regexp
                              expression {{ $containerConfig.expression }}
                              time_format {{ $containerConfig.timeFormat }}
                          </parse>
                      </filter>
              {{- end }}
          {{- end }}

          # Concatenate multi-line logs (>=16KB)
          <filter kubernetes.var.log.containers.**>
              @type concat
              key log
              multiline_end_regexp /\n$/
              separator ""
          </filter>

          # Send parsed logs to both output and notification labels
          <match **>
              @type copy
              deep_copy true
              # If one store raises an error, it ignores other stores. So adding `ignore_error` ensures that the log will be sent to all stores regardless of the error
              <store ignore_error>
                  @type relabel
                  @label @NOTIFICATION
              </store>
              <store ignore_error>
                  @type relabel
                  @label @OUTPUT
              </store>
          </match>

      </label>


      <label @OUTPUT>
      
      # Rewrite tags as pliro.kubernetes.** for pliro and stakater.kubernetes.** for the rest of the logs
        <match kubernetes.**>
          @type rewrite_tag_filter
          <rule>
            key $.kubernetes_namespace_name
            pattern /pliro-[a-z]+/
            tag stakater.${tag}
            invert true
          </rule>
          <rule>
            key $.kubernetes_namespace_name
            pattern /pliro-[a-z]+/
            tag $1.${tag}
          </rule>
        </match>
      
      # Send stakater.kubernetes.** to elasticsearch in logging stack
        <match stakater.kubernetes.**>
          @id elasticsearch
          @type elasticsearch
          @log_level info
          include_tag_key true
          type_name _doc
          host "#{ENV['OUTPUT_HOST']}"
          port "#{ENV['OUTPUT_PORT']}"
          scheme "#{ENV['OUTPUT_SCHEME']}"
          ssl_version "#{ENV['OUTPUT_SSL_VERSION']}"
          ssl_verify false
          logstash_prefix "#{ENV['LOGSTASH_PREFIX']}"
          logstash_format true
          flush_interval 30s
          # Never wait longer than 5 minutes between retries.
          max_retry_wait 60
          # Disable the limit on the number of retries (retry forever).
          disable_retry_limit
          time_key timestamp
          reload_connections false
        </match>
      
      # Send the remaining pliro-(tools|dev|prod).kubernetes.** to elasticsearch in namespace pliro-tools  
        <match *.kubernetes.**>  
          @id elasticsearch-pliro
          @type elasticsearch
          @log_level info
          include_tag_key true
          type_name _doc
          host "pliro-elasticsearch-data.pliro-tools"
          port "9200"
          scheme "#{ENV['OUTPUT_SCHEME']}"
          ssl_version "#{ENV['OUTPUT_SSL_VERSION']}"
          ssl_verify false
          logstash_prefix "#{ENV['LOGSTASH_PREFIX']}"
          logstash_format true
          flush_interval 30s
          # Never wait longer than 5 minutes between retries.
          max_retry_wait 60
          # Disable the limit on the number of retries (retry forever).
          disable_retry_limit
          time_key timestamp
          reload_connections false
        </match>
        
        
      </label>

      <label @NOTIFICATION>
          # Filter ERROR level logs
          <filter **>
              @type grep
              <regexp>
                  key level
                  pattern (ERROR|error|Error|^E[0-9]{4})
              </regexp>
          </filter>
      {{- if (len $distinctPods) ge 1 }}
      {{- range $pod := $distinctPods -}}
          {{- $config := first (parseJson $pod.ObjectMeta.Annotations.fluentdConfiguration) }} 
          # Create slack notification matchers for sending error notifications per app
          <match kubernetes.var.log.containers.{{ (index $pod.ObjectMeta.OwnerReferences 0).Name }}**_{{ $pod.ObjectMeta.Namespace }}_**.log>
          {{- if $config.notifications.slack }}
              @type copy
              <store ignore_error>
                  @type slack
                  webhook_url {{ $config.notifications.slack.webhookURL }}
                  channel {{ $config.notifications.slack.channelName }}
                  username fluentd
                  icon_url https://raw.githubusercontent.com/fluent/fluentd-docs/master/public/logo/Fluentd_square.png
                  flush_interval 15s
                  parse full
                  color danger
                  link_names false
                  title_keys level            
                  title %s log
                  message_keys level,timestamp,kubernetes_pod_name,kubernetes_namespace_name,message
                  message *Level* %s *Time* %s *Pod* %s *Namespace* %s *Message* %s
                  time_key timestamp
              </store>
          {{- else }}
              # notifications
              @type null
          {{- end }}
          </match>
      {{- end }}
      {{- else }}
          <match app.**>
          # distinctPods
          @type null
          </match>
      {{- end }}
      </label>
```

## Deploy a sample application

1. Create a separate namespace `konfig-demo`

```
oc create namespace konfig-demo
```
2. Deploy a sample nordmart application named `nordmart-konfig-demo` with regex passed under `values.deployment.fluentdConfigAnnotations`

```
apiVersion: helm.fluxcd.io/v1
kind: HelmRelease
metadata:
  name: nordmart-konfig-demo
  namespace: konfig-demo
spec:
  releaseName: nordmart-konfig-demo
  chart:
    repository: https://stakater.github.io/stakater-charts/
    name: application
    version: 0.0.12
  values:
    applicationName: "catalog"
    deployment:
      podLabels:
        app: catalog
      volumes: {}
      image:
        repository: docker-delivery.cp-stakater.com:443/stakater-lab/catalog
        tag: v0.0.19
      imagePullSecrets: "docker-registry-nexus-secret"
      fluentdConfigAnnotations:  
          regex: /^(?<time>\\d+(?:-\\d+){2}\\s+\\d+(?::\\d+){2}\\.\\d+)\\s*(?<level>\\S+) (?<pid>\\d+) --- \\[(?<thread>[\\s\\S]*?)\\] (?<class>\\S+)\\s*:\\s*(?<message>[\\s\\S]*?)(?=\\g<time>|\\Z)/
          regexFirstLine: /^\\d+(?:-\\d+){2}\\s+\\d+(?::\\d+){2}\\.\\d+/
          timeFormat: "%Y-%m-%d %H:%M:%S.%L"
      probes:
        readinessProbe:
          failureThreshold: 3
          periodSeconds: 10
          successThreshold: 1
          timeoutSeconds: 1
          initialDelaySeconds: 10
          httpGet:
            path: /actuator/health
            port: 8080
        livenessProbe:
          failureThreshold: 3
          periodSeconds: 10
          successThreshold: 1
          timeoutSeconds: 1
          initialDelaySeconds: 10
          httpGet:
            path: /actuator/health
            port: 8080
    service:
      ports:
      - port: 8080
        name: web
        protocol: TCP
        targetPort: 8080
    rbac:
      create: false
      serviceAccount:
        name: default
    configMap:
      enabled: false
```

3. Konfigurator operator in `logging` namespace will read the annotations from the newly created deployment and generate the fluentd config with name `konfigurator-stakater-logging-fluentd-elasticsearch-rendered` and mounts the new configMap on `stakater-logging-fluentd-elasticsearch` DaemonSet in `logging` namespace.

4. `Reloader` operator running in the `control` namespace will rollout the daemonset with the new configMap mounted because of the following annotation on fluentd-elasticsearch daemonset.
```
configmap.reloader.stakater.com/reload: konfigurator-stakater-logging-fluentd-elasticsearch-rendered
```