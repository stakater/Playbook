# Ingress Moniter Controller

## Introduction

[Ingress Moniter Controller](https://github.com/stakater/IngressMonitorController) is a kubernetes controller to watch ingresses/routes and create liveness alerts for your apps/microservices in Uptime checkers.

### Chart

We use public stakater chart to deploy IMC in our cluster. [Here](https://github.com/stakater/stakater-charts/tree/master/docs) is the repository for stakater public charts. We use version `1.0.89` in our cluster. We use umbrella charts to deploy IMC in our cluster. Currently we are using [this](https://github.com/stakater/StakaterInfrastructure) repository for IMC deployment.

### Image

Currently, we are using `stakater/ingressmonitorcontroller:v1.0.89` public image for IMC.

### Cherry Pickable

Yes

### Single Sign-on

Not applicable.

## Installation

### Installation Steps

Most of the times IMC will be deployed from pipeline of [this](https://github.com/stakater/StakaterInfrastructurel) repository. It can also be installed manually (not recommended). To install IMC manually, clone [this](https://github.com/stakater/IngressMonitorController) repo and follow the guideline provided in the README.md.

### Dependencies

IMC is not dependant on any other tool.