# Developer Documentation for Chartmuseum

## Introduction

We at Stakater use chartmuseum as our private repository to store our private charts e.g. emailservice, gatewayapi etc. ChartMuseum is an open-source Helm Chart Repository server written in Go (Golang), with support for cloud storage backends.

## Installation

### Chart

We use public helm charts to deploy chartmuseum on our cluster. [Here](https://github.com/helm/charts/tree/master/stable/chartmuseum) is the public chart that we use and `1.8.0` is the public chart version that is used in our cluster. We use umbrella charts to deploy chartmuseum on our cluster. Currently we are using [this](https://github.com/stakater/stakaterkubehelmrelease) repository for chartmuseum.

### Image

Currently we are using this `chartmuseum/chartmuseum:v0.8.0` public image for chartmuseum in stakater.

### Cherry Pickable

Yes

### Single Sign-on

No, currently chartmuseum does not support SSO with keycloak.