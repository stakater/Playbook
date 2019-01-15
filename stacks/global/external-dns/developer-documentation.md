# Developer Documentation for ExternalDNS

## Introduction

ExternalDNS synchronizes exposed Kubernetes Services and Ingresses with DNS providers. ExternalDNS makes Kubernetes resources discoverable via public DNS servers. Like KubeDNS, it retrieves a list of resources (Services, Ingresses, etc.) from the Kubernetes API to determine a desired list of DNS records. Unlike KubeDNS, however, it's not a DNS server itself, but merely configures other DNS providers accordingly

## Installation

### Chart

We use public helm charts to deploy ExternalDNS on our cluster. [Here](https://github.com/helm/charts/tree/master/stable/external-dns) is the official chart repo. We use version `1.0.2` in our cluster. We use umbrella charts to deploy ExternalDNS on our cluster. Currently we are using [this](https://github.com/stakater/stakaterkubehelmGlobal) repository for ExternalDNS deployment.

### Image

Currently we are using this `registry.opensource.zalan.do/teapot/external-dns:v0.5.8` public image for ExternalDNS in stakater.

### Cherry Pickable

Yes

### Single Sign-on

Not applicable.