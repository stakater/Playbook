# Introduction

Cerebro is an open source (MIT License) elasticsearch web admin tool built using Scala, Play Framework, AngularJS and Bootstrap.

# Installation:

We use public helm charts to deploy cerebro on our cluster. Here is the public chart that we use.
```
https://github.com/helm/charts/tree/master/stable/cerebro
```

Right now we have a pending PR so we are using version `0.5.1` from stakater-charts. We use umbrella charts to deploy cerebro on our cluster. Currently we are using this repository for cerebro deployment
```
https://github.com/stakater/stakaterkubelogging
```

 but we are depreciating it and replacing it with this repository.
```
https://github.com/stakater/stakaterkubehelmLogging
```

# Dependencies:

As Cerebro is an elasticsearch web admin tool, so it needs an elasticsearch instance to be running. The tool can be deployed separately. 

# Steps:

* Most of the times cerebro will be deployed from pipeline of `https://github.com/stakater/stakaterkubehelmLogging` repository. It will have updated configurations and dependencies for cerebro. But we can also install it manually (not recommended). To install cerebro manually, clone `https://github.com/stakater/stakaterkubehelmLogging` repo and you can run the make targets of repo containing latest used implementation of cerebro. This will install all dependencies and cerebro as well.
    * Clone `https://github.com/stakater/stakaterkubehelmLogging` repository
    * Update the hardcoded values mentioned in the `hard-coded-values.md`
    * Run this command. `make install CHART_NAME=logging`

* Verify from UI that cerebro pod is running and accessible.
