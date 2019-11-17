# Forecastle

## Introduction

[Forecastle](https://github.com/stakater/forecastle) is a control panel which dynamically discovers and provides a launchpad to access applications deployed on Kubernetes

### Chart

We use public stakater chart to deploy forecastle in our cluster. [Here](https://github.com/stakater/stakater-charts/tree/master/docs) is the repository for stakater public charts. We use version `1.0.20` in our cluster. We use umbrella charts to deploy forecastle in our cluster. Currently we are using [this](https://github.com/stakater/stakaterkubehelmGlobal) repository for forecastle deployment.

### Image

Currently we are using this `stakater/forecastle:v1.0.22` public image for forecastle

### Cherry Pickable

Yes

### Single Sign-on

Yes. We use proxyinjector for achieving single sign on. Please refer to its documentation [here](https://playbook.stakater.com/content/tools/global/proxyinjector/developer-documentation.html).

## Installation

### Installation Steps

Most of the times forecastle will be deployed from pipeline of [this](https://github.com/stakater/stakaterkubehelmGlobal) repository. It will have updated configurations and dependencies for forecastle. But we can also install it manually (not recommended). To install forecastle manually, clone [this](https://github.com/stakater/stakaterkubehelmGlobal) repo and you can run the make targets of repo containing latest used implementation of forecastle. This will install all dependencies and forecastle as well.

1. Clone `https://github.com/stakater/stakaterkubehelmGlobal` repository
2. Update the hardcoded values mentioned [here](#Hard-coded-values) in `global/values/forecastle`
3. Run this command. `make install CHART_NAME=global`

### Dependencies

forecastle is not dependant on any other tool

### Chart Info

```yaml
name: forecastle
version: 1.0.20
repository: https://stakater.github.io/stakater-charts 
alias: forecastle

```
### Hard-coded-values

This document contains the hard coded values for forecastle, and its dependencies.

```yaml
forecastle:
  deployment:
    annotations:
        authproxy.stakater.com/image-name: quay.io/gambol99/keycloak-proxy
        authproxy.stakater.com/image-tag: v2.1.1
        authproxy.stakater.com/enabled: "true"
        authproxy.stakater.com/upstream-url: "http://127.0.0.1:3000"
        authproxy.stakater.com/source-service-name: forecastle
        authproxy.stakater.com/redirection-url: "https://forecastle.global.stakater.com"
        authproxy.stakater.com/listen: "0.0.0.0:80"
  service:
    annotations:
        config.xposer.stakater.com/IngressURLPath: "/"
        config.xposer.stakater.com/Domain: "stakater.com"
        config.xposer.stakater.com/IngressNameTemplate: "{{.Service}}-{{.Namespace}}"
        config.xposer.stakater.com/IngressURLTemplate: "{{.Service}}.{{.Namespace}}.{{.Domain}}"
        xposer.stakater.com/annotations: |-
          kubernetes.io/ingress.class: external-ingress
          ingress.kubernetes.io/rewrite-target: /
          ingress.kubernetes.io/force-ssl-redirect: true
```