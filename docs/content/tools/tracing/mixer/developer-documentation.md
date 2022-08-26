# Mixer

## Introduction
It is part of Istio's Control Plane. Mixer enforces access control and usage policies across the service mesh, and collects telemetry data from the Envoy proxy and other services. The proxy extracts request level attributes, and sends them to Mixer for evaluation.

### Chart
Istio public helm [chart](https://github.com/istio/istio/tree/master/install/kubernetes/helm/istio) version `1.1.0` is being used to deploy mixer on cluster. [StakaterKubeHelmTracing](https://github.com/stakater/StakaterKubeHelmTracing) repository is being used for deployment.

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
None