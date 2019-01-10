# Installation and Dependencies of Cerebro

## Installation Steps

Most of the times cerebro will be deployed from pipeline of [this](https://github.com/stakater/stakaterkubehelmLogging) repository. It will have updated configurations and dependencies for cerebro. But we can also install it manually (not recommended). To install cerebro manually, clone [this](https://github.com/stakater/stakaterkubehelmLogging) repo and you can run the make targets of repo containing latest used implementation of cerebro. This will install all dependencies and cerebro as well.
1. Clone `https://github.com/stakater/stakaterkubehelmLogging` repository
2. Update the hard coded values mentioned [here](#Hard-coded-values) in `cerebro.yaml`
3. Run this command. `make install CHART_NAME=logging`
4. Verify from UI that cerebro pod is running and accessible.

## Dependencies

As Cerebro is an elasticsearch web admin tool, so it needs an elasticsearch instance to be running. The tool can be deployed separately.

## Post Installation Configuration

No manual configuration is needed.

## Web UI Access

You can access the Cerebro UI using this url: https://cerebro.logging.stakater.com

## Char Info
```yaml
name: cerebro
version: 0.5.2
repository: https://kubernetes-charts.storage.googleapis.com
alias: cerebro
```

## Hard-coded-values

This document contains the hard coded values for Cerebro, and its dependencies. 

```yaml
config:
   secret: "ki:s:[[@=Ag?QIW2jMwkY:eqvrJ]JqoJyi2axj3ZvOv^/KavOT4ViJSv?6YY4[N"
   hosts:
     - host: "http://elasticsearch-stakater-logging-cluster.logging:9200"
       name: "elasticsearch-stakater-logging-cluster"

 deployment:
   annotations:
     authproxy.stakater.com/image-name: quay.io/gambol99/keycloak-proxy
     authproxy.stakater.com/image-tag: v2.1.1
     authproxy.stakater.com/enabled: "true"
     authproxy.stakater.com/upstream-url: "http://127.0.0.1:9000"
     authproxy.stakater.com/source-service-name: stakater-logging-cerebro
     authproxy.stakater.com/redirection-url: "https://cerebro.logging.stakater.com"
     authproxy.stakater.com/listen: "0.0.0.0:80"

 service:
   annotations:
     config.xposer.stakater.com/Domain: stakater.com
     config.xposer.stakater.com/IngressNameTemplate: '{{.Service}}-{{.Namespace}}'
     config.xposer.stakater.com/IngressURLTemplate: 'cerebro.{{.Namespace}}.{{.Domain}}'
     xposer.stakater.com/annotations: |-
       kubernetes.io/ingress.class: internal-ingress
       ingress.kubernetes.io/force-ssl-redirect: true
       forecastle.stakater.com/expose: true
       forecastle.stakater.com/icon: https://raw.githubusercontent.com/stakater/ForecastleIcons/master/cerebro.png
       forecastle.stakater.com/appName: Cerebro
```