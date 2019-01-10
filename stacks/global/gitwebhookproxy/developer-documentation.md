# Developer Documentation for Gitwebhookproxy

## Introduction

[Gitwebhookproxy](https://github.com/stakater/GitWebhookProxy) is a proxy to let webhooks to reach a Jenkins instance running behind a firewall. Jenkins is awesome and matchless tool for both CI & CD; but unfortunately its a gold mine if left in wild with wide open access; so, we always want to put it behind a firewall. But when we put it behind firewall then webhooks don't work anymore, so we at stakater use gitwebhookproxy to bypass the firewall and trigger pipelines in jenkins.

## Installation

### Chart

We use stakater helm charts to deploy gitwebhookproxy on our cluster. [Here](https://github.com/stakater/GitWebhookProxy/tree/master/deployments/kubernetes/chart/gitwebhookproxy) is the stakater chart that we use and `0.2.61` is the chart version that is used in our cluster. We use umbrella charts to deploy gitwebhookproxy on our cluster. Currently we are using [this](https://github.com/stakater/stakaterkubehelmglobal) repository for gitwebhookproxy.

### Image

Currently we are using this `stakater/gitwebhookproxy:0.2.61` public stakatet image for gitwebhookproxy in stakater.

### Cherry Pickable

Yes

### Single Sign-on

Not applicable.