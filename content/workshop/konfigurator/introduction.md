# Konfigurator

![Diagram](./img/Konfigurator.png)

[[toc]]

## Introduction

Konfigurator is an open source kubernetes operator developed by [Stakater](https://github.com/stakater) that can dynamically generate app configuration when kubernetes resources change. We at stakater use konfigurator to create dynamic configuration for fluentd configmap.

## Need

Sometimes there is a need to generate application configurations dynamically. e.g. using environment variables to decide on certain values and use them in pods as configmaps or secrets. This cannot be done using default kubernetes resources configmaps/secrets.

## Solution

Konfigurator is a kubernetes operator that allows you to dynamically generate app configuration (configmap/secrets)when kubernetes resources change and then mounts these configmaps/secrets to given kubernetes resources.

## Features

- Use Custom Resource Definition CRD to enable Custom Resources CR to be created.
- Render Configurations to
  - ConfigMap
  - Secret
- Support for GO Templating Engine
- Custom helper functions
- Support to watch the following Kubernetes Resources
  - Pods
  - Services
  - Ingresses

## Deploying to Kubernetes

Deploying Konfigurator requires:

1. Deploying CRD to your cluster
2. Deploying Konfigurator operator

You can deploy the CRD and operator on your kubernetes cluster via any of the following methods
- Vanilla Manifests
- Helm Chart (recommended)

### Vanilla Manifests

You can apply vanilla manifests by running the following command

```bash
kubectl apply -f https://raw.githubusercontent.com/stakater/Konfigurator/master/deployments/kubernetes/konfigurator.yaml
```

Konfigurator by default looks for **KonfiguratorTemplate** only in the namespace where it is deployed, but it can be managed to work globally, you would have to change the `WATCH_NAMESPACE` environment variable to "" in the above manifest. e.g. change `WATCH_NAMESPACE` section to:

```yaml
            - name: WATCH_NAMESPACE
              value: ""
```

### Helm Charts

Alternatively if you have configured helm on your cluster, you can add konfigurator to helm from our public chart repository and deploy it via helm using below mentioned commands

```bash
helm repo add stakater https://stakater.github.io/stakater-charts

helm repo update

helm install stakater/konfigurator
```

Once Konfigurator is running, you can start creating resources supported by it. For details about its custom resources, look [here](https://github.com/stakater/Konfigurator/tree/master/docs/konfigurator-template.md).

To make Konfigurator work globally, you would have to change the `WATCH_NAMESPACE` environment variable to "" in values.yaml. e.g. change `WATCH_NAMESPACE` section to:

```yaml
  env:
  - name: WATCH_NAMESPACE
    value: ""
```
