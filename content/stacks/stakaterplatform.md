# StakaterPlatform

Stakater Platform provides `zero-to-operations` stacks to control, monitor, log, trace and security for applications deployed on kubernetes using SecDevOps best practices.

Stakater Platform consist of 6 stacks

- [Control](./control)
- [Delivery](./delivery)
- [Logging](./logging)
- [Monitoring](./monitoring)
- [Security](./security)
- [Tracing](./tracing)

## How to Use

Stakater Platform can be deployed using GitLab CI with the following steps:

1. Fork [StakaterPlatform](https://github.com/stakater/StakaterPlatform) repository in GitLab.
2. Following variables should be updated against place holder values according to the requirements (commit changes back into the forked repo because we use GitOps ). See [SealedSecrets](https://playbook.stakater.com/content/stacks/control/stakaterplatform.html#SealedSecrets) section to configure secrets 

| Variables                           | Required  |  File Path          |
| :---------------------------------: | :-------: | :------------------:|
| JENKINS_SECURITY_REALM              |    Yes    |   platform/delivery/jenkins.yaml  |
| BASE64_ENCODED_ADMIN_ACCOUNT_JSON   |    Yes    |   platform/delivery/nexus.yaml |
| BASE64_ENCODED_CLUSTER_ACCOUNT_JSON |    Yes    |   platform/delivery/nexus.yaml  |
| REPLACE_ADMIN_ACCOUNT_USERNAME      |    Yes    |   platform/delivery/nexus.yaml  |
| REPLACE_CLUSTER_ACCOUNT_USERNAME    |    Yes    |   platform/delivery/nexus.yaml |
| SONARQUBE_PROPERTIES                |    Yes    |   platform/delivery/sonarqube.yaml  |

3. Edit the following variables in Environment variables for `gitlab-ci.yml` to deploy StakaterPlatform

| Environment Var.               | Required  |   Default Value   |
| :----------------------------: | :-------: | :----------------:|
| STAKATER_PLATFORM_SSH_GIT_URL  |    Yes    |   null (e.g. `ssh://git@github.com/stakater/StakaterPlatform.git`) |
| STAKATER_PLATFORM_BRANCH       |    Yes    |   master  |
| KUBE_CONFIG                    |    Yes    |   null (Base64 encoded kubeconfig)    |
| CLOUD_PROVIDER                 |    Yes    |   aws             |
| AWS_ACCESS_KEY_ID              |  (if AWS) |   null            |
| AWS_SECRET_ACCESS_KEY          |  (if AWS) |   null            |

4. The Pipline will deploy flux pod in flux namespace and output an ssh key which must be added to deploy keys in forked repo with read and write access to allow flux to initiate GitOps.

Find ssh key by the following commands
```
kubectl get pods -n flux
kubectl logs <flux-pod-name> -n flux
```

5. After the key is added, all namespaces and tools will be deployed in the cluster using GitOps

6. Add SealedSecrets Key for the sealed secrets to be unsealed in control namespace.

7. To make any further changes to the Platform, all changes must be done via commiting changes in git repo. Changes would be reflected in the cluster through GitOps workflow

## SealedSecrets

StakaterPlatform uses [SealedSecrets](https://github.com/bitnami-labs/sealed-secrets) to secure Secrets in Kubernetes Cluster.

Sealed Secret resources needs to be updated when the platform is deployed. SealedSecrets controller is deployed in the control namespace and outputs the certificate in its logs. Use this certificate to regenerate sealed secrets for your cluster. More info [here](https://playbook.stakater.com/content/processes/security/sealed-secrets.html)
