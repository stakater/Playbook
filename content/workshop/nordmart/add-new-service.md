# Add New Service to Nordmart

[[toc]]

You would have to do the following steps to add a new service to Nordmart.

## Steps

### 1. Add a Repo

You would need to create a New Repository in `stakater-lab` organization. You can ask the Admin of the organization to create one and grant you access to the repo. Once given access, you can add your code to the repository.

### 2. Add related manifests

You would have to add following manifests to the repository so the CI/CD pipeline can work. The following are manifests for Java Application

**Dockerfile**

Add following content in the Dockerfile

```Dockerfile
FROM gcr.io/distroless/java:8

LABEL name="REPLACE_ME_SERVICE_NAME" \
      maintainer="Stakater <stakater@aurorasolutions.io>" \
      vendor="Stakater" \
      release="1" \
      summary="REPLACE_ME_SERVICE_DESCRIPTION"

USER 1001

ENV HOME=/opt/app
WORKDIR $HOME

# Expose the port on which your service will run
EXPOSE 8080

# NOTE we assume there's only 1 jar in the target dir
COPY target/*.jar $HOME/artifacts/app.jar

CMD ["artifacts/app.jar"]
```

Replace the service name and description.

**Jenkinsfile**

Add following content in the Jenkinsfile.

```Jenkinsfile
#!/usr/bin/env groovy
@Library('github.com/stakater/stakater-pipeline-library@v2.16.3') _

releaseApplication {
    appName = "REPLACE_ME_SERVICE_NAME"
    appType = "maven"
    builderImage = "stakater/builder-maven:3.5.4-jdk1.8-apline8-v0.0.3"
    goal = "clean package"
    notifySlack = false
    runIntegrationTest = false
    gitUser = "stakater-user"
    gitEmail = "stakater@gmail.com"
    usePersonalAccessToken = true
    tokenCredentialID = 'GithubToken'
    serviceAccount = "jenkins"
    dockerRepositoryURL = 'REPLACE_ME_DOCKER_REGISTRY_URL'
}
```

Adding the above file, will automatically add the pipeline in Jenkins as we use Github Organization, so it adds webhook and looks for new repos automatically.
