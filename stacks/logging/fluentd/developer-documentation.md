# Developer Documentation for Fluentd

## Introduction

Fluentd is an open source data collector for unified logging layer. it allows you to unify data collection and consumption for a better use and understanding of data. We at stakater use fluentd to collect cluster logs which it then redirects to elasticsearch.

## Installation

### Chart

We use public helm charts to deploy fluentd on our cluster. [Here](https://github.com/helm/charts/tree/master/stable/fluentd-elasticsearch) is the public chart that we use.
We use version `2.0.3` from public helm chart. We use umbrella charts to deploy fluentd on our cluster. Currently we are using [this](https://github.com/stakater/stakaterkubelogging) repository for fluentd deployment

### Image

Currently we are using this `stakater/fluentd-elasticsearch:v1.0.0` stakater public image for fluentd in stakater.

### Cherry Pickable

Yes

### Single Sign-on

Not applicable