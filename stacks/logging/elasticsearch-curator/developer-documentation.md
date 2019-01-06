# Introduction

Elasticsearch Curator helps you curate, or manage your elasticsearch indices. In Stakater we use curator to remove our older logs; let’s say 2 months old elasticsearch indices. 

# Installation

We use public helm chart of elasticsearch-curator to deploy elasticsearch in our cluster. 
```
https://github.com/helm/charts/tree/master/stable/elasticsearch-curator
```

We use version `1.0.1` in our cluster.. We use umbrella charts to deploy cerebro on our cluster. Currently we are using this repository for elasticsearch deployment
```
https://github.com/stakater/stakaterkubelogging
```

 but we are depreciating it and replacing it with this repository.
```
https://github.com/stakater/stakaterkubehelmLogging
```

# Dependencies

Elasticsearch-curator requires an elasticsearch instance to manage its indices

# Steps

* Most of the times elasticsearch-curator will be deployed from pipeline of `https://github.com/stakater/stakaterkubehelmLogging` repository. It will have updated configurations and dependencies for elasticsearch-curator. But we can also install it manually (not recommended). To install elasticsearch-curator manually, clone `https://github.com/stakater/stakaterkubehelmLogging` repo and you can run the make targets of repo containing latest used implementation of elasticsearch-curator. This will install all dependencies and elasticsearch-curator as well.

    * Clone `https://github.com/stakater/stakaterkubehelmLogging` repository
    * Update the hardcoded values mentioned in the `hard-coded-values.md`
    * Run this command. `make install CHART_NAME=logging`