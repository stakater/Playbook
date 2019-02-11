# Nginx-ingress

## Introduction

nginx-ingress is an Ingress controller that uses ConfigMap to store the nginx configuration.

### Chart

We use public helm charts to deploy nginx-ingress on our cluster. [Here](https://github.com/helm/charts/tree/master/stable/nginx-ingress) is the repository for public chart. We use version `0.31.0` in our cluster. We use umbrella charts to deploy nginx-ingress on our cluster. Currently we are using [this](https://github.com/stakater/stakaterkubehelmGlobal) repository for nginx-ingress deployment

### Image

Currently we are using this `quay.io/kubernetes-ingress-controller/nginx-ingress-controller:0.20.0` public image for nginx-ingress in stakater.

### Cherry Pickable

Yes

### Single Sign-on

Not applicable

## Installation (external-ingress)

### Installation Steps (external-ingress)

Most of the times nginx-ingress will be deployed from pipeline of [this](https://github.com/stakater/stakaterkubehelmGlobal) repository. It will have updated configurations and dependencies for nginx-ingress. But we can also install it manually (not recommended). To install nginx-ingress manually, clone [this](https://github.com/stakater/stakaterkubehelmGlobal) repo and you can run the make targets of repo containing latest used implementation of nginx-ingress. This will install all dependencies and nginx-ingress as well.

1. Clone `https://github.com/stakater/stakaterkubehelmGlobal` repository
2. Update the hardcoded values mentioned [here](#Hard-coded-values) in `global/values/external-ingress`
3. Run this command. `make install CHART_NAME=global`

### Dependencies (external-ingress)

nginx-ingress is not dependant on any other tool

### Chart Info (external-ingress)

```yaml
name: nginx-ingress
version: 0.31.0
repository: https://kubernetes-charts.storage.googleapis.com
alias: external-ingress
```

### Hard-coded-values (external-ingress)

This document contains the hard coded values for nginx-ingress (external), and its dependencies.

```yaml
controller:
   publishService:
     enabled: true
     pathOverride: "global/stakater-global-external-ingress-controller"
   ingressClass: external-ingress

 service:
   labels:
     dns: "route53"
   annotations:
     external-dns.alpha.kubernetes.io/hostname: stakater.com
     domainName: "stakater.com"
     service.beta.kubernetes.io/aws-load-balancer-proxy-protocol: '*'
     service.beta.kubernetes.io/aws-load-balancer-ssl-ports: "https"
     service.beta.kubernetes.io/aws-load-balancer-backend-protocol: "http"
     service.beta.kubernetes.io/aws-load-balancer-ssl-cert: test-arn
```

## Installation (internal-ingress)

### Installation Steps (internal-ingress)

Most of the times nginx-ingress will be deployed from pipeline of [this](https://github.com/stakater/stakaterkubehelmGlobal) repository. It will have updated configurations and dependencies for nginx-ingress. But we can also install it manually (not recommended). To install nginx-ingress manually, clone [this](https://github.com/stakater/stakaterkubehelmGlobal) repo and you can run the make targets of repo containing latest used implementation of nginx-ingress. This will install all dependencies and nginx-ingress as well.

1. Clone `https://github.com/stakater/stakaterkubehelmGlobal` repository
2. Update the hard coded values mentioned [here](#Hard-coded-values) in `global/values/internal-ingress`
3. Run this command. `make install CHART_NAME=global`

### Dependencies (internal-ingress)

nginx-ingress is not dependant on any other tool

### Char Info (internal-ingress)

```yaml
name: nginx-ingress
version: 0.31.0
repository: https://kubernetes-charts.storage.googleapis.com
alias: internal-ingress
```

### Hard-coded-values (internal-ingress)

```yaml
 defaultBackend:
   enabled: false

controller:
   defaultBackendService: global/stakater-global-external-ingress-default-backend
   publishService:
     enabled: true
     pathOverride: "global/stakater-global-internal-ingress-controller"
   ingressClass: internal-ingress

service:
  labels:
    dns: "route53"
  annotations:
    external-dns.alpha.kubernetes.io/hostname: stakater.com
    domainName: "stakater.com"
    service.beta.kubernetes.io/aws-load-balancer-proxy-protocol: '*'
    service.beta.kubernetes.io/aws-load-balancer-ssl-ports: "https"
    service.beta.kubernetes.io/aws-load-balancer-backend-protocol: "http"
    service.beta.kubernetes.io/aws-load-balancer-ssl-cert: test-arn

```