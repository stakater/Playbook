# Kube State Metrics

## Introduction
It is a service that generates metrics about kubernetes objects by using Kubebernetes API server.

### Chart
Prometheus-operator public helm [chart's](https://github.com/helm/charts/tree/master/stable/prometheus-operator) version `5.0.13` is being used to deploy kube state metrics on our cluster. [StakaterKubeHelmMonitoring](https://github.com/stakater/StakaterKubeHelmMonitoring) repository is being used for deployment.

### Image Issue
None. Image specifications are given below:
```yaml
repository: k8s.gcr.io/kube-state-metrics
  tag: v1.5.0
```

### Cherry Pickable
No, becuase it is being deployed with `Prometheus-Operator` helm charts. Although it can be deployed using its own helm chart.

### Single Sign On
Not applicable.

## Installation
It will be deployed by the pipeline of [StakaterKubeHelmMonitoring](https://github.com/stakater/StakaterKubeHelmMonitoring) repository.

### Dependencies
It requires helm operator running in cluster.

### Chart Information
Chart information is given below:

```yaml
name: kube-state-metrics
version: 0.16.*
repository: https://kubernetes-charts.storage.googleapis.com/
condition: kubeStateMetrics.enabled
```

### Hard-coded-values
No hard coded values needs to be configured.