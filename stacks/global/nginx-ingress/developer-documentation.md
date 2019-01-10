# Developer Documentation for nginx-ingress

## Introduction

nginx-ingress is an Ingress controller that uses ConfigMap to store the nginx configuration.

## Installation

### Chart

We use public helm charts to deploy nginx-ingress on our cluster. [Here](https://github.com/helm/charts/tree/master/stable/nginx-ingress) is the repository for public chart. We use version `0.31.0` in our cluster. We use umbrella charts to deploy nginx-ingress on our cluster. Currently we are using [this](https://github.com/stakater/stakaterkubehelmGlobal) repository for nginx-ingress deployment

### Image

Currently we are using this `quay.io/kubernetes-ingress-controller/nginx-ingress-controller:0.20.0` public image for nginx-ingress in stakater.

### Cherry Pickable

Yes

### Single Sign-on

Not applicable