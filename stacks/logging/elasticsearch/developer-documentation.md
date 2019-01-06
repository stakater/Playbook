# Introduction

Elasticsearch is a distributed RESTful search engine built for the cloud. We at stakater use elasticsearch for mainly storing our cluster logs. We are also using it for carbook team’s search database. 

# Installation

We use public chart of upmc-enterprises to deploy elasticsearch in our cluster
```
https://github.com/upmc-enterprises/elasticsearch-operator/tree/master/charts/elasticsearch
```

We use version `0.1.5` in our cluster.. We use umbrella charts to deploy cerebro on our cluster. Currently we are using this repository for elasticsearch deployment
```
https://github.com/stakater/stakaterkubelogging
```

 but we are depreciating it and replacing it with this repository.
```
https://github.com/stakater/stakaterkubehelmLogging
```

# Image Issues

Right now we are using stakater elasticsearch image, as we are facing problems with discovery plugin using public elasticsearch image.

# Dependencies

Elasticsearch is a standalone tool, and does not depend on anything to run.  

# Steps

* Most of the times elasticsearch will be deployed from pipeline of `https://github.com/stakater/stakaterkubehelmLogging` repository. It will have updated configurations and dependencies for elasticsearch. But we can also install it manually (not recommended). To install elasticsearch manually, clone `https://github.com/stakater/stakaterkubehelmLogging` repo and you can run the make targets of repo containing latest used implementation of elasticsearch. This will install all dependencies and elasticsearch as well.

    * Clone `https://github.com/stakater/stakaterkubehelmLogging` repository
    * Update the hardcoded values mentioned in the `hard-coded-values.md`
    * Run this command. `make install CHART_NAME=logging`