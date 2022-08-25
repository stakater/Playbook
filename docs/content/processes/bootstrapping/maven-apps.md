# Bootstrapping a Maven App

For bootstrapping a maven application to use the complete set of files to use our artifacts, you can take the following steps:

## Build a Spring Boot Application

Create a spring boot maven application and make sure it is running fine locally.

## Pre-requisites

You should have

- Jenkins
- Chartmuseum
- Helm

installed on your cluster for this to work fully.

## Adding Stakater's Draft Pack

Go to [Stakater Maven Draft Pack](https://github.com/stakater/draft-pack/tree/master/packs/maven), and copy the following files and folders from there:

- Dockerfile
- Jenkinsfile
- Makefile
- deployments folder

## Replacing Contents

First of all, add `*.tgz` in your .gitignore so that your chart never gets pushed on your git repository.

Now you would need to replace some values in the above files, as we have left them as placeholders. So you would need to change them with their actual values when using this draft. All such values start with REPLACE_ME. The values are:


| VALUE                   |Description                                                                    |
|-----------------------|-------------------------------------------------------------------------------|
| REPLACE_ME_APP_NAME                  | replace it with app name in lower case, make sure your app name is set to the artifact id in pom.xml. Notice that in deployments/kubernetes/chart/ we also need to replace the folder name with your app name  |
| REPLACE_ME_IMAGE_NAME          | replace it with your `<git-repo-owner>/<app-name>` name |
| REPLACE_ME_IMAGE_SECRET        | replace with "" if using a public image  |
| REPLACE_ME_IMAGE_TAG  | replace it with your app tag  |
| REPLACE_ME_HEALTH_ENDPOINT  | replace it with endpoint of your application or remove the probe section if you dont want liveness and readiness probes |
| REPLACE_ME_HEALTH_PORT  | replace it with the liveness/readiness probe port |
| REPLACE_ME_SERVICE_PORT | replace it with the port on which your service will run |
| REPLACE_ME_NAMESPACE_NAME | the namespace you want the app to be deployed if deploying through Makefile. |

The above values need to be changed in the **values.yaml.tmpl**(the file needed to generate values.yaml in pipeline) and **values.yaml**(for local verification) files.  

Moreover, you can add/remove stuff from the above files, like if you dont want configmap and secrets, you can remove that part. You can remove/change tolerations or replicas or any such stuff in above files. Please make sure to make changes in **values.yaml.tpl** file as that file is actually used to deploy your application in a pipeline.

## Understanding the Jenkinsfile

In Jenkinsfile, we are using a generic function for releasing Maven based applications, so the pipeline is parameterized. The following parameters can be set.

| Parameter                   |Description                                                                    |
|-----------------------|-------------------------------------------------------------------------------|
| REPLACE_ME_GIT_USER                  | The Git Username used to clone the repository |
| REPLACE_ME_GIT_MAIL          | The git user email needed to clone the repo in Jenkins pipeline |
| deployUsingMakeTarget | The boolean value if you want to deploy your application using the make target in your makefile |
| dockerRepositoryURL | The docker registry url where you want to publish your image |
| chartRepositoryURL | The chart registry url where you want to publish your helm chart |
| javaRepositoryURL | The nexus registry url where you want to publish your jars |