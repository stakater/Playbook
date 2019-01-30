# ElasticSearch Operator

## Introduction

The ElasticSearch operator is designed to manage one or more elasticsearch clusters. We at stakater use elasticsearch-operator to create our elasticsearch cluster

### Chart

We use public chart of upmc-enterprises to deploy elasticsearch-operator in our cluster. [Here](https://github.com/upmc-enterprises/elasticsearch-operator/tree/master/charts/elasticsearch-operator) is the public chart repo. We use version `0.1.3` in our cluster.. We use umbrella charts to deploy elasticsearch-operator on our cluster. Currently we are using [this](https://github.com/stakater/stakaterkubelogging) repository for elasticsearch deployment

### Image

Currently we are using this `upmcenterprises/elasticsearch-operator:0.0.12` public image for elasticsearch-operator in stakater.

### Cherry Pickable

Yes

### Single Sign-on

Not applicable

## Installation

### Installation Steps

Most of the times elasticsearch-operator will be deployed from pipeline of [this](https://github.com/stakater/stakaterkubehelmLogging) repository. It will have updated configurations and dependencies for elasticsearch-operator. But we can also install it manually (not recommended). To install elasticsearch-operator manually, clone [this](https://github.com/stakater/stakaterkubehelmLogging) repo and you can run the make targets of repo containing latest used implementation of elasticsearch-operator. This will install all dependencies and elasticsearch-operator as well.

1. Clone `https://github.com/stakater/stakaterkubehelmLogging` repository
2. Update the hard coded values mentioned [here](#Hard-coded-values)
3. Run this command. `make install CHART_NAME=logging`

### Dependencies

Elasticsearch operator doesn’t require any dependency to run

### Char Info

```yaml
name: elasticsearch-operator
version: 0.1.3
repository: https://raw.githubusercontent.com/upmc-enterprises/elasticsearch-operator/master/charts
alias: elasticsearch-operator
```

### Hard-coded-values

This document contains the hard coded values for elasticsearch operator, and its dependencies.

```yaml
resources:
   limits:
     cpu: 100m
     memory: 128Mi
   requests:
     cpu: 100m
     memory: 128Mi
```