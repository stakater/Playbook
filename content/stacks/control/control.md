# Control Stack

## Dashboard

### Introduction

This component installs kubernetes dashboard for the Cluster.

## Ingress Moniter Controller

### Introduction

[Ingress Moniter Controller](https://github.com/stakater/IngressMonitorController) is a kubernetes controller to watch ingresses/routes and create liveness alerts for your apps/microservices in Uptime checkers.

### Chart

We use public stakater chart to deploy IMC in our cluster. [Here](https://github.com/stakater/stakater-charts/tree/master/docs) is the repository for stakater public charts.

### Cherry Pickable

Yes

### Single Sign-on

Not applicable.

### Dependencies

IMC is not dependant on any other tool.

## Forecastle

### Introduction

[Forecastle](https://github.com/stakater/forecastle) is a control panel which dynamically discovers and provides a launchpad to access applications deployed on Kubernetes

### Chart

We use public stakater chart to deploy forecastle in our cluster. [Here](https://github.com/stakater/stakater-charts/tree/master/docs) is the repository for stakater public charts.

### Cherry Pickable

Yes.

### Single Sign-on

Yes. We use proxyinjector for achieving single sign on. Please refer to its documentation [here](https://playbook.stakater.com/content/tools/global/proxyinjector/developer-documentation.html).

### Dependencies

Forecastle is not dependant on any other tool

## Gitwebhookproxy

### Introduction

[Gitwebhookproxy](https://github.com/stakater/GitWebhookProxy) is a proxy to let webhooks to reach a Jenkins instance running behind a firewall. Jenkins is awesome and matchless tool for both CI & CD; but unfortunately its a gold mine if left in wild with wide open access; so, we always want to put it behind a firewall. But when we put it behind firewall then webhooks don't work anymore, so we at stakater use gitwebhookproxy to bypass the firewall and trigger pipelines in jenkins.

### Chart

We use stakater helm charts to deploy gitwebhookproxy on our cluster. [Here](https://github.com/stakater/GitWebhookProxy/tree/master/deployments/kubernetes/chart/gitwebhookproxy) is the stakater chart that we use. 

### Cherry Pickable

Yes

### Single Sign-on

Not applicable.