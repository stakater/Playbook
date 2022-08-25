# Pilot

## Introduction
Pilot provides service discovery for the Envoy sidecars, traffic management capabilities for intelligent routing (e.g., A/B tests, canary rollouts, etc.), and resiliency (timeouts, retries, circuit breakers, etc).

### Chart
Istio public helm [chart](https://github.com/istio/istio/tree/master/install/kubernetes/helm/istio) version `1.1.0` is being used to deploy pilot on cluster. [StakaterKubeHelmTracing](https://github.com/stakater/StakaterKubeHelmTracing) repository is being used for deployment.

### Image Issue
None.

### Cherry Pickable
Yes.

### Single Sign On
Not applicable.

## Installation
It will be deployed by the pipeline of [StakaterKubeHelmTracing](https://github.com/stakater/StakaterKubeHelmTracing) repository.

### Dependencies
It requires helm operator to be running in the cluster.

### Chart Information
It will be deployed by the chart given below:

```yaml
repository: https://gcsweb.istio.io/gcs/istio-prerelease/daily-build/release-1.1-latest-daily/charts/
name: istio
version: 1.1.0
```

### Hard-coded-values
Hard coded values for istio is given below:

```yaml
pilot:
  traceSampling: 100
```

`traceSampling` values can be vary from `1 - 100`. `1` means that it will capture 1 trace out of hundred while `100` means that it will capture 100 out of 100 traces.

