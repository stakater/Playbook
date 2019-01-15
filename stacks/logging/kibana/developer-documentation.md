# Developer Documentation for Kibana

## Introduction

kibana is your window into the Elastic Stack. Specifically, it's an open source (Apache Licensed), browser-based analytics and search dashboard for Elasticsearch.

## Installation

### Chart

We use [public helm chart](https://github.com/helm/charts/tree/master/stable/kibana) of kibana to deploy kibana in our cluster. We use version `1.1.1` in our cluster. We use umbrella charts to deploy kibana on our cluster. Currently we are using [this](https://github.com/stakater/stakaterkubelogging) repository for elasticsearch deployment

### Image

Currently we are using this `docker.elastic.co/kibana/kibana-oss:6.5.3` public image for kibana in stakater.

### Cherry Pickable

Yes

### Single Sign-on

Yes