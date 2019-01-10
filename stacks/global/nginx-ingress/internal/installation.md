# Installation and Dependencies of nginx-ingress (internal)

## Installation Steps

Most of the times nginx-ingress will be deployed from pipeline of [this](https://github.com/stakater/stakaterkubehelmGlobal) repository. It will have updated configurations and dependencies for nginx-ingress. But we can also install it manually (not recommended). To install nginx-ingress manually, clone [this](https://github.com/stakater/stakaterkubehelmGlobal) repo and you can run the make targets of repo containing latest used implementation of nginx-ingress. This will install all dependencies and nginx-ingress as well.

1. Clone `https://github.com/stakater/stakaterkubehelmGlobal` repository
2. Update the hard coded values mentioned [here](#Hard-coded-values) in `global/values/internal-ingress`
3. Run this command. `make install CHART_NAME=global`

## Dependencies

nginx-ingress is not dependant on any other tool

## Char Info

```yaml
name: nginx-ingress
version: 0.31.0
repository: https://kubernetes-charts.storage.googleapis.com
alias: internal-ingress
```

## Hard-coded-values

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