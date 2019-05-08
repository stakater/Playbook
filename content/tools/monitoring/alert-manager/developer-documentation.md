# Alertmanager

## Introduction

It is part of Prometheus's alerting feature. Alert rules are defined in Prometheus server that send alerts to Alertmanager. Once alerts are received Alertmanager can group, inhibit or silence them. Details can be found on this [link](https://prometheus.io/docs/alerting/configuration/)

### Chart
Prometheus-operator public helm [chart's](https://github.com/helm/charts/tree/master/stable/prometheus-operator) version `5.0.13` is being used to deploy alertmanager on cluster. [StakaterKubeHelmMonitoring](https://github.com/stakater/StakaterKubeHelmMonitoring) repository is being used for deployment.

### Image Issue
None

### Cherry Pickable
No

### Single Sign On
Not applicable

## Installation
It will be deployed by the pipeline of [StakaterKubeHelmMonitoring](https://github.com/stakater/StakaterKubeHelmMonitoring) repository. 

### Dependencies
It requires helm operator running in the cluster.

### Hard-coded-values
Hard coded values for alertmanager are given below:

It will enable ingress and configure annotations.
```yaml
alertmanager:
  ingress:
    enabled: true
    annotations:
      xposer.stakater.com/annotations: |-
        kubernetes.io/ingress.class: external-ingress
        ingress.kubernetes.io/rewrite-target: /
        ingress.kubernetes.io/force-ssl-redirect: true
```