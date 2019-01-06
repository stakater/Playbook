# Hard coded values

This document contains the hard coded values for nginx-ingress (internal), and its dependencies. 

# Char Info
```
name: nginx-ingress
version: 0.31.0
repository: https://kubernetes-charts.storage.googleapis.com
alias: external-ingress
```

# Hard coded values
```
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
    service.beta.kubernetes.io/aws-load-balancer-ssl-cert: arn:aws:acm:us-west-2:449074299682:certificate/83858943-90a9-4129-a60c-3f85403e047e

```