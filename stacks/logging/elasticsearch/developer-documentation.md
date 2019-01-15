# Developer Documentation for Elasticsearch

## Introduction

Elasticsearch is a distributed RESTful search engine built for the cloud. We at stakater use elasticsearch for mainly storing our cluster logs. We are also using it for carbook team’s search database. 

## Installation

### Chart

We use public chart of upmc-enterprises to deploy elasticsearch in our cluster. [Here](https://github.com/upmc-enterprises/elasticsearch-operator/tree/master/charts/elasticsearch) is the chart repo.
We use version `0.1.5` in our cluster. We use umbrella charts to deploy elasticsearch on our cluster. Currently we are using [this](https://github.com/stakater/stakaterkubelogging) repository for elasticsearch deployment

### Image Issues

Right now we are using stakater elasticsearch image, as we are facing problems with discovery plugin using public elasticsearch image.
Current Image: `stakater/elasticsearch-kubernetes:6.2.4`

### Cherry Pickable

No - Managed by the operator

### Single Sign-on

Not applicable