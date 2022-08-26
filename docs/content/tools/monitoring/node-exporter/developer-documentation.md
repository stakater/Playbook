# Node Exporter

## Introduction
Prometheus exporter for hardware and OS metrics exposed by *NIX kernels, with pluggable metric collectors.

### Chart
Prometheus-operator public helm [chart's](https://github.com/helm/charts/tree/master/stable/prometheus-operator) version `5.0.13` is being used to deploy node exporter on our cluster. [StakaterKubeHelmMonitoring](https://github.com/stakater/StakaterKubeHelmMonitoring) repository is being used for deployment.

### Image Issue

None. Image specifications are given below:
```yaml
image: "quay.io/prometheus/node-exporter"
tag: "v0.17.0"
```

### Cherry Pickable
No, becuase it is being deployed with `Prometheus-Operator` helm charts. Although it can be deployed using its own helm chart.

### Single Sign On
Not applicable.

## Installation
It will be deployed by the pipeline of [StakaterKubeHelmMonitoring](https://github.com/stakater/StakaterKubeHelmMonitoring) repository.

### Dependencies
It requires helm operator to be running in cluster.

### Chart Information
Chart information is given below:

```yaml
name: prometheus-node-exporter
version: 1.4.*
repository: https://kubernetes-charts.storage.googleapis.com/
condition: nodeExporter.enabled
```

### Hard-coded-values
No hard coded values needs to be configured.