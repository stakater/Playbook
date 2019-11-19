# CI/CD for NordMart

Nordmart has 5 microservices for now. The strategy we use is each microservice will have its own codebase and repository and will be using the same pipeline library function `releaseApplication`, a generic function to build application, run unit tests, build & push docker image, run end-to-end tests.

For versioning, we also have different strategies for PR and master. For master, we use semantic versioning. And for PR, we use `0.0.0-PR-Number-BuildNumber-SNAPSHOT`.

We currently have setup 2 environments for Nordmart, we create separate repos for different environments e.g. `nordmart-dev-apps` and `nordmart-prod-apps`

**1. Dev:** We use GitOps for Dev Environment and we use Flux for GitOps. `Nordmart-Dev-Apps` will contain all the HelmReleases required for setting up Nordmart microservices, and soon as new image is built which follows the PR regex, Flux will update it automatically in the Dev Environment. So whenever a PR is created and its pipeline runs successfully pushing the image to docker registry, Flux will update dev environment to latest image.

For Deployment of Dev Environment, currently we have scaled down Flux to 0, and have all the manifests in the repo. As soon as flux's pod is scaled up to 1, it will sync the state of `nordmart-dev-apps` with the cluster.

Go to Openshift Console -> Select Project nordmart-dev-apps -> Scale Flux's Deployment to 1.


**1. Prod:** We use CIOps for Prod Environment and we use Jenkins for CIOps. `Nordmart-Prod-Apps` will contain all the HelmReleases required for setting up Nordmart microservices, So when a PR is approved and merged, master pipeline is run, it will generate an image in semantic version, so you can update that in the `nordmart-prod-apps` repo and its corresponding pipeline will run which will update the image in the cluster.

Prod environment is already deployed in the cluster.
