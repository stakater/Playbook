# Prometheus

## Introduction
It is an opensource monitoring solution for metrics and alerting.

### Chart
Prometheus-operator public helm [chart's](https://github.com/helm/charts/tree/master/stable/prometheus-operator) version `5.0.13` is being used to deploy grafana on cluster. [StakaterKubeHelmMonitoring](https://github.com/stakater/StakaterKubeHelmMonitoring) repository is being used for deployment.

### Image Issue
None. Image specifications are given below:
```yaml
repository: quay.io/prometheus/prometheus
tag: v2.7.2
```

### Cherry Pickable
No, becuase it is being deployed with `Prometheus-Operator` helm charts. Although, it can be deployed using its own helm chart.


### Single Sign On
Not applicable.

## Installation
It will be deployed by the pipeline of [StakaterKubeHelmMonitoring](https://github.com/stakater/StakaterKubeHelmMonitoring) repository.

### Dependencies
It requires helm operator to be running in cluster.

### Chart Infromation
It is part of prometheus-operator chart.

```yaml
repository: https://kubernetes-charts.storage.googleapis.com
name: prometheus-operator
version: 5.0.13
```

### Hard-coded-values
Hard coded values for Prometheus are given below:

It will configure additional prometheus rules
```yaml
additionalPrometheusRules:
  name: fluentd-rules
  additionalLabels:
    kind: infra
  groups:
  - name: Fluentd
    rules:
    - alert: IncreasedFluentdRetryWait
      expr: max_over_time(fluentd_output_status_retry_wait[1m]) > 1000
      for: 20s
      labels:
        severity: critical    
        kind: infra            
      annotations:
        description: 'Fluentd Output Status Retry Wait has increased from 1000 in 1 minute'
        summary: Retry Wait Increased
    - alert: IncreasedFluentdRetryCount
      expr: rate(fluentd_output_status_retry_count[1m]) > 0.5
      for: 20s
      labels:
        severity: critical     
        kind: infra           
      annotations:
        description: 'Rate of Fluentd Output Retry Count has increased from 0.5 in 1m'
        summary: Retry Wait Increased
    - alert: IncreasedFluentdOutputBufferLength
      expr: max_over_time(fluentd_output_status_buffer_queue_length[1m]) > 500
      for: 10s
      labels:
        severity: critical
        kind: infra
      annotations:
        description: 'Fluentd Output Status Buffer Queue length has increased from 500.'
        summary: Fluentd Buffer Queue length Increased
```

It will configure additional service monitors
```yaml
prometheus:
  # Adding additional service monitors
  additionalServiceMonitors:
  - name: monitoring-fluentd
    jobLabel: k8s-app
    selector:
      matchLabels:
        app.kubernetes.io/name: fluentd-elasticsearch
    namespaceSelector:
      matchNames:
        - logging
    endpoints:
    - port: monitor-agent
      scheme: http
      interval: 20s
      path: /metrics

  - name: external-ingress
    jobLabel: k8s-app
    selector:
      matchLabels:
        k8s-app: external-ingress             
    namespaceSelector:
      matchNames:
        - global
    endpoints:
    - port: metrics
      interval: 30s
    
  - name: internal-ingress
    jobLabel: k8s-app
    selector:
      matchLabels:
        k8s-app: internal-ingress
    namespaceSelector:
      matchNames:
        - global 
    endpoints:
    - port: metrics
      interval: 30s
```

It will configure service and its annotations
```yaml
prometheus:
  service:
    labels:
      expose: true
    annotations:
      config.xposer.stakater.com/Domain: stakater.com
      config.xposer.stakater.com/IngressNameTemplate: '{{.Service}}-{{.Namespace}}'
      config.xposer.stakater.com/IngressURLPath: /
      config.xposer.stakater.com/IngressURLTemplate: 'prometheus.{{.Namespace}}.{{.Domain}}'
      xposer.stakater.com/annotations: |-
        kubernetes.io/ingress.class: external-ingress
        ingress.kubernetes.io/rewrite-target: /
        ingress.kubernetes.io/force-ssl-redirect: true
        forecastle.stakater.com/expose: true
        forecastle.stakater.com/icon: https://raw.githubusercontent.com/stakater/ForecastleIcons/master/prometheus.png
        forecastle.stakater.com/appName: Prometheus  
```