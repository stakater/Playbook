# Developer Documentation for Konfigurator

## Introduction

Konfigurator is an open source kubernetes operator developed by [Stakater](https://github.com/stakater) that can dynamically generate app configuration when kubernetes resources change. We at stakater use konfigurator to create dynamic configuration for fluentd configmap.

## Installation

### Chart

We use Stakater public charts to deploy konfigurator on our cluster. [Here](https://github.com/stakater/Konfigurator/tree/master/deployments/kubernetes/chart/konfigurator) is the chart that we use. We use version `0.0.17` from stakater helm chart. We use umbrella charts to deploy konfigurator on our cluster. Currently we are using [this](https://github.com/stakater/stakaterkubelogging) repository for konfigurator deployment

### Image

Currently we are using this `stakater/konfigurator:0.0.17` public image for konfigurator in stakater.

### Cherry Pickable

Yes

### Single Sign-on

Not applicable