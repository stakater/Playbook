# Developer Documentation for Kubernetes Dashboard

## Introduction

[Kubernetes Dashboard](https://github.com/kubernetes/dashboard) is a general purpose, web-based UI for Kubernetes clusters. It allows users to manage applications running in the cluster and troubleshoot them, as well as manage the cluster itself

## Installation

### Chart

We use public helm charts to deploy kubernetes-dashboard on our cluster. [Here](https://github.com/helm/charts/tree/master/stable/kubernetes-dashboard) is the public chart that we use and `0.10.2` is the public chart version that is used in our cluster. We use umbrella charts to deploy kubernetes-dashboard on our cluster. Currently we are using [this](https://github.com/stakater/StakaterKubeHelmGlobal) repository for kubernetes-dashboard deployment.

### Image

Currently we are using this `k8s.gcr.io/kubernetes-dashboard-amd64:v1.10.1` public image for dashboard in stakater.

### Cherry Pickable

Yes

### Single Sign-on

Yes