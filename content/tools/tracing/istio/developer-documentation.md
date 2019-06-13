# Istio

## Introduction
Istio is an open platform for providing a uniform way to integrate microservices, manage traffic flow across microservices, enforce policies and aggregate telemetry data.

Istio components can be divided in two parts;

* Data Plane
The data plane intercepts all inbound (ingress) and outbound (egress) network traffic. Applications business logic, microservice is blissfully unaware of this fact. Istio's control plane components comprises two concepts:

* Envoy (sidecar container).

### Chart
Istio public helm [chart](https://github.com/istio/istio/tree/master/install/kubernetes/helm/istio) version `1.1.0` is being used to deploy istio on cluster. [StakaterKubeHelmTracing](https://github.com/stakater/StakaterKubeHelmTracing) repository is being used for deployment.

* Control Plane
The control plane is responsible for being the authoritative source for configuration and policy and making the data plane usable in a cluster. Istio’s control plane comprises three primary Istio services:

* Pilot
* Mixer
* Citadel (Authorization).

### Image Issue
None.

### Cherry Pickable
No.

### Single Sign On
Not applicable.

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
Hard coded values for istio is given below:

```yaml
global:
  enableTracing: true
tracing:
  enabled: true
pilot:
  traceSampling: 100
prometheus:
  enabled: false
```