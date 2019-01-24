# Konfigurator

## Introduction

Konfigurator is an open source kubernetes operator developed by [Stakater](https://github.com/stakater) that can dynamically generate app configuration when kubernetes resources change. We at stakater use konfigurator to create dynamic configuration for fluentd configmap.

### Chart

We use Stakater public charts to deploy konfigurator on our cluster. [Here](https://github.com/stakater/Konfigurator/tree/master/deployments/kubernetes/chart/konfigurator) is the chart that we use. We use version `0.0.17` from stakater helm chart. We use umbrella charts to deploy konfigurator on our cluster. Currently we are using [this](https://github.com/stakater/stakaterkubelogging) repository for konfigurator deployment

### Image

Currently we are using this `stakater/konfigurator:0.0.17` public image for konfigurator in stakater.

### Cherry Pickable

Yes

### Single Sign-on

Not applicable

## Installation

### Installation Steps

Most of the times konfigurator will be deployed from pipeline of [this](https://github.com/stakater/stakaterkubehelmLogging) repository. It will have updated configurations and dependencies for konfigurator. But we can also install it manually (not recommended). To install konfigurator manually, clone [this](https://github.com/stakater/stakaterkubehelmLogging) repo and you can run the make targets of repo containing latest used implementation of konfigurator. This will install all dependencies and konfigurator as well.

1. Clone `https://github.com/stakater/stakaterkubehelmLogging` repository
2. Update the hard coded values mentioned [here](#Hard-coded-values) in `konfigurator.yaml`
3. Run this command. `make install CHART_NAME=logging`
4. Verify from UI that konfigurator pod is running and accessible.

### Dependencies

To work properly, a crd (Custom Resource Definition) for konfigurator is required.

### Post Installation Configuration

No manual configuration is needed.

### Char Info

```yaml
name: konfigurator
version: 0.0.17
repository: https://stakater.github.io/stakater-charts/
alias: konfigurator
```

### Hard-coded-values

This document contains the hard coded values for konfigurator, and its dependencies.

deployCRD is `false` by default because we deploy CRD via pre-install script mentioned [here](https://github.com/stakater/StakaterKubeHelmGlobal/blob/master/pre-install/pre-install.sh)

```yaml
konfigurator:
  konfigurator:
    deployCRD: false
    image:
      name: stakater/konfigurator
      tag: "0.0.17"
      pullPolicy: IfNotPresent
```