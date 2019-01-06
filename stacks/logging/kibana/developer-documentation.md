# Introduction

kibana is your window into the Elastic Stack. Specifically, it's an open source (Apache Licensed), browser-based analytics and search dashboard for Elasticsearch.

# Installation

We use public helm  chart of kibana to deploy kibana in our cluster
```
https://github.com/helm/charts/tree/master/stable/kibana
```

We use version `1.1.1` in our cluster.. We use umbrella charts to deploy cerebro on our cluster. Currently we are using this repository for elasticsearch deployment
```
https://github.com/stakater/stakaterkubelogging
```

 but we are depreciating it and replacing it with this repository.
```
https://github.com/stakater/stakaterkubehelmLogging
```

# Dependencies

Kibana requires an elasticsearch instance to be running

# Steps

* Most of the times kibana will be deployed from pipeline of `https://github.com/stakater/stakaterkubehelmLogging` repository. It will have updated configurations and dependencies for kibana. But we can also install it manually (not recommended). To install kibana manually, clone `https://github.com/stakater/stakaterkubehelmLogging` repo and you can run the make targets of repo containing latest used implementation of kibana. This will install all dependencies and kibana as well.

    * Clone `https://github.com/stakater/stakaterkubehelmLogging` repository
    * Update the hardcoded values mentioned in the `hard-coded-values.md`
    * Run this command. `make install CHART_NAME=logging`