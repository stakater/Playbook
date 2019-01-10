# Installation and Dependencies of Elasticsearch Operator

## Installation Steps

Most of the times elasticsearch-operator will be deployed from pipeline of [this](https://github.com/stakater/stakaterkubehelmLogging) repository. It will have updated configurations and dependencies for elasticsearch-operator. But we can also install it manually (not recommended). To install elasticsearch-operator manually, clone [this](https://github.com/stakater/stakaterkubehelmLogging) repo and you can run the make targets of repo containing latest used implementation of elasticsearch-operator. This will install all dependencies and elasticsearch-operator as well.

1. Clone `https://github.com/stakater/stakaterkubehelmLogging` repository
2. Update the hard coded values mentioned [here](#Hard-coded-values)
3. Run this command. `make install CHART_NAME=logging`

## Dependencies

Elasticsearch operator doesn’t require any dependency to run

## Char Info

```yaml
name: elasticsearch-operator
version: 0.1.3
repository: https://raw.githubusercontent.com/upmc-enterprises/elasticsearch-operator/master/charts
alias: elasticsearch-operator
```

## Hard-coded-values

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