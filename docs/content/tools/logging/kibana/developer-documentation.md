# Kibana

## Introduction

kibana is your window into the Elastic Stack. Specifically, it's an open source (Apache Licensed), browser-based analytics and search dashboard for Elasticsearch.

### Chart

We use [public helm chart](https://github.com/helm/charts/tree/master/stable/kibana) of kibana to deploy kibana in our cluster. We use version `1.1.1` in our cluster. We use umbrella charts to deploy kibana on our cluster. Currently we are using [this](https://github.com/stakater/stakaterkubelogging) repository for elasticsearch deployment

### Image

Currently we are using this `docker.elastic.co/kibana/kibana-oss:6.5.3` public image for kibana in stakater.

### Cherry Pickable

Yes

### Single Sign-on

Yes. We use proxyinjector for achieving single sign on. Please refer to its documentation [here](https://playbook.stakater.com/content/tools/global/proxyinjector/developer-documentation.html)

## Installation

### Installation Steps

Most of the times kibana will be deployed from pipeline of [this](https://github.com/stakater/stakaterkubehelmLogging) repository. It will have updated configurations and dependencies for kibana. But we can also install it manually (not recommended). To install kibana manually, clone [this](https://github.com/stakater/stakaterkubehelmLogging) repo and you can run the make targets of repository containing latest used implementation of kibana. This will install all dependencies and kibana as well.

1. Clone `https://github.com/stakater/stakaterkubehelmLogging` repository
2. Update the hard coded values mentioned [here](#Hard-coded-values)
3. Run this command. `make install CHART_NAME=logging`

### Dependencies

Kibana requires an elasticsearch instance to be running

### Char Info

```yaml
name: kibana
version: 1.1.1
repository: https://kubernetes-charts.storage.googleapis.com
alias: kibana
```

### Hard-coded-values

This document contains the hard coded values for Kibana, and its dependencies. 

```yaml
files:
   kibana.yml:
     server.name: kibana
     server.host: "0"
     server.port: 5601
     elasticsearch.url: http://elasticsearch-stakater-logging-cluster.logging:9200

 deployment:
   annotations:
     authproxy.stakater.com/image-name: quay.io/gambol99/keycloak-proxy
     authproxy.stakater.com/image-tag: v2.1.1
     authproxy.stakater.com/enabled: "true"
     authproxy.stakater.com/upstream-url: "http://127.0.0.1:5601"
     authproxy.stakater.com/source-service-name: stakater-logging-kibana
     authproxy.stakater.com/redirection-url: "https://kibana.logging.stakater.com"
     authproxy.stakater.com/listen: "0.0.0.0:80"

 service:
   externalPort: 80
   annotations:
     config.xposer.stakater.com/Domain: stakater.com
     config.xposer.stakater.com/IngressNameTemplate: '{{.Service}}-{{.Namespace}}'
     config.xposer.stakater.com/IngressURLTemplate: 'kibana.{{.Namespace}}.{{.Domain}}'
     xposer.stakater.com/annotations: |-
       kubernetes.io/ingress.class: internal-ingress
       ingress.kubernetes.io/rewrite-target: /
       ingress.kubernetes.io/force-ssl-redirect: true
       forecastle.stakater.com/expose: true
```