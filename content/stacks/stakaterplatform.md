# StakaterPlatform

Stakater Platform provides stacks to control, monitor, log, trace and security for applications deployed on kubernetes using SecDevOps best practices.

Stakater Platform consist of 6 stacks

- [Control](./control)
- [Delivery](./delivery)
- [Logging](./logging)
- [Monitoring](./monitoring)
- [Security](./security)
- [Tracing](./tracing)

## How to Use

Stakater Platform can deployed using GitLab CI(other methods can also be used) with the following steps:

### Pre-Pipeline Configuration
The sections contains steps that must be performed before running the pipeline:

1. Fork [StakaterPlatform](https://github.com/stakater/StakaterPlatform) repository in Github and import it in you Gitlab.

It is recommended to fork it in a private repository as you have to add sensitive information in it.

2. Tools have been configured with default configurations. Which can be replaced based on the requirement. Secrets have base64 encoded data in it which is not secure, so it is recommeded to secure the secret either by using [SealedSecrets](https://playbook.stakater.com/content/stacks/control/stakaterplatform.html#SealedSecrets) or any other method of your choice. The table given below provide a list of configuration that can be modified by the user.

| Variables                           | Required  |  File Path          |
| :---------------------------------: | :-------: | :------------------:|
| JENKINS_SECURITY_REALM              |    Yes    |   platform/delivery/jenkins.yaml  |
| BASE64_ENCODED_ADMIN_ACCOUNT_JSON   |    Yes    |   platform/delivery/nexus.yaml |
| BASE64_ENCODED_CLUSTER_ACCOUNT_JSON |    Yes    |   platform/delivery/nexus.yaml  |
| REPLACE_ADMIN_ACCOUNT_USERNAME      |    Yes    |   platform/delivery/nexus.yaml  |
| REPLACE_CLUSTER_ACCOUNT_USERNAME    |    Yes    |   platform/delivery/nexus.yaml |
| SONARQUBE_PROPERTIES                |    Yes    |   platform/delivery/sonarqube.yaml  |
| SONARQUBE_PROPERTIES                |    Yes    |   platform/delivery/sonarqube.yaml  |
| BASE64_ENCODED_IMC_CONFIG           |    Yes    |   |
| BASE64_ENCODED_JENKINS_CFG          | 
| BASE64_ENCODED_KEYCLOAK_CLIENT_ID   |
| BASE64_ENCODED_KEYCLOAK_CLIENT_SECRET |
| BASE64_ENCODED_ADMIN_ACCOUNT_JSON   |
| BASE64_ENCODED_CLUSTER_ACCOUNT_JSON |
| NEXUS_ADMIN_ACCOUNT_USERNAME        | 
| NEXUS_CLUSTER_ACCOUNT_USERNAME      |
| BASE64_ENCODED_HUB_TOKEN            |
| BASE64_ENCODED_GITLAB_TOKEN         |
| BASE64_ENCODED_BITBUCKET_TOKEN      |
| BASE64_ENCODED_ALERTMANAGER_CONFIG  |
| BASE64_ENCODED_KEYCLOAK_CONFIG      |
| BASE64_ENCODED_PROXYINJECTOR_CONFIG |
| TLS CERTS                           |


    Once the above configuration have been modified. Commit the changes back in the repository. So that those changes can be used in pipeline for StakaterPlatform deployment.

### Pipeline Execution

1. Configure these enviornment variables in gitlab pipeline.  

| Environment Var.               | Required  |   Default Value   |
| :----------------------------: | :-------: | :----------------:|
| STAKATER_PLATFORM_SSH_GIT_URL  |    Yes    |   null (e.g. `ssh://git@github.com/stakater/StakaterPlatform.git`) |
| STAKATER_PLATFORM_BRANCH       |    Yes    |   master  |
| KUBE_CONFIG                    |    Yes    |   null (Base64 encoded kubeconfig)    |
| CLOUD_PROVIDER                 |    Yes    |   aws             |
| AWS_ACCESS_KEY_ID              |  (if AWS) |   null            |
| AWS_SECRET_ACCESS_KEY          |  (if AWS) |   null            |

2. The Pipline will deploy flux pod in flux namespace and output an ssh key which must be added to deploy keys in forked repo with read and write access to allow flux to initiate GitOps.

SSH is printed by flux in its logs. Logs can be seen using the command given below:

```bash
# it will print all the pods names in flux namespace, copy the flux pod name and used it in the next command
$ kubectl get pods -n flux


# it will print the flux logs, SSH key can be found at the start of the logs
$ kubectl logs <flux-pod-name> -n flux
```

5. Once the key is added, all namespaces and tools will be deployed in the cluster using by flux. 

6. If configuration need to be changed, change it locally and then commit the changes in the repository. Flux continously monitor the reposiotry and apply the changes on the cluster.

### Stkater Platform Deployment Validation

Stakater Platform can be validated by using the following steps:

1. URL given below belongs to a web application that contins link to all the platform components. Open each application to verfiy whether it is working or not.

```bash
https://forecastle-control.YOUR_DOMAIN.com
```

2. We will deploy [Nordmart](/content/workshop/nordmart-intro) application to further validate the platform deployment. Follow the steps given below:

    1. Open the Jenkins using the web application discussed in `step 1`.
    
    2. Create an organization and fork the following repositories:

        1. [Normart dev tools](https://github.com/stakater-lab/nordmart-dev-tools), it contains the tools required to deploy the web application.
        2. [Nordmart dev apps](https://github.com/stakater-lab/nordmart-dev-apps), it contains the manifests for the normart appplication microservices.

    3. Create following credentials in Jenkins:

        1. Credentials for cloning repositories.
        2. Github token api, used for commenting on PRs.

    4. Create a Github Organization for the nordmart application with following configuration.

        1. Use the credentials created above.
        2. Set organization name as the owner.
        3. Add the regex filter for repositories to just get the nordmart repos. The regex is given below:
        ```
            .*nordmart.*
        ```
        4. Add the regex given below in the `Automatic branch project triggering` sections, as we will be triggering only master and PRs:
        ```
            PR-\d+|master
        ```
        5. Save the configuration, it will scan the organization and create pipeline for the repositories you forked in `step 2`.

    5. Once repositories are forked. Make the required changes in the `nordmart-dev-tools` repository's Jenkinsfile. Jenkinsfile use the [Stakater Pipeline Library](https://github.com/stakater/stakater-pipeline-library).

    6. Now run the pipeline. If pipeline run sucessfully, it will perform following things:
        
        1. Create a namespace named `nordmart-dev-apps`.
        
        2. Install flux in the namespace.

    7. Flux need access to the `nordmart-dev-apps` repository to deploy the applications. Access can be provided to flux add its SSH key in repository. flux SSH key can be retrieved using the commands given below:
    ```bash
    # it will print all the pods names in nordmart-dev-apps namespace, copy the flux pod name and used it in the next command
    $ kubectl get pods -n nordmart-dev-apps


    # it will print the flux logs, SSH key can be found at the start of the logs
    $ kubectl logs <flux-pod-name> -n nordmart-dev-apps
    ```
    
    8. Once key is added, microservice will be deployed. Mircoservices will pull the images from Stakater's [dockerhub](https://hub.docker.com/u/stakater/).


## Compatibility Matrix

Stakater Platform has been tested on following environment:

| Platform Version| K8s Version  | Infrastructure |
|---|---|---|
| v0.0.1 | 1.14 | eks.6 |

