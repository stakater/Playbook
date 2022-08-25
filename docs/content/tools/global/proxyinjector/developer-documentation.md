# ProxyInjector

## Introduction

[ProxyInjector](https://github.com/stakater/proxyinjector) is a Kubernetes controller to inject an authentication proxy container to relevant pods

### Chart

We use public stakater chart to deploy proxyinjector in our cluster. [Here](https://github.com/stakater/stakater-charts/tree/master/docs) is the repository for stakater public charts. We use version `0.0.11` in our cluster. We use umbrella charts to deploy proxyinjector in our cluster. Currently we are using [this](https://github.com/stakater/stakaterkubehelmGlobal) repository for proxyinjector deployment

### Image

Currently we are using this `stakater/proxyinjector:0.0.11` public image for proxyinjector

### Cherry Pickable

Yes

### Single Sign-on

Not applicable

## Installation

### Installation Steps

Most of the times proxyinjector will be deployed from pipeline of [this](https://github.com/stakater/stakaterkubehelmGlobal) repository. It will have updated configurations and dependencies for proxyinjector. But we can also install it manually (not recommended). To install proxyinjector manually, clone [this](https://github.com/stakater/stakaterkubehelmGlobal) repo and you can run the make targets of repo containing latest used implementation of proxyinjector. This will install all dependencies and proxyinjector as well.

1. Clone `https://github.com/stakater/stakaterkubehelmGlobal` repository
2. Update the hardcoded values mentioned [here](#Hard-coded-values) in `global/values/proxyinjector`
3. Run this command. `make install CHART_NAME=global`

### Dependencies

proxyinjector is dependant on [keycloak](https://playbook.stakater.com/content/tools/global/keycloak/developer-documentation.html). Please check its documentation as well. 

### How to use 

For using proxyinjector, you need to apply the following annotations on your deployment. Sample annotations can be these:

```yaml
    authproxy.stakater.com/image-name: quay.io/gambol99/keycloak-proxy
    authproxy.stakater.com/image-tag: v2.1.1
    authproxy.stakater.com/enabled: "true"
    authproxy.stakater.com/upstream-url: "http://127.0.0.1:3000"
    authproxy.stakater.com/source-service-name: forecastle
    authproxy.stakater.com/redirection-url: "https://forecastle.global.stakater.com"
    authproxy.stakater.com/listen: "0.0.0.0:80"
```

### Chart Info

```yaml
name: proxyinjector
version: 0.0.11
repository: https://stakater.github.io/stakater-charts 
alias: proxyinjector
```

### Hard-coded-values

This document contains the hard coded values for proxyinjector, and its dependencies.

```yaml
proxyinjector:
  tolerations: 
  - key: "dedicated"
      operator: "Equal"
      value: "app"
      effect: "NoSchedule"
  proxyconfig: |-
     client-id: stakater-online-platform
     client-secret: 1ce66f91-2068-4f3d-9578-f03fa8259230
     discovery-url: https://keycloak.global.stakater.com/auth/realms/stakater
     enable-default-deny: true
     secure-cookie: false
     verbose: true
     enable-logging: true
     cors-origins:
      - '*'
     cors-methods:
     - GET
     - POST
     resources:
     - uri: '/'
```
