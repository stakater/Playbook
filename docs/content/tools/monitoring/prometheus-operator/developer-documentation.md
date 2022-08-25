# Prometheus Operator

## Introduction
It provides an easy way to define monitoring definitions for kubernetes deployments, services and managment of Prometheus instances.  

### Chart
Its public helm [chart's](https://github.com/helm/charts/tree/master/stable/prometheus-operator) version `5.0.13` is being used to deploy monitoring definitions on cluster. [StakaterKubeHelmMonitoring](https://github.com/stakater/StakaterKubeHelmMonitoring) repository is being used for deployment.

### Image Issue
None. Image specifications are given below:
```yaml
image: "quay.io/coreos/prometheus-operator"
tag: "v0.29.0"
```

### Cherry Pickable
Yes

### Single Sign On
Not applicable

## Installation
It will be installed by using its public helm chart.

### Dependencies
It requires helm operator to be running in the cluster.

### Char Information
Chart information is given below:
```yaml
repository: https://kubernetes-charts.storage.googleapis.com
name: prometheus-operator
version: 5.0.13
```

### Hard-coded-values
Hard coded values for prometheus Operator is given below:
```yaml
prometheusOperator:
  serviceAccount:
    name: stakater-monitoring
  kubeletService:
    enabled: true
```