# Reloader

## Introduction

[Reloader](https://github.com/stakater/Reloader) is a kubernetes controller that watches `ConfigMap` and/or `Secrets`, then perform a rolling upgrade on relevant `DeploymentConfig`, `Deployment`, `Daemonset` and `Statefulset`.

### Chart

We use public stakater chart to deploy reloader in our cluster. [Here](https://github.com/stakater/stakater-charts/tree/master/docs) is the repository for stakater public charts. We use version `v0.0.49` in our cluster. Currently we are using [this](https://github.com/stakater/StakaterInfrastructure) repository for Reloader deployment.

### Image

Currently, we are using `stakater/reloader:v0.0.49` public image for Reloader.

### Cherry Pickable

Yes

### Single Sign-on

Not applicable.

## Installation

### Installation Steps

Most of the times Reloader will be deployed from pipeline of [this](https://github.com/stakater/StakaterInfrastructurel) repository. It can also be installed manually (not recommended). To install Reloader manually, clone [this](https://github.com/stakater/stakaterkubehelmGlobal) repo and follow the guideline provided in the README.md.

### Dependencies

Reloader is not dependant on any other tool.

