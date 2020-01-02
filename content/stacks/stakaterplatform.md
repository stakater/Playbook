# StakaterPlatform

## Overview 
Kick-start your kubernetes cluster with Stakater Platform. A consolidated solution for logging, tracing, monitoring, delivery, security and much more.

StakaterPlatform consist of 6 stacks:
- [Control](https://playbook.stakater.com/content/stacks/control.html)
- [Delivery](https://playbook.stakater.com/content/stacks/delivery.html)
- [Logging](https://playbook.stakater.com/content/stacks/logging.html)
- [Monitoring](https://playbook.stakater.com/content/stacks/monitoring.html)
- [Security](https://playbook.stakater.com/content/stacks/security.html)
- [Tracing](https://playbook.stakater.com/content/stacks/tracing.html)

## Why StakaterPlatform ?

StakaterPlatform gives you a head start for managing your kubernetes cluster by providing open source tools across six stacks so that you only concern about developing and releasing applications on Kubernetes.

## Workflow

StakaterPlatform works on GitOps principle using an opensource tool [Flux](https://github.com/fluxcd/flux) which makes sure that cluster is always in the desired state by tracking a git repository. To make changes in your cluster, commit your changes in the git repository and the changes will be reflected in the kubernetes cluster.
