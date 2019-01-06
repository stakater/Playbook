# Introduction

nginx-ingress is an Ingress controller that uses ConfigMap to store the nginx configuration.

# Installation

We use public helm charts to deploy nginx-ingress on our cluster.
```
https://github.com/helm/charts/tree/master/stable/nginx-ingress
```

We use version `0.31.0` in our cluster. We use umbrella charts to deploy cerebro on our cluster. Currently we are using this repository for elasticsearch deployment
```
https://github.com/stakater/stakaterkubehelmGlobal
```

 but we are depreciating it and replacing it with this repository.
```
https://github.com/stakater/stakaterkubehelmGlobal
```

# Dependencies

nginx-ingress is not dependant on any other tool

# Steps

* Most of the times nginx-ingress will be deployed from pipeline of `https://github.com/stakater/stakaterkubehelmGlobal` repository. It will have updated configurations and dependencies for nginx-ingress. But we can also install it manually (not recommended). To install nginx-ingress manually, clone `https://github.com/stakater/stakaterkubehelmGlobal` repo and you can run the make targets of repo containing latest used implementation of nginx-ingress. This will install all dependencies and nginx-ingress as well.

    * Clone `https://github.com/stakater/stakaterkubehelmGlobal` repository
    * Update the hardcoded values mentioned in the `hard-coded-values.md`
    * Run this command. `make install CHART_NAME=global`