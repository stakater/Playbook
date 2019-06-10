# Jaeger

## Introduction
Jaeger is an open source end-to-end distributed tracing system. 

### Chart
Istio public helm [chart](https://github.com/istio/istio/tree/master/install/kubernetes/helm/istio) version `1.1.0` is being used to deploy jaeger on cluster. [StakaterKubeHelmTracing](https://github.com/stakater/StakaterKubeHelmTracing) repository is being used for deployment.

### Image Issue
None. Image specifications are given below:

```yaml
name: tracing
version: 1.1.0
condition: tracing.enabled
```

### Cherry Pickable
Yes.

### Single Sign On
Applicable but not supported.

## Installation
It will be deployed by the pipeline of [StakaterKubeHelmTracing](https://github.com/stakater/StakaterKubeHelmTracing) repository. 

### Dependencies
It requires helm operator to be running in the cluster.

### Chart Information
Chart information is given below:

```yaml
repository: https://gcsweb.istio.io/gcs/istio-prerelease/daily-build/release-1.1-latest-daily/charts/
name: istio
version: 1.1.0
```

### Hard-coded-values
Hard coded values for jaeger is given below:

```yaml
global:
  enableTracing: true
tracing:
  enabled: true
pilot:
  traceSampling: 100
```