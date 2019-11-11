# Stakater Platform deployment on Openshift Container Platform

## Introduction

This document contains the guideline to deploy Stakater [Platform](https://github.com/stakater/StakaterPlatform) on `Openshift Container Platform Cluster` on Azure.

## Stakater Platform Deployment

Follow the steps to deploy the Stakater platform:

1. Clone the Stakater Platform [repository](https://github.com/stakater/StakaterPlatform) and checkout to `azure-ocp-workshop-stakater` branch.

2. Run the `pre-install.sh` script. It will install and configure depedencies required for stacks deployment.

3. The `pre-install.sh` script will install flux, which will deploy all the stacks in the cluster but it requires access to the repository. Access the flux pod logs in the `flux` namespace. It generates a `ssh` key which is available in the pod logs that must be added to the repositories's deploy keys.

4. To check whether flux was able access the repository check the last used time of the deploy key of the project.

5. Flux will deploy the all the dependencies but the Helm Operator logs must be monitored to see whether the stacks were deployed successfully because helm operator enqueues the releases before it processes it, which takes ~5-10 minutes.

6. Run the `post-install.sh` script. It will create routes for the stacks services. Sometimes it give the error that specify port, this issue is caused by the un-deployed services. For the error generating route check whether its respective service exists.

7. To enable the Jenkins pipelines following credentials must be created:

    1. Stakater user
    2. Github token api.

10. The routes for the services are available in this [link](/content/workshop/openshift).