# Konfigurator

A kubernetes operator that dynamically generates and manages app configuration based on kubernetes resources. You can deploy reosurces with dynamic configuration.

Our most common use case is to deploy it in fluentd, as we use separate parsing configs for different apps. So Konfigurator automatically changes the configmap for fluentd, once an app is added or removed. And Fluentd will be able to parse different apps based on their own annotations.

To deploy fluentd config with Konfigurator, follow these steps:

## Deploy Konfigurator

Deploy [Konfigurator](https://github.com/stakater/konfigurator) using the manifests at: https://raw.githubusercontent.com/stakater/Konfigurator/master/deployments/kubernetes/konfigurator.yaml.

If you want to deploy Konfigurator globally, update

```yaml
            - name: WATCH_NAMESPACE
              valueFrom:
                fieldRef:
                  fieldPath: metadata.namespace
```

to

```yaml
            - name: WATCH_NAMESPACE
              value: ""
```

## Deploy Fluentd

### Daemonset

Deploy Fluentd Daemonset using:

```yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: stakater-fluentd-elasticsearch
  labels:
    app.kubernetes.io/name: fluentd-elasticsearch
    helm.sh/chart: fluentd-elasticsearch-2.0.3
    app.kubernetes.io/instance: stakater
    app.kubernetes.io/managed-by: Tiller
    kubernetes.io/cluster-service: "true"
    addonmanager.kubernetes.io/mode: Reconcile
  annotations:
    configmap.reloader.stakater.com/reload: konfigurator-stakater-fluentd-elasticsearch-rendered, stakater-fluentd-elasticsearch
spec:
  updateStrategy:
    type: RollingUpdate
  selector:
    matchLabels:
      app.kubernetes.io/name: fluentd-elasticsearch
      app.kubernetes.io/instance: stakater
  template:
    metadata:
      labels:
        app.kubernetes.io/name: fluentd-elasticsearch
        helm.sh/chart: fluentd-elasticsearch-2.0.3
        app.kubernetes.io/instance: stakater
        app.kubernetes.io/managed-by: Tiller
        kubernetes.io/cluster-service: "true"
      # This annotation ensures that fluentd does not get evicted if the node
      # supports critical pod annotation based priority scheme.
      # Note that this does not guarantee admission on the nodes (#40573).
      annotations:
        scheduler.alpha.kubernetes.io/critical-pod: ''
        checksum/config: 4a8b1ab8860313b45f801383977bf2eae501aa19d6d8c8c07f85982eee1b9401
        prometheus.io/port: "24231"
        prometheus.io/scrape: "true"
    spec:
      serviceAccountName: stakater-fluentd-elasticsearch
      containers:
      - name: stakater-fluentd-elasticsearch
        image:  "stakater/fluentd-elasticsearch:v1.0.0"
        imagePullPolicy: "Always"
        env:
        - name: FLUENTD_ARGS
          value: --no-supervisor -q
        - name: OUTPUT_HOST
          value: "elasticsearch-logging-es-cluster.cp"
        - name: OUTPUT_PORT
          value: "9200"
        - name: LOGSTASH_PREFIX
          value: "logstash"
        - name: OUTPUT_SCHEME
          value: "http"
        - name: OUTPUT_SSL_VERSION
          value: "TLSv1_2"
        - name: OUTPUT_BUFFER_CHUNK_LIMIT
          value: "2M"
        - name: OUTPUT_BUFFER_QUEUE_LIMIT
          value: "8"
        - name: K8S_NODE_NAME
          valueFrom:
            fieldRef:
              fieldPath: spec.nodeName
        resources:
          {}
        volumeMounts:
        - name: varlog
          mountPath: /var/log
        - name: varlibdockercontainers
          mountPath: /var/lib/docker/containers
          readOnly: true
        - name: libsystemddir
          mountPath: /host/lib
          readOnly: true
        - name: config-volume
          mountPath: /etc/fluent/config.d
        ports:
          - name: monitor-agent
            containerPort: 24231
        # Liveness probe is aimed to help in situarions where fluentd
        # silently hangs for no apparent reasons until manual restart.
        # The idea of this probe is that if fluentd is not queueing or
        # flushing chunks for 5 minutes, something is not right. If
        # you want to change the fluentd configuration, reducing amount of
        # logs fluentd collects, consider changing the threshold or turning
        # liveness probe off completely.
        livenessProbe:
          initialDelaySeconds: 600
          periodSeconds: 60
          exec:
            command:
            - '/bin/sh'
            - '-c'
            - >
              LIVENESS_THRESHOLD_SECONDS=${LIVENESS_THRESHOLD_SECONDS:-300};
              STUCK_THRESHOLD_SECONDS=${LIVENESS_THRESHOLD_SECONDS:-900};
              if [ ! -e /var/log/fluentd-buffers ];
              then
                exit 1;
              fi;
              touch -d "${STUCK_THRESHOLD_SECONDS} seconds ago" /tmp/marker-stuck;
              if [[ -z "$(find /var/log/fluentd-buffers -type f -newer /tmp/marker-stuck -print -quit)" ]];
              then
                rm -rf /var/log/fluentd-buffers;
                exit 1;
              fi;
              touch -d "${LIVENESS_THRESHOLD_SECONDS} seconds ago" /tmp/marker-liveness;
              if [[ -z "$(find /var/log/fluentd-buffers -type f -newer /tmp/marker-liveness -print -quit)" ]];
              then
                exit 1;
              fi;
      terminationGracePeriodSeconds: 30
      volumes:
      - name: varlog
        hostPath:
          path: /var/log
      - name: varlibdockercontainers
        hostPath:
          path: /var/lib/docker/containers
      # It is needed to copy systemd library to decompress journals
      - name: libsystemddir
        hostPath:
          path: /usr/lib64
      - name: config-volume
        configMap:
          name: stakater-fluentd-elasticsearch
      tolerations:
      - effect: NoSchedule
        operator: Exists
```

change values of `OUTPUT_HOST` in above configuration and set it to your Elasticsearch Host.

### Configmap

Deploy configmap for fluentd configuration:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: stakater-fluentd-elasticsearch
  labels:
    app.kubernetes.io/name: fluentd-elasticsearch
    helm.sh/chart: fluentd-elasticsearch-2.0.3
    app.kubernetes.io/instance: stakater
    app.kubernetes.io/managed-by: Tiller
    kubernetes.io/cluster-service: "true"
    addonmanager.kubernetes.io/mode: Reconcile
data:
  containers.input.conf: |-
    # This configuration file for Fluentd / td-agent is used
    # to watch changes to Docker log files. The kubelet creates symlinks that
    # capture the pod name, namespace, container name & Docker container ID
    # to the docker logs for pods in the /var/log/containers directory on the host.
    # If running this fluentd configuration in a Docker container, the /var/log
    # directory should be mounted in the container.
    #
    # These logs are then submitted to Elasticsearch which assumes the
    # installation of the fluent-plugin-elasticsearch & the
    # fluent-plugin-kubernetes_metadata_filter plugins.
    # See https://github.com/uken/fluent-plugin-elasticsearch &
    # https://github.com/fabric8io/fluent-plugin-kubernetes_metadata_filter for
    # more information about the plugins.
    #
    # Example
    # =======
    # A line in the Docker log file might look like this JSON:
    #
    # {"log":"2014/09/25 21:15:03 Got request with path wombat\n",
    #  "stream":"stderr",
    #   "time":"2014-09-25T21:15:03.499185026Z"}
    #
    # The time_format specification below makes sure we properly
    # parse the time format produced by Docker. This will be
    # submitted to Elasticsearch and should appear like:
    # $ curl 'http://elasticsearch-logging:9200/_search?pretty'
    # ...
    # {
    #      "_index" : "logstash-2014.09.25",
    #      "_type" : "fluentd",
    #      "_id" : "VBrbor2QTuGpsQyTCdfzqA",
    #      "_score" : 1.0,
    #      "_source":{"log":"2014/09/25 22:45:50 Got request with path wombat\n",
    #                 "stream":"stderr","tag":"docker.container.all",
    #                 "@timestamp":"2014-09-25T22:45:50+00:00"}
    #    },
    # ...
    #
    # The Kubernetes fluentd plugin is used to write the Kubernetes metadata to the log
    # record & add labels to the log record if properly configured. This enables users
    # to filter & search logs on any metadata.
    # For example a Docker container's logs might be in the directory:
    #
    #  /var/lib/docker/containers/997599971ee6366d4a5920d25b79286ad45ff37a74494f262e3bc98d909d0a7b
    #
    # and in the file:
    #
    #  997599971ee6366d4a5920d25b79286ad45ff37a74494f262e3bc98d909d0a7b-json.log
    #
    # where 997599971ee6... is the Docker ID of the running container.
    # The Kubernetes kubelet makes a symbolic link to this file on the host machine
    # in the /var/log/containers directory which includes the pod name and the Kubernetes
    # container name:
    #
    #    synthetic-logger-0.25lps-pod_default_synth-lgr-997599971ee6366d4a5920d25b79286ad45ff37a74494f262e3bc98d909d0a7b.log
    #    ->
    #    /var/lib/docker/containers/997599971ee6366d4a5920d25b79286ad45ff37a74494f262e3bc98d909d0a7b/997599971ee6366d4a5920d25b79286ad45ff37a74494f262e3bc98d909d0a7b-json.log
    #
    # The /var/log directory on the host is mapped to the /var/log directory in the container
    # running this instance of Fluentd and we end up collecting the file:
    #
    #   /var/log/containers/synthetic-logger-0.25lps-pod_default_synth-lgr-997599971ee6366d4a5920d25b79286ad45ff37a74494f262e3bc98d909d0a7b.log
    #
    # This results in the tag:
    #
    #  var.log.containers.synthetic-logger-0.25lps-pod_default_synth-lgr-997599971ee6366d4a5920d25b79286ad45ff37a74494f262e3bc98d909d0a7b.log
    #
    # The Kubernetes fluentd plugin is used to extract the namespace, pod name & container name
    # which are added to the log message as a kubernetes field object & the Docker container ID
    # is also added under the docker field object.
    # The final tag is:
    #
    #   kubernetes.var.log.containers.synthetic-logger-0.25lps-pod_default_synth-lgr-997599971ee6366d4a5920d25b79286ad45ff37a74494f262e3bc98d909d0a7b.log
    #
    # And the final log record look like:
    #
    # {
    #   "log":"2014/09/25 21:15:03 Got request with path wombat\n",
    #   "stream":"stderr",
    #   "time":"2014-09-25T21:15:03.499185026Z",
    #   "kubernetes": {
    #     "namespace": "default",
    #     "pod_name": "synthetic-logger-0.25lps-pod",
    #     "container_name": "synth-lgr"
    #   },
    #   "docker": {
    #     "container_id": "997599971ee6366d4a5920d25b79286ad45ff37a74494f262e3bc98d909d0a7b"
    #   }
    # }
    #
    # This makes it easier for users to search for logs by pod name or by
    # the name of the Kubernetes container regardless of how many times the
    # Kubernetes pod has been restarted (resulting in a several Docker container IDs).
    # Json Log Example:
    # {"log":"[info:2016-02-16T16:04:05.930-08:00] Some log text here\n","stream":"stdout","time":"2016-02-17T00:04:05.931087621Z"}
    # CRI Log Example:
    # 2016-02-17T00:04:05.931087621Z stdout F [info:2016-02-16T16:04:05.930-08:00] Some log text here
    <source>
      @id fluentd-containers.log
      @type tail
      path /var/log/containers/*.log
      pos_file /var/log/fluentd-containers.log.pos
      time_format %Y-%m-%dT%H:%M:%S.%NZ
      tag raw.kubernetes.*
      format json
      read_from_head true
    </source>
    # Detect exceptions in the log output and forward them as one log entry.
    <match raw.kubernetes.**>
      @id raw.kubernetes
      @type detect_exceptions
      remove_tag_prefix raw
      message log
      stream stream
      multiline_flush_interval 5
      max_bytes 500000
      max_lines 1000
    </match>
  forward.input.conf: |-
    # Takes the messages sent over TCP
    <source>
      @type forward
      port 24224
    </source>
  monitoring.conf: |-
    # Prometheus Exporter Plugin
    # input plugin that exports metrics
    <source>
      @type prometheus
    </source>
    <source>
      @type monitor_agent
    </source>
    # input plugin that collects metrics from MonitorAgent
    <source>
      @type prometheus_monitor
      <labels>
        host ${hostname}
      </labels>
    </source>
    # input plugin that collects metrics for output plugin
    <source>
      @type prometheus_output_monitor
      <labels>
        host ${hostname}
      </labels>
    </source>
    # input plugin that collects metrics for in_tail plugin
    <source>
      @type prometheus_tail_monitor
      <labels>
        host ${hostname}
      </labels>
    </source>
  system.conf: |-
    <system>
      root_dir /tmp/fluentd-buffers/
    </system>
  system.input.conf: |-
    # Example:
    # 2015-12-21 23:17:22,066 [salt.state       ][INFO    ] Completed state [net.ipv4.ip_forward] at time 23:17:22.066081
    <source>
      @id minion
      @type tail
      format /^(?<time>[^ ]* [^ ,]*)[^\[]*\[[^\]]*\]\[(?<severity>[^ \]]*) *\] (?<message>.*)$/
      time_format %Y-%m-%d %H:%M:%S
      path /var/log/salt/minion
      pos_file /var/log/salt.pos
      tag salt
    </source>
    # Example:
    # Dec 21 23:17:22 gke-foo-1-1-4b5cbd14-node-4eoj startupscript: Finished running startup script /var/run/google.startup.script
    <source>
      @id startupscript.log
      @type tail
      format syslog
      path /var/log/startupscript.log
      pos_file /var/log/startupscript.log.pos
      tag startupscript
    </source>
    # Examples:
    # time="2016-02-04T06:51:03.053580605Z" level=info msg="GET /containers/json"
    # time="2016-02-04T07:53:57.505612354Z" level=error msg="HTTP Error" err="No such image: -f" statusCode=404
    <source>
      @id docker.log
      @type tail
      format /^time="(?<time>[^)]*)" level=(?<severity>[^ ]*) msg="(?<message>[^"]*)"( err="(?<error>[^"]*)")?( statusCode=($<status_code>\d+))?/
      path /var/log/docker.log
      pos_file /var/log/docker.log.pos
      tag docker
    </source>
    # Example:
    # 2016/02/04 06:52:38 filePurge: successfully removed file /var/etcd/data/member/wal/00000000000006d0-00000000010a23d1.wal
    <source>
      @id etcd.log
      @type tail
      # Not parsing this, because it doesn't have anything particularly useful to
      # parse out of it (like severities).
      format none
      path /var/log/etcd.log
      pos_file /var/log/etcd.log.pos
      tag etcd
    </source>
    # Multi-line parsing is required for all the kube logs because very large log
    # statements, such as those that include entire object bodies, get split into
    # multiple lines by glog.
    # Example:
    # I0204 07:32:30.020537    3368 server.go:1048] POST /stats/container/: (13.972191ms) 200 [[Go-http-client/1.1] 10.244.1.3:40537]
    <source>
      @id kubelet.log
      @type tail
      format multiline
      multiline_flush_interval 5s
      format_firstline /^\w\d{4}/
      format1 /^(?<severity>\w)(?<time>\d{4} [^\s]*)\s+(?<pid>\d+)\s+(?<source>[^ \]]+)\] (?<message>.*)/
      time_format %m%d %H:%M:%S.%N
      path /var/log/kubelet.log
      pos_file /var/log/kubelet.log.pos
      tag kubelet
    </source>
    # Example:
    # I1118 21:26:53.975789       6 proxier.go:1096] Port "nodePort for kube-system/default-http-backend:http" (:31429/tcp) was open before and is still needed
    <source>
      @id kube-proxy.log
      @type tail
      format multiline
      multiline_flush_interval 5s
      format_firstline /^\w\d{4}/
      format1 /^(?<severity>\w)(?<time>\d{4} [^\s]*)\s+(?<pid>\d+)\s+(?<source>[^ \]]+)\] (?<message>.*)/
      time_format %m%d %H:%M:%S.%N
      path /var/log/kube-proxy.log
      pos_file /var/log/kube-proxy.log.pos
      tag kube-proxy
    </source>
    # Example:
    # I0204 07:00:19.604280       5 handlers.go:131] GET /api/v1/nodes: (1.624207ms) 200 [[kube-controller-manager/v1.1.3 (linux/amd64) kubernetes/6a81b50] 127.0.0.1:38266]
    <source>
      @id kube-apiserver.log
      @type tail
      format multiline
      multiline_flush_interval 5s
      format_firstline /^\w\d{4}/
      format1 /^(?<severity>\w)(?<time>\d{4} [^\s]*)\s+(?<pid>\d+)\s+(?<source>[^ \]]+)\] (?<message>.*)/
      time_format %m%d %H:%M:%S.%N
      path /var/log/kube-apiserver.log
      pos_file /var/log/kube-apiserver.log.pos
      tag kube-apiserver
    </source>
    # Example:
    # I0204 06:55:31.872680       5 servicecontroller.go:277] LB already exists and doesn't need update for service kube-system/kube-ui
    <source>
      @id kube-controller-manager.log
      @type tail
      format multiline
      multiline_flush_interval 5s
      format_firstline /^\w\d{4}/
      format1 /^(?<severity>\w)(?<time>\d{4} [^\s]*)\s+(?<pid>\d+)\s+(?<source>[^ \]]+)\] (?<message>.*)/
      time_format %m%d %H:%M:%S.%N
      path /var/log/kube-controller-manager.log
      pos_file /var/log/kube-controller-manager.log.pos
      tag kube-controller-manager
    </source>
    # Example:
    # W0204 06:49:18.239674       7 reflector.go:245] pkg/scheduler/factory/factory.go:193: watch of *api.Service ended with: 401: The event in requested index is outdated and cleared (the requested history has been cleared [2578313/2577886]) [2579312]
    <source>
      @id kube-scheduler.log
      @type tail
      format multiline
      multiline_flush_interval 5s
      format_firstline /^\w\d{4}/
      format1 /^(?<severity>\w)(?<time>\d{4} [^\s]*)\s+(?<pid>\d+)\s+(?<source>[^ \]]+)\] (?<message>.*)/
      time_format %m%d %H:%M:%S.%N
      path /var/log/kube-scheduler.log
      pos_file /var/log/kube-scheduler.log.pos
      tag kube-scheduler
    </source>
    # Example:
    # I1104 10:36:20.242766       5 rescheduler.go:73] Running Rescheduler
    <source>
      @id rescheduler.log
      @type tail
      format multiline
      multiline_flush_interval 5s
      format_firstline /^\w\d{4}/
      format1 /^(?<severity>\w)(?<time>\d{4} [^\s]*)\s+(?<pid>\d+)\s+(?<source>[^ \]]+)\] (?<message>.*)/
      time_format %m%d %H:%M:%S.%N
      path /var/log/rescheduler.log
      pos_file /var/log/rescheduler.log.pos
      tag rescheduler
    </source>
    # Example:
    # I0603 15:31:05.793605       6 cluster_manager.go:230] Reading config from path /etc/gce.conf
    <source>
      @id glbc.log
      @type tail
      format multiline
      multiline_flush_interval 5s
      format_firstline /^\w\d{4}/
      format1 /^(?<severity>\w)(?<time>\d{4} [^\s]*)\s+(?<pid>\d+)\s+(?<source>[^ \]]+)\] (?<message>.*)/
      time_format %m%d %H:%M:%S.%N
      path /var/log/glbc.log
      pos_file /var/log/glbc.log.pos
      tag glbc
    </source>
    # Example:
    # I0603 15:31:05.793605       6 cluster_manager.go:230] Reading config from path /etc/gce.conf
    <source>
      @id cluster-autoscaler.log
      @type tail
      format multiline
      multiline_flush_interval 5s
      format_firstline /^\w\d{4}/
      format1 /^(?<severity>\w)(?<time>\d{4} [^\s]*)\s+(?<pid>\d+)\s+(?<source>[^ \]]+)\] (?<message>.*)/
      time_format %m%d %H:%M:%S.%N
      path /var/log/cluster-autoscaler.log
      pos_file /var/log/cluster-autoscaler.log.pos
      tag cluster-autoscaler
    </source>
    # Audit logs
    <source>
      @type tail
      @id in_tail_kube_apiserver_audit
      multiline_flush_interval 5s
      path /var/log/kubernetes/kube-apiserver-audit.log
      pos_file /var/log/kube-apiserver-audit.log.pos
      tag kube-apiserver-audit
      <parse>
        @type json
        keep_time_key true
        time_key timestamp
        time_format %Y-%m-%dT%TZ
      </parse>
    </source>
    # Logs from systemd-journal for interesting services.
    <source>
      @id journald-docker
      @type systemd
      matches [{ "_SYSTEMD_UNIT": "docker.service" }]
      <storage>
        @type local
        persistent true
        path /var/log/journald-docker.pos
      </storage>
      read_from_head true
      tag docker
    </source>
    <source>
      @id journald-kubelet
      @type systemd
      matches [{ "_SYSTEMD_UNIT": "kubelet.service" }]
      <storage>
        @type local
        persistent true
        path /var/log/journald-kubelet.pos
      </storage>
      read_from_head true
      tag kubelet
    </source>
    <source>
      @id journald-node-problem-detector
      @type systemd
      matches [{ "_SYSTEMD_UNIT": "node-problem-detector.service" }]
      <storage>
        @type local
        persistent true
        path /var/log/journald-node-problem-detector.pos
      </storage>
      read_from_head true
      tag node-problem-detector
    </source>
    # Logs from systemd-journal for interesting services.
    <source>
      @type systemd
      @id in_systemd_bootkube
      matches [{ "_SYSTEMD_UNIT": "bootkube.service" }]
      <storage>
        @type local
        persistent true
        path /var/log/fluentd-journald-bootkube-cursor.json
      </storage>
      read_from_head true
      tag bootkube
    </source>
```

### Deploy RBAC

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: stakater-fluentd-elasticsearch
  labels:
    app.kubernetes.io/name: fluentd-elasticsearch
    helm.sh/chart: fluentd-elasticsearch-2.0.3
    app.kubernetes.io/instance: stakater
    app.kubernetes.io/managed-by: Tiller
    kubernetes.io/cluster-service: "true"
    addonmanager.kubernetes.io/mode: Reconcile
---
# Source: fluentd-elasticsearch/templates/clusterrole.yaml
kind: ClusterRole
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: stakater-fluentd-elasticsearch
  labels:
    app.kubernetes.io/name: fluentd-elasticsearch
    helm.sh/chart: fluentd-elasticsearch-2.0.3
    app.kubernetes.io/instance: stakater
    app.kubernetes.io/managed-by: Tiller
    kubernetes.io/cluster-service: "true"
    addonmanager.kubernetes.io/mode: Reconcile
rules:
- apiGroups:
  - ""
  resources:
  - "namespaces"
  - "pods"
  verbs:
  - "get"
  - "watch"
  - "list"
---
# Source: fluentd-elasticsearch/templates/clusterrolebinding.yaml
kind: ClusterRoleBinding
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: stakater-fluentd-elasticsearch
  labels:
    app.kubernetes.io/name: fluentd-elasticsearch
    helm.sh/chart: fluentd-elasticsearch-2.0.3
    app.kubernetes.io/instance: stakater
    app.kubernetes.io/managed-by: Tiller
    kubernetes.io/cluster-service: "true"
    addonmanager.kubernetes.io/mode: Reconcile
subjects:
- kind: ServiceAccount
  name: stakater-fluentd-elasticsearch
  namespace: cp
roleRef:
  kind: ClusterRole
  name: stakater-fluentd-elasticsearch
  apiGroup: rbac.authorization.k8s.io
```

### Deploy Service

```yaml
apiVersion: v1
kind: Service
metadata:
  name: stakater-fluentd-elasticsearch
  labels:
    app.kubernetes.io/name: fluentd-elasticsearch
    helm.sh/chart: fluentd-elasticsearch-2.0.3
    app.kubernetes.io/instance: stakater
    app.kubernetes.io/managed-by: Tiller
    kubernetes.io/cluster-service: "true"
    addonmanager.kubernetes.io/mode: Reconcile
spec:
  type: ClusterIP
  ports:
    - name: monitor-agent
      port: 24231
      targetPort: 24231
  selector:
    app.kubernetes.io/name: fluentd-elasticsearch
    app.kubernetes.io/instance: stakater
```

## Deploy Konfigurator template

Deploy Konfigurator template and it will create a configmap, which will be replace the default confs. To deploy Konfigurator Template, you must have Konfigurator deployed, check the first step.

```yaml
apiVersion: konfigurator.stakater.com/v1alpha1
kind: KonfiguratorTemplate
metadata:
  labels:
    app: konfigurator
  name: fluentd
spec:
  renderTarget: ConfigMap
  app:
    name: stakater-fluentd-elasticsearch
    kind: DaemonSet
    volumeMounts:
    - mountPath: /etc/fluent
      container: stakater-fluentd-elasticsearch
  templates:
    fluent.conf: |-
      # Do not collect fluentd's own logs to avoid infinite loops.
      <match fluent.**>
          @type null
      </match>

      @include /etc/fluent/config.d/*.conf

      <match kubernetes.var.log.containers.**fluentd**.log>
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
          # Send logs to Elasticsearch
          <match **>
              @id elasticsearch
              @type elasticsearch
              @log_level debug
              include_tag_key true
              type_name fluentd
              host "#{ENV['OUTPUT_HOST']}"
              port "#{ENV['OUTPUT_PORT']}"
              scheme "#{ENV['OUTPUT_SCHEME']}"
              ssl_version "#{ENV['OUTPUT_SSL_VERSION']}"
              logstash_format true
              ssl_verify false
              logstash_prefix "#{ENV['LOGSTASH_PREFIX']}"
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

This will start fluentd with konfigurator, and fluentd will start sending logs to Elasticsearch, you can look in Kibana to confirm.

## Troubleshooting

If face 400 Rejected By Elasticsearch error, look [400 Rejected By Elasticsearch](https://github.com/stakater/til/blob/596dc50b552a9bb8524faeafd58d2e7642851509/elasticsearch/400-rejected-by-elasticsearch.md)  for solution