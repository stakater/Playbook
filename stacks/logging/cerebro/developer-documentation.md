# Developer Documentation for Cerebro

## Introduction

Cerebro is an open source (MIT License) elasticsearch web admin tool built using Scala, Play Framework, AngularJS and Bootstrap.

## Installation

### Chart

We use public helm charts to deploy cerebro on our cluster. [Here](https://github.com/helm/charts/tree/master/stable/cerebro) is the public chart that we use.
We use version `0.5.2` from public helm chart. We use umbrella charts to deploy cerebro on our cluster. Currently we are using [this](https://github.com/stakater/stakaterkubelogging) repository for cerebro deployment

### Image

Currently we are using this `lmenezes/cerebro:0.8.1` public image for cerebro in stakater.

### Cherry Pickable

Yes

### Single Sign-on

Yes
