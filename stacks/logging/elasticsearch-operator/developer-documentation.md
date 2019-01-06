# Introduction

The ElasticSearch operator is designed to manage one or more elasticsearch clusters. We at stakater use elasticsearch-operator to create our elasticsearch cluster

# Installation

We use public chart of upmc-enterprises to deploy elasticsearch-operator in our cluster. 
```
https://github.com/upmc-enterprises/elasticsearch-operator/tree/master/charts/elasticsearch-operator
```

We use version `0.1.3` in our cluster.. We use umbrella charts to deploy cerebro on our cluster. Currently we are using this repository for elasticsearch deployment
```
https://github.com/stakater/stakaterkubelogging
```

 but we are depreciating it and replacing it with this repository.
```
https://github.com/stakater/stakaterkubehelmLogging
```

# Dependencies

Elasticsearch operator doesn’t require any dependency to run

# Steps

* Most of the times elasticsearch-operator will be deployed from pipeline of `https://github.com/stakater/stakaterkubehelmLogging` repository. It will have updated configurations and dependencies for elasticsearch-operator. But we can also install it manually (not recommended). To install elasticsearch-operator manually, clone `https://github.com/stakater/stakaterkubehelmLogging` repo and you can run the make targets of repo containing latest used implementation of elasticsearch-operator. This will install all dependencies and elasticsearch-operator as well.

    * Clone `https://github.com/stakater/stakaterkubehelmLogging` repository
    * Update the hardcoded values mentioned in the `hard-coded-values.md`
    * Run this command. `make install CHART_NAME=logging`