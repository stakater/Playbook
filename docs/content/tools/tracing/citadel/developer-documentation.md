# Citadel

## Introduction
It is part of Istio's Control Plane. 

Citadel enables strong service-to-service and end-user authentication with built-in identity and credential management. You can use Citadel to upgrade unencrypted traffic in the service mesh. Using Citadel, operators can enforce policies based on service identity rather than on relatively unstable layer 3 or layer 4 network identifiers.

### Chart
Istio public helm [chart](https://github.com/istio/istio/tree/master/install/kubernetes/helm/istio) version `1.1.0` is being used to deploy citadel on cluster. [StakaterKubeHelmTracing](https://github.com/stakater/StakaterKubeHelmTracing) repository is being used for deployment.

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
