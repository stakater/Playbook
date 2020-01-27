# Alert Manager in openshift

To create alert manager in openshift:

- Create a file named alertManagerConfig.tmpl.yaml with the following content

    ```yaml
    global:
    resolve_timeout: 5m
    route:
    group_by:
    - alertname
    - cluster
    - service
    group_wait: 30s
    group_interval: 5m
    repeat_interval: 1h
    receiver: alerts-null
    routes:
    - match:
        alertname: WatchDog
        receiver: alerts-null
    - receiver: alerts
    inhibit_rules:
    - source_match:
        severity: critical
    target_match:
        severity: warning
    equal:
    - alertname
    - cluster
    - service
    receivers:
    - name: alerts
    slack_configs:
    - api_url: "{SLACK_WEBHOOK_URL}"
        channel: "#alerts"
        title: '[{{ .Status | toUpper }}{{ if eq .Status "firing" }}:{{ .Alerts.Firing
        | len }}{{ end }}] Prometheus Event Notification'
        title_link: |2
        https://alertmanager-operated-{NAMESPACE}.kubehealth.com
        text: |2-

        {{ range .Alerts }}
            *Alert:* {{ .Annotations.summary }} - `{{ .Labels.severity }}`

            *Description:* {{ .Annotations.description }}

            *Graph:* <{{ .GeneratorURL }}|:chart_with_upwards_trend:> *Runbook:* <{{ .Annotations.runbook }}|:spiral_note_pad:>

            *Details:*

            {{ range .Labels.SortedPairs }} *{{ .Name }}:* `{{ .Value }}`

            {{ end }}

        {{ end }}
        send_resolved: true
    - name: alerts-null
    ```

    Feel free to modify the config to suite your needs. This sample config sends all alerts except `WatchDog` to slack via webhook. Do replace `{SLACK_WEBHOOK_URL}` with the link of your webhook.

- Next create a file named `alertManager.tmpl.yaml` with the following content

    ```bash
    apiVersion: monitoring.coreos.com/v1
    kind: Alertmanager
    metadata:
    name: alertmanager-dev
    namespace: {NAMESPACE}
    spec:
    replicas: 1
    securityContext: {}
    ---
    apiVersion: v1
    kind: Secret
    type: Opaque
    metadata:
    labels:
        k8s-app: alertmanager
    name: alertmanager-alertmanager-dev
    namespace: {NAMESPACE}
    data:
    alertmanager.yaml: >-
        {CONFIG_BASE64}
    ---
    apiVersion: route.openshift.io/v1
    kind: Route
    metadata:
    name: alertmanager-operated
    namespace: {NAMESPACE}
    spec:
    port:
        targetPort: web
    tls:
        insecureEdgeTerminationPolicy: Redirect
        termination: edge
    to:
        kind: Service
        name: alertmanager-operated
        weight: 100
    wildcardPolicy: None
    ```

- Now execute

    ```bash
    NAMESPACE="monitoring"
    REPLACE_NAMESPACE="s/{NAMESPACE}/$NAMESPACE/g"
    REPLACE_CONFIG="s/{CONFIG_BASE64}/$(sed $REPLACE_NAMESPACE alertManagerConfig.tmpl.yaml | base64 -w 0)/g"

    sed ${REPLACE_NAMESPACE} alertManager.tmpl.yaml | sed ${REPLACE_CONFIG} | oc apply --namespace ${NAMESPACE} -f -

    ```