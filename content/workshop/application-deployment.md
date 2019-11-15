# Nordmart Application deployment in Openshfit Container Platform

## Introduction

This document contains the guideline to deploy Nordmart applicaton in the Openshift cluster.

## Nordmart Application Deployment Guideline

Follow the steps to deploy the cluster:

1. Create a Github Organization for the nordmart application.

2. Create following credentials:

    1. Stakater user.
    2. Github token api.
    3. Credentails for AWS user, with limited access to only S3 resource. Its value must be aws-credentials.

3. Create a Github organization with following details:

    1. Use the stakater-user credentials created above.
    2. Set owner to stakater-lab or the name of your organization.
    2. Add the regex filter for repositories. The regex is given below:
       ```
           .*nordmart.*
       ```
    3. Add the regex given below in the `Automatic branch project triggering` sections:
       ```
           PR-\d+|master
       ```
4. Scan the organization. It will pull all the nordmart specific repositories.

5. Run the `nordmart-dev-tools` repository pipeline. It will create `nordmart-dev-apps` project and install flux in it. Flux will deploy all the nordmart microservice in the project using the [nordmart-dev-apps](https://github.com/stakater-lab/nordmart-dev-apps) repository. But flux requires access to the repository, to enable the access copy the flux public key from it pod and add it in the nordmart-dev-apps repository's access key.

3. Once keys are added, flux will monitor the `nordmart-dev-apps` repository.

4. Make sure that the images specified in the `nordmart-dev-apps/releases` (branch must be `azure-ocp-workshop-stakater`) manifests exists in the [nexus repository](nexus-dellivery.workshop.stakater.com).

   **NOTE**: If image doesn't exist it will generate an error that it is not able to pull the specified image although image still exists. There is a catch that new image tag will not be deployed until a succesful deployment is done.

5. Sometime Jenkins create image for the branch name but not for the PR and in dev env the flux looks for the image with PR regex `^([0-9]+.[0-9]+.[0-9]+-PR-[0-9]{2}-[0-9]+-SNAPSHOT)$`. To resolve this issue just rerun the PR pipeline.

## End to End tests for the application

Applications end to end test require AWS credentials to push the test videos to S3 bucket. Create the credentials with `aws-credentials` id.