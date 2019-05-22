# Grafana

## Introduction
Grafana is an open source metric analytics & visualization suite with support for Elasticsearch, Prometheus etc. Currently, it is being used with Prometheus.

### Chart
Prometheus-operator public helm [chart's](https://github.com/helm/charts/tree/master/stable/prometheus-operator) version `5.0.13` is being used to deploy grafana on cluster. [StakaterKubeHelmMonitoring](https://github.com/stakater/StakaterKubeHelmMonitoring) repository is being used for deployment.

### Image Issue
None. Image specifications are given below:
```yaml
repository: grafana/grafana
tag: 6.1.3
```

### Cherry Pickable
No, becuase it is being deployed with `Prometheus-Operator` helm charts. Although it can be deployed using its own helm chart.

### Single Sign On
Applicable but not supported.

## Installation
It will be deployed by the pipeline of [StakaterKubeHelmMonitoring](https://github.com/stakater/StakaterKubeHelmMonitoring) repository.

### Dependencies
It requires helm operator to be running in cluster.

### Chart Information
Chart information is given below:

```yaml
name: grafana
version: 3.2.*
repository: https://kubernetes-charts.storage.googleapis.com/
condition: grafana.enabled
```

### Hard-coded-values

Hard coded values for grafana are given below:

Parameters given below will enable grafana sidecar dashboard, so that additional dashboard can be added in grafana.
```yaml
grafana:
  sidecar:
    dashboards:
      enabled: true
```

It will configure default password for `admin` user. Default user is `admin` and no approach is specified to change it, in `prometheus-operator` documentation. 
```yaml
grafana:
  adminPassword: "get password from team lead"
```

It will configure rbac for grafana at namespace level.
```yaml  
grafana:
  rbac:
    create: true
    namespaced: true
```

It will enable ingress and configure annotations.
```yaml
grafana:
  ingress:
    enabled: "true"
    annotations:
      kubernetes.io/ingress.class: "external-ingress"
      ingress.kubernetes.io/rewrite-target: "/"
      ingress.kubernetes.io/force-ssl-redirect: "true"
      forecastle.stakater.com/expose: "true"
      forecastle.stakater.com/icon: https://raw.githubusercontent.com/stakater/ForecastleIcons/master/grafana.png
      forecastle.stakater.com/appName: Grafana
```