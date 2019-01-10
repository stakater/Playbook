# Developer Documentation for Elasticsearch Curator

## Introduction

Elasticsearch Curator helps you curate, or manage your elasticsearch indices. In Stakater we use curator to remove our older logs; let’s say 2 months old elasticsearch indices.

## Installation

### Chart

We use public helm chart of elasticsearch-curator to deploy elasticsearch in our cluster. [Here](https://github.com/helm/charts/tree/master/stable/elasticsearch-curator) is the public chart repo.
We use version `1.0.1` in our cluster. We use umbrella charts to deploy elasticsearch curator on our cluster. Currently we are using [this](https://github.com/stakater/stakaterkubelogging) repository for elasticsearch curator deployment

### Image

Currently we are using this `quay.io/pires/docker-elasticsearch-curator:5.5.4` public image for elasticsearch-curator in stakater.

### Cherry Pickable

Yes

### Single Sign-on

Not applicable