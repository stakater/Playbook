# Fluentd

## Introduction

Fluentd is an open source data collector for unified logging layer. it allows you to unify data collection and consumption for a better use and understanding of data. We at stakater use fluentd to collect cluster logs which it then redirects to elasticsearch.

### Chart

We use public helm charts to deploy fluentd on our cluster. [Here](https://github.com/helm/charts/tree/master/stable/fluentd-elasticsearch) is the public chart that we use.
We use version `2.0.3` from public helm chart. We use umbrella charts to deploy fluentd on our cluster. Currently we are using [this](https://github.com/stakater/stakaterkubelogging) repository for fluentd deployment

### Image

Currently we are using this `stakater/fluentd-elasticsearch:v1.0.0` stakater public image for fluentd in stakater. We do not use currently available public image because public image does not have plugins support that we use in stakater.

### Cherry Pickable

Yes

### Single Sign-on

Not applicable

## Installation

### Installation Steps

Most of the times fluentd will be deployed from pipeline of [this](https://github.com/stakater/stakaterkubehelmLogging) repository. It will have updated configurations and dependencies for fluentd. But we can also install it manually (not recommended). To install fluentd manually, clone [this](https://github.com/stakater/stakaterkubehelmLogging) repo and you can run the make targets of repo containing latest used implementation of fluentd. This will install all dependencies and fluentd as well.

1. Clone `https://github.com/stakater/stakaterkubehelmLogging` repository
2. Update the hard coded values mentioned [here](#Hard-coded-values) in `fluentd-elasticsearch.yaml`
3. Run this command. `make install CHART_NAME=logging`
4. Verify from UI that fluentd pod is running and accessible.

### Dependencies

Fluentd needs elastic search to store logs

### Char Info

```yaml
- name: fluentd-elasticsearch
  version: 2.0.3
  repository: https://kubernetes-charts.storage.googleapis.com
  alias: fluentd-elasticsearch
```

### Hard-coded-values

This document contains the hard coded values for Fluentd, and its dependencies.

```yaml
fluentd-elasticsearch:
  image:
    repository: stakater/fluentd-elasticsearch
    tag: v1.0.0
    pullPolicy: Always

  elasticsearch:
    host: 'elasticsearch-stakater-logging-cluster.logging'
    port: 9200
    buffer_chunk_limit: 2M
    buffer_queue_limit: 8
    logstash_prefix: 'logstash'

  rbac:
    create: true
  serviceAccount:
    create: true
  livenessProbe:
    enabled: true
  annotations:
    configmap.reloader.stakater.com/reload: "konfigurator-stakater-logging-fluentd-elasticsearch-rendered"
    configmap.reloader.stakater.com/reload: "stakater-fluentd-elasticsearch"
  podAnnotations:
    prometheus.io/scrape: "true"
    prometheus.io/port: "24231"
```