# Developer Documentation for RDLM

## Introduction

restful-distributed-lock-manager is a tool to manage resource locking for shared resources. We use this tool in conjunction with jenkins to manage resource locking.

## Installation

### Chart

We use stakater public helm charts to deploy rdlm on our cluster. [Here](https://github.com/stakater-charts/restful-distributed-lock-manager) is the public chart that we use and `1.0.2` is the public chart version that is used in our cluster. We use umbrella charts to deploy rdlm on our cluster. Currently we are using [this](https://github.com/stakater/stakaterkubehelmrelease) repository for rdlm deployment. We have also created a [PR](https://github.com/helm/charts/pull/10249) in helm/charts, as soon as it is accepted we will start using rdlm from helm public charts instead of stakater public charts.

### Image

Currently we are using this `stakater/restful-distributed-lock-manager:0.5.3` public image for rdlm in stakater.

### Cherry Pickable

Yes

### Single Sign-on

Not applicable.