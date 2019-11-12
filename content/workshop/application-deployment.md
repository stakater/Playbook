# Nordmart Application deployment in Openshfit Container Platform

## Introduction

This document contains the guideline to deploy Nordmart applicaton in the Openshift cluster.

## Nordmart Application Deployment Guideline

Follow the steps to deploy the cluster:

1. Run the `install` target of the [`nordmart-dev-tools`](https://github.com/stakater-lab/nordmart-dev-tools) pipeline for the `azure-ocp-workshop-stakater` branch. It will install flux in the `nordmart-dev-apps` project.

2. Copy the flux public ssh key from the the flux pod logs and add it to the [nordmart-dev-apps](https://github.com/stakater-lab/nordmart-dev-apps) repository's deploy keys.

3. Once keys are added, flux will now monitor the `nordmart-dev-apps` repository.

4. Make sure that the images specified in the `nordmart-dev-apps/releases` (branch must be `azure-ocp-workshop-stakater`) manifests exists in the nexus repository.

   **NOTE**: If image doesn't exist it will generate an error that it is not able to pull the specified image although image still exists. There is a catch that new image tag will not be deployed until a succesful deployment is done.

5. Sometime Jenkins create image for the branch name but not for the PR and in dev env the flux looks for the image with PR regex `^([0-9]+.[0-9]+.[0-9]+-PR-[0-9]{2}-[0-9]+-SNAPSHOT)$`. To resolve this issue just rerun the PR pipeline.

## End to End tests for the application

Applications end to end test require AWS credentials to push the test videos to S3 bucket. Create the credentials with `aws-credentials` id.