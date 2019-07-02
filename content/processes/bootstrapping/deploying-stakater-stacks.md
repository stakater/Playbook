# Deploying Stakater Stacks

## Overview
This guide provides guidelines on the deployment of Stakater Stacks. Currently, there are two ways to install Stakater Stacks on kubernetes:

- Jenkins CI/CD pipeline.
- Gitlab CI/CD pipeline.


## Jenkins CI/CD Pipeline

To deploy Stakater Stacks using Jenkins CI/CD, create pipeline for stack with following values:

### Configuration
- Create a new folder `Stacks` that will hold pipeline of each stack by using the `New Item` feature.
- Inside the `Stacks` folder add a `Pipeline` for each stack by using the `New Item` feature.
- In `General` settings UI enter stack repository URL in `GitHub Project`'s `Project url` field.
- Select the checkbox `This project is parameterized` and add the following parameters

  | Name           | Default Value | Type   | Description                                               |
  |----------------|--------|--------|-----------------------------------------------------------|
  | REPO_URL       | URL of pipeline repository | String | link to stack repo                                        |
  | BRANCH         | master | String | name of branch to deploy                                  |
  | CREDENTIALS_ID | Name of the user | String | Id of Jenkins credentials to use to clone above git repo  |
  | PROVIDER       | `azure` or `aws` | Choice | Allow either aws or azure                                 |
  | MAKE_TARGET    | Stack's Makefile targets | Choice | Allow targets available in Stack's Makefile               |
  | NAMESPACE      | Stack's Namespace | String | Specify the name of namespace that should be forwarded to MakeFile |
  | KUBE_CONFIG    | None | Multi line String | Kube Config of Kubernetes stack in which it should deploy the stack |
  | INSTALL_PVC  | None | String | Flag to install PVC or not. Its value can be either `true` or `false`. |

- Add the script given below in Pipeline Script or create a `Jenkinsfile` in the stack repository:
  
  ```groovy
    #!/usr/bin/env groovy
    @Library('github.com/stakater/stakater-pipeline-library@v2.15.0') _

    String repoURL = ""
    try {
        repoURL = REPO_URL
    } catch (Throwable ignored) {
        repoURL = ""
    }

    if (repoURL == "") {
        error("REPO_URL must be specified")
    }

    String branch = ""
    try {
        branch = BRANCH
    } catch (Throwable ignored) {
        branch = ""
    }

    if (branch == "") {
        error("BRANCH must be specified")
    }

    String credentialsID = ""
    try {
        credentialsID = CREDENTIALS_ID
    } catch (Throwable ignored) {
        credentialsID = ""
    }

    if (credentialsID == "") {
        error("CREDENTIALS_ID must be specified")
    }

    String provider = ""
    try {
        provider = PROVIDER
    } catch (Throwable ignored) {
        provider = ""
    }

    if (provider == "") {
        error("PROVIDER must be specified")
    }

    String makeTarget = ""
    try {
        makeTarget = MAKE_TARGET
    } catch (Throwable ignored) {
        makeTarget = ""
    }

    if (makeTarget == "") {
        error("MAKE_TARGET must be specified")
    }

    String namespace = ""
    try {
        namespace = NAMESPACE
    } catch (Throwable ignored) {
        namespace = ""
    }

    if (namespace == "") {
        error("NAMESPACE must be specified")
    }

    Boolean installPVC = false
    try {
        installPVC = INSTALL_PVC
    } catch (Throwable ignored) {
        installPVC = false
    }

    String kubeConfig = ""
    try {
        kubeConfig = KUBE_CONFIG
    } catch (Throwable ignored) {
        kubeConfig = ""
    }

    if (kubeConfig == "") {
        error("KUBE_CONFIG must be specified otherwise default cluster is used")
    }


    def utils = new io.fabric8.Utils()
    def flow = new io.stakater.StakaterCommands()

    timeout(time: 20, unit: 'MINUTES') {
        timestamps {
            stakaterNode() {
                container(name: 'tools') {
                    stage('checkout') {
                        git branch: branch , url: repoURL, credentialsId: credentialsID
                    }
                    
                    stage('configure') {
                        writeFile file: '/home/jenkins/.kube/config', text: kubeConfig
                    }
                    
                    stage('apply') {
                        executeMakeTargets {
                            target = makeTarget
                            NAMESPACE = namespace
                            PROVIDER_NAME = provider
                            INSTALL_PVC = installPVC
                        }
                    }
                }
            }
        }
    }
  ```

## Gitlab CI/CD Pipeline

This section provides guidelines on deploying Stakater Stacks on kubernetes cluster.

### Configuration

* Github Personal Access Token will be used to pull stacks repository.

* Create a repository on Gitlab and configure its [pipeline](/content/processes/bootstrapping/gitlab-pipeline-configuration.html). 

* Gitlab CI/CD pipeline requires some environment variables, their description is given below:

    | Environment Variables | Type | Description | Source | 
    |---|---|---|---|
    | KUBE_CONFIG | String (base64 encoded) | Kubernetes configuration file. | Gitlab CI/CD Enviroment Variable |
    | GITHUB_TOKEN  | String (encoded) | Github Personal Access token. It can be generated by following this [guideline](https://github.com/stakater/til/blob/master/gitlab/gitlab-integration-with-github.md). | Gitlab CI/CD Environment Variable |
    | STACK  | String | Name of the stack that will be deployed. Possible values are `global`, `release`, `logging`, `monitoring`, `tracing` |  Gitlab CI/CD Environment Variable |
    | NAMESPACE  | String | Deployment namespace. | Config file |
    | PROVIDER  | String | Cloud provider's name. Currently, we support AWS and Azure. Its value can be provided as `aws` for AWS and `azure` for Azure. | Config file |
    | INSTALL_PVC  | String | Flag to install PVC or not. Its value can be either `true` or `false`. | Config file |
    | REPO_URL  | String | URL of the stack repository that need to be deployed. From each repository URL only the part after this section `https://` is required. Like from `https://github.com/stakater/til.git` URL we require only the `github.com/stakater/til.git` part | Config file |
    | BRANCH  | String | Branch name that will be deployed. | Config file |
    | TARGET  | String | Makefile target's name that will be executed. Makefile exists in Tracing stack Github repository. |
    | INSTALL_PVC  | String | Flag to install PVC or not. Its value can be either `true` or `false`. |

* `Gitlab CI/CD environment variables` can be configured from the dashboard `Gitlab Project Setting -> CI/CD -> Variables`.

* `Config variables` can be configured by creating a `global.sh` file in the root folder and export the stack specific variables from there. It will reduce the chances of errors in configuration because now few CI/CD variables needs to be changed for each deployment. Example of config file is given below:
    ```bash
    export BRANCH="master"
    export INSTALL_PVC="true"
    export NAMESPACE="<stack-namespace>"
    export PROVIDER="aws"
    export REPO_URL="github.com/stakater/<stack-name>.git"
    export TARGET="install-dry-run"
    ```

* Once environment variables are configured create a `.gitlab-ci.yml` file in project root directory and paste the configuration given below in it:

    ```yaml
    image:
        name: stakater/gitlab:0.0.3

    before_script:

        - if [ $STACK == "global" ]; then \
        -     echo "Gloabl Stack"; \
        -     source ./global.sh; \

        - elif [ $STACK == "release" ]; then \ 
        -     echo "Release Stack"; \ 
        -     source ./release.sh; \

        - elif [ $STACK == "logging" ]; then \
        -     echo "Logging Stack"; \ 
        -     source ./logging.sh; \

        - elif [ $STACK == "monitoring" ]; then \
        -     echo "Monitoring Stack"; \ 
        -     source ./monitoring.sh; \

        - elif [ $STACK == "tracing" ]; then \
        -     echo "Tracing Stack"; \ 
        -     source ./tracing.sh; \

        - else \
        -     echo "Invalid stack name provided"
        -     exit 1 
        - fi

        - echo "configuration kubernetes access in pipeline"
        - mkdir ~/.kube/
        - echo $KUBE_CONFIG | base64 -d > config
        - mv config ~/.kube/

        - echo "Extracting repository name from the URL"
        - BASE_NAME=$(basename $REPO_URL)
        - REPO_NAME=${BASE_NAME%.*}

    stages:
        - deploy

    deploy:
        stage: deploy
        script:
        
        - echo "Cloning repository and redirecting the output to black hole because we don't want GITHUB_TOKEN to be visible on pipeline logs"
        - git clone https://$GITHUB_TOKEN@$REPO_URL > /dev/null

        - echo "Moving inside cloned repository directory"
        - cd $REPO_NAME

        - echo "Checkout to the deployment branch"
        - git checkout $BRANCH

        - echo "Deploying stack on kubernetes cluster"
        - if [ -z "$NAMESPACE" ]; then \
        -       make $TARGET PROVIDER_NAME=$PROVIDER INSTALL_PVC=$INSTALL_PVC; \
        - else \
        -       make $TARGET NAMESPACE=$NAMESPACE PROVIDER_NAME=$PROVIDER INSTALL_PVC=$INSTALL_PVC; \      
        - fi
    ```

* `Config variables` file is just a way to easy the deployment process, it is also possible to configure all `configuration variables` through Gitlab CI/CD environment variable. If you configure all the configuration variables through Gitlab CI/CD env variable feature then remove the code snipped(that checks which stack to deploy) from the `before_script` section of `.gitlab-ci.yml` file and also remove the `STACK` CI/CD environment variable.

* Once configuration is done, run the Gitlab pipeline for deployment by pushing a commit or manually trigger the pipeline.

Run the pipelines in the following order:

- [Global](https://github.com/stakater/StakaterKubeHelmGlobal)
- [Release](https://github.com/stakater/StakaterKubeHelmRelease)
- [Logging](https://github.com/stakater/StakaterKubeHelmLogging)
- [Monitoring](https://github.com/stakater/StakaterKubeHelmMonitoring)
- [Tracing](https://github.com/stakater/StakaterKubeHelmTracing)
