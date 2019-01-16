# Elasticsearch

## Introduction

Elasticsearch is a distributed RESTful search engine built for the cloud. We at stakater use elasticsearch for mainly storing our cluster logs. We are also using it for carbook team’s search database. 

### Chart

We use public chart of upmc-enterprises to deploy elasticsearch in our cluster. [Here](https://github.com/upmc-enterprises/elasticsearch-operator/tree/master/charts/elasticsearch) is the chart repo.
We use version `0.1.5` in our cluster. We use umbrella charts to deploy elasticsearch on our cluster. Currently we are using [this](https://github.com/stakater/stakaterkubelogging) repository for elasticsearch deployment

### Image Issues

Currently we are using stakater elasticsearch image `stakater/elasticsearch-kubernetes:6.2.4`, we are not using an official public image because we are facing problems with discovery plugin using public elasticsearch image.

### Cherry Pickable

No - Managed by the operator

### Single Sign-on

Not applicable

## Installation

### Installation Steps

Most of the times elasticsearch will be deployed from pipeline of [this](https://github.com/stakater/stakaterkubehelmLogging) repository. It will have updated configurations and dependencies for elasticsearch. But we can also install it manually (not recommended). To install elasticsearch manually, clone [this](https://github.com/stakater/stakaterkubehelmLogging) repo and you can run the make targets of repo containing latest used implementation of elasticsearch. This will install all dependencies and elasticsearch as well.

1. Clone `https://github.com/stakater/stakaterkubehelmLogging` repository
2. Update the hardcoded values mentioned [here](#Hard-coded-values)
3. Run this command. `make install CHART_NAME=logging`

### Dependencies

Elasticsearch is a standalone tool, and does not depend on anything to run.  

### Char Info

```yaml
name: elasticsearch
version: 0.1.5
Repository: https://raw.githubusercontent.com/upmc-enterprises/elasticsearch-operator/master/charts
alias: elasticsearch
```

### Hard-coded-values

This document contains the hard coded values for elasticsearch, and its dependencies.

```yaml
 clientReplicas: 1
 masterReplicas: 1
 dataReplicas: 3
 dataVolumeSize: 20Gi
 javaOpts: "-Xms1024m -Xmx1024m"
 zones:
 - eu-west-1a
 - eu-west-1b
 - eu-west-1c
 resources:
   requests:
     memory: 1024Mi
     cpu: 500m
   limits:
     memory: 1536Mi
     cpu: '1'
```