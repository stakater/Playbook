# Chartmuseum

## Introduction

We at Stakater use chartmuseum as our private repository to store our private charts e.g. emailservice, gatewayapi etc. ChartMuseum is an open-source Helm Chart Repository server written in Go (Golang), with support for cloud storage backends.

### Chart

We use public helm charts to deploy chartmuseum on our cluster. [Here](https://github.com/helm/charts/tree/master/stable/chartmuseum) is the public chart that we use and `1.8.0` is the public chart version that is used in our cluster. We use umbrella charts to deploy chartmuseum on our cluster. Currently we are using [this](https://github.com/stakater/stakaterkubehelmrelease) repository for chartmuseum.

### Image

Currently we are using this `chartmuseum/chartmuseum:v0.8.0` public image for chartmuseum in stakater.

### Cherry Pickable

Yes

### Single Sign-on

No, currently chartmuseum does not support SSO with keycloak.

## Installation

### Installation Steps

1. Chartmuseum can be deployed using pipeline of [this](https://github.com/stakater/stakaterkubehelmrelease) repository. We can also deploy this manually (not recommended) via console. To deploy it manually
    1. Download the chart
    ```bash
    helm repo add stable https://kubernetes-charts.storage.googleapis.com
    helm repo update
    helm fetch stable/chartmuseum --version 1.8.0
    ```
    2. Unzip the chart and go the the unzipped chart directory.
    3. Update the values.yaml file. See the hard coded values [here](#Hard-coded-values)
    4. Run below command
    ```bash
    helm install --name <release name> . --namespace <namespace name>
    ```

### Post Installation Configuration

No manual configuration is needed.

### Web UI Access

You can access the chartmuseum UI using this url: https://chartmuseum.release.stakater.com/
To view charts in chartmuseum go to https://chartmuseum.release.stakater.com/api/charts 

### Dependencies

Chartmuseum does not depend on other charts

### Hard-coded-values

Below are hard coded values for chartmuseum.
**NOTE** All credentials used here are not real. Please get the latest credentials before using these hard coded values.

Servicename, type, externalPort, annotations and labels are hardcoded.

```yaml
chartmuseum:
  service:
    servicename: chartmuseum
    type: ClusterIP
    externalPort: 80
    annotations:
      config.xposer.stakater.com/Domain: stakater.com
      config.xposer.stakater.com/IngressNameTemplate: '{{.Service}}-{{.Namespace}}'
      config.xposer.stakater.com/IngressURLTemplate: '{{.Service}}.{{.Namespace}}.{{.Domain}}'
      config.xposer.stakater.com/TLS: "true"
      xposer.stakater.com/annotations: |-
        kubernetes.io/ingress.class: internal-ingress
        ingress.kubernetes.io/force-ssl-redirect: true
        ingress.kubernetes.io/proxy-body-size: 900m
        forecastle.stakater.com/expose: true
        forecastle.stakater.com/icon: https://cdn-images-1.medium.com/max/521/0*D__TQ7qMdoq3Y7kP.png
        forecastle.stakater.com/appName: Chartmuseum
    labels:
      expose: "true"
```

Annotations, labels and matchlables are harcoded

```yaml
chartmuseum:
  deployment:
    annotations:
      fluentd_configuration: >
        [
          [
            {
              "expression": "/(?<time>[^\t]+)\t(?<level>[^\t]+)\t(?<log>[^ ].*$)/",
              "time_format": "%iso8601",
              "container_name": "chartmuseum"
            }
          ]
        ]
    labels:
      group: com.stakater.platform
      provider: stakater
      version: "v0.8.0"
    matchlabes:
      app: chartmuseum
      group: com.stakater.platform
      provider: stakater
```

Resource limits and resource requests are hard coded.

```yaml
chartmuseum:
  resources:
    limits:
      cpu: 100m
      memory: 128Mi
    requests:
      cpu: 80m
      memory: 64Mi
```

Labels, accessmode, size and storage class are hard coded.

```yaml
chartmuseum:
  persistence:
    enabled: true
    labels:
      group: com.stakater.platform
      provider: stakater
      version: "0.7.2"
    accessMode: ReadWriteOnce
    size: 10Gi
    storageClass: "efs"
```

These are hardcoded environment variables. Secrets can be placed at secrets.yaml as encrypted format.

```yaml
chartmuseum:
  env:
    open:
      PROJECT_NAMESPACE: ${PROJECT_NAMESPACE}
      KUBERNETES_MASTER: https://kubernetes.default:443
      ALLOW_OVERWRITE: true
      AUTH_ANONYMOUS_GET: true
      DISABLE_API: false
    field:	
      KUBERNETES_NAMESPACE: metadata.namespace
    secret:
      BASIC_AUTH_USER: "stakater"
      BASIC_AUTH_PASS: "Get password from teamlead"
```