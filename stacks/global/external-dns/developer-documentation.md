# Introduction

ExternalDNS synchronizes exposed Kubernetes Services and Ingresses with DNS providers. ExternalDNS makes Kubernetes resources discoverable via public DNS servers. Like KubeDNS, it retrieves a list of resources (Services, Ingresses, etc.) from the Kubernetes API to determine a desired list of DNS records. Unlike KubeDNS, however, it's not a DNS server itself, but merely configures other DNS providers accordingly

# Installation

We use public helm charts to deploy ExternalDNS on our cluster.
```
https://github.com/helm/charts/tree/master/stable/external-dns
```

We use version `1.0.2` in our cluster. We use umbrella charts to deploy cerebro on our cluster. Currently we are using this repository for elasticsearch deployment
```
https://github.com/stakater/stakaterkubehelmGlobal
```

 but we are depreciating it and replacing it with this repository.
```
https://github.com/stakater/stakaterkubehelmGlobal
```

# Dependencies

ExternalDNS is not dependant on any other tool

# Steps

* Most of the times ExternalDNS will be deployed from pipeline of `https://github.com/stakater/stakaterkubehelmGlobal` repository. It will have updated configurations and dependencies for ExternalDNS. But we can also install it manually (not recommended). To install ExternalDNS manually, clone `https://github.com/stakater/stakaterkubehelmGlobal` repo and you can run the make targets of repo containing latest used implementation of ExternalDNS. This will install all dependencies and ExternalDNS as well.

    * Clone `https://github.com/stakater/stakaterkubehelmGlobal` repository
    * Update the hardcoded values mentioned in the `hard-coded-values.md`
    * Run this command. `make install CHART_NAME=global`