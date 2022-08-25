# ExternalDNS

## Introduction

ExternalDNS synchronizes exposed Kubernetes Services and Ingresses with DNS providers. ExternalDNS makes Kubernetes resources discoverable via public DNS servers. Like KubeDNS, it retrieves a list of resources (Services, Ingresses, etc.) from the Kubernetes API to determine a desired list of DNS records. Unlike KubeDNS, however, it's not a DNS server itself, but merely configures other DNS providers accordingly

### Chart

We use public helm charts to deploy ExternalDNS on our cluster. [Here](https://github.com/helm/charts/tree/master/stable/external-dns) is the official chart repo. We use version `1.0.2` in our cluster. We use umbrella charts to deploy ExternalDNS on our cluster. Currently we are using [this](https://github.com/stakater/stakaterkubehelmGlobal) repository for ExternalDNS deployment.

### Image

Currently we are using this `registry.opensource.zalan.do/teapot/external-dns:v0.5.8` public image for ExternalDNS in stakater.

### Cherry Pickable

Yes

### Single Sign-on

Not applicable.

## Installation

### Installation Steps

Most of the times ExternalDNS will be deployed from pipeline of [this](https://github.com/stakater/stakaterkubehelmGlobal) repository. It will have updated configurations and dependencies for ExternalDNS. But we can also install it manually (not recommended). To install ExternalDNS manually, clone [this](https://github.com/stakater/stakaterkubehelmGlobal) repo and you can run the make targets of repo containing latest used implementation of ExternalDNS. This will install all dependencies and ExternalDNS as well.

1. Clone [this](https://github.com/stakater/stakaterkubehelmGlobal) repository
2. Update the hard coded values mentioned [here](#Hard-coded-values)
3. Run this command. `make install CHART_NAME=global`

### Post Installation Configuration

No manual configuration is needed.

### Dependencies

ExternalDNS does not depend on other charts

### Hard-coded-values

This document contains the hard coded values for external dns, and its dependencies. 

```yaml
external-dns:
  domainFilters:
    - stackator.com
    - stakater.com
    - gocarbook.com
  txtOwnerId: stakater
  rbac:
    create: true
    apiVersion: v1beta1
```