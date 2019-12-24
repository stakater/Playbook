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

Stakater Platform can be deployed using GitLab CI with the following steps:

### Pre-Pipeline 
The sections contains some manual steps that must be done before running the pipeline:


1. Fork [StakaterPlatform](https://github.com/stakater/StakaterPlatform) repository in GitLab. It is recommended to fork it in a private repository as you have to add sensitive information in it.

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

### Deployment Validation

Stakater Platform can be validated by using the following steps:

1. URL given below belongs to a web application that contins link to all the platform components. Open each application to verfiy whether it is working or not.

```bash
https://forecastle-control.YOUR_DOMAIN.com
```

2. We will deploy [Nordmart](/content/workshop/nordmart-intro) application to further validate the platform deployment. Follow the steps given below:

    1. Open the Jenkins using the web application discussed in `step 1`.

    2. Create a Gitlab 

   








## Compatibility Matrix

Stakater Platform has been tested on following environment:

| Platform Version| K8s Version  | Infrastructure |
|---|---|---|
| v0.0.1 | 1.14 | eks.6 |

