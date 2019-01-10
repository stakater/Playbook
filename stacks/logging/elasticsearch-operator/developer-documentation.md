# Developer Documentation for ElasticSearch Operator

## Introduction

The ElasticSearch operator is designed to manage one or more elasticsearch clusters. We at stakater use elasticsearch-operator to create our elasticsearch cluster

## Installation

### Chart

We use public chart of upmc-enterprises to deploy elasticsearch-operator in our cluster. [Here](https://github.com/upmc-enterprises/elasticsearch-operator/tree/master/charts/elasticsearch-operator) is the public chart repo. We use version `0.1.3` in our cluster.. We use umbrella charts to deploy elasticsearch-operator on our cluster. Currently we are using [this](https://github.com/stakater/stakaterkubelogging) repository for elasticsearch deployment

### Image

Currently we are using this `upmcenterprises/elasticsearch-operator:0.0.12` public image for elasticsearch-operator in stakater.

### Cherry Pickable

Yes

### Single Sign-on

Not applicable