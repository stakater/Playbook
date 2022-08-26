# AWS

## Overview

This guide provides guideline regarding kubernetes cluster management on AWS with [Kops](https://github.com/kubernetes/kops) using CI/CD pipeline. `Kops` is a utility that helps to `create`, `destroy`, `upgrade` and `maintain` production-grade and highly available Kubernetes cluster. Kops will be used for cluster deployment. Cluster can be created by using CLI utility, Gitlab or Jenkins pipeline.

## Pre-requisites

Cluster deployment requires following resources:

  * S3 Bucket
  * Domain

If following resources are already available then continue to [Cluster Creation](/content/kubernetes/aws.html#cluster-creation) section otherwise follow steps provided to create resource in [AWS Resource Creation](/content/kubernetes/aws.html#aws-resource-creation) section.

## Configuration & Deployment

This section contains the guideline to create resources on AWS.

### AWS Resource Creation

* In this section we will try to create `S3 bucket` and `domain` using `terraform`.

* Create a folder `aws-resources-manifest` to store AWS resources manifest and add the following manifests:

  #### Manifests Creation

  1. Create a file named `aws-resources-manifest/configuration_vars.tfvars` to store the variable values:
    ```terraform
    # Prefix for AWS resources
    resource_prefix=kops-

    # Name of the region in which resource will be created
    region="<add-value-here>"

    # User account's access key
    aws_access_key=<add-value-here>

    # User account's access key secret
    aws_secret_key=<add-value-here>

    # Name of the domain
    public_domain=<add-value-here>

    # Destroy the resource forcely, boolean variable
    force_destroy=<false>  #boolean

    # Name of the bucket to store the configuration
    kops_state_bucket_name=<add-bucket-name-here>
    ```

  2. Create a file named `aws-resources-manifest/variables.tf`, to hold default values of variables so if a variable is not provided in `aws-resources-manifest/configuration_vars.tf` then default values specified in this file will be used:
      
    ```terraform
    variable resource_prefix {
        default = "kops-"
        description = "Prefix for resources"
    }

    variable "region" {
        default = "us-east-1"
        description = "Name of the region in which resource will be created"
    }

    variable "aws_access_key" {
        default = "<ACCESS_KEY>"
        description = "User access key"
    }

    variable "aws_secret_key" {
        default = "<SECRET_KEY>"
        description = "User's access key secret"
    }

    variable "public_domain" {
        default = "<domain>"
        description = "Name of the domain"
    }

    variable "force_destroy" {
        default = false
        description = "Destroy the resource forcely, boolean variable"
    }

    variable "kops_state_bucket_name" {
        default = "kops-state-bucket"
        description = "Name of the bucket to store the configuration"
    }  
    ```  

  3. Create a file named `aws-resources-manifest/provider.tf`, to hold the provider configuration
    
    ```terraform
    provider "aws" {
      region     = "${var.region}"
      access_key = "${var.aws_access_key}"
      secret_key = "${var.aws_secret_key}"
    }
    ```

  4. Create a file named `aws-resources-manifest/route53-zone.tf`, to hold route53 hosted zone data for managing DNS records on kubernetes cluster:

    ```terraform
    module "net_route53_zone" {
        source = "github.com/stakater/blueprint-utilities-aws.git//modules/route53/public?ref=v0.3.0"
        public_domain = "${var.public_domain}"
        force_destroy = "${var.force_destroy}"
    }
    ```

  5. Create a file named `aws-resources-manifest/stackator-s3-kops-state.tf` to create `s3 bucket` to store terraform state of kops cluster:
    ```terraform
    module "stackator_s3_kops_state" {
    source = "github.com/stakater/blueprint-storage-aws.git//modules/s3/private?ref=v3.0.0"
    name = "${var.kops_state_bucket_name}"  
    }
    ```

#### Resource Creation

There are multiple ways to create AWS resources:
    
  ##### Using CLI

  * Add the terrafrom manifests using the directory structure given below:

```bash
.
├── aws-resources-manifest/
│   └── configuration_vars.tfvars
│   └── variables.tf
│   └── provider.tf
│   └── route53-zone.tf
│   └── stackator-s3-kops-state.tf
```

  * Follow the guidelines given below to creation resource:

```bash
# moving inside manifests folder
cd aws-resources-manifest/

# initializing terraform env
terraform init
terraform validate

# dry run to validate the manifests
terraform plan

# applying the manifests
terraform apply -auto-approve
```

##### Using Jenkins Pipeline

Jenkins pipeline requires following parameter.


| Environment Variable | Description | Type |
|---|---|---|
| IS_DRY_RUN | Pipeline execution mode. Valid values are `true` or `false`. `true` to only show changes, `false` to actually execute steps | string | 
| BRANCH | Name of git branch | string |


* Add the terrafrom manifests using the directory structure given below:

```bash
.
├── aws-resources-manifest/
│   └── configuration_vars.tfvars
│   └── variables.tf
│   └── provider.tf
│   └── route53-zone.tf
│   └── stackator-s3-kops-state.tf
├── Jenkinsfile
```

* Create a Jenkinsfile and paste the content given below:

```groovy
def BRANCH='master'
Boolean isDryRun = true

try {
    isDryRun = IS_DRY_RUN == "true" ? true : false
} catch (Throwable e) {
    error("IS_DRY_RUN must be specified either true or false")
}

podTemplate(label: 'builder', containers: [
    containerTemplate(name: 'terraform', image: 'stakater/pipeline-tools:1.13.2', ttyEnabled: true, command: 'cat'),
    ]) {

    node('builder') {
    git branch: "${BRANCH}", credentialsId: 'xxxx-github', url: "git@github.com:CACSPC/xxxx-v3-configure.git"

    container('terraform') {

        stage('Init terraform') {
            sh """
                cd aws-resources-manifest/
                terraform init
                terraform validate
            """
        }

        if (isDryRun) {
            stage('Init terraform') {
                sh """
                    cd aws-resources-manifest/
                    terraform plan
                """
            }
        }
        else {
            stage('Create Resources') {
                sh """
                    cd aws-resources-manifest/
                    terraform apply -auto-approve -var-file="configuration_vars.tfvars"
                """
            }
        }
    }
    }
}
```
    
* Create a Repository, add the manifest in the structure given above and configure it with Jenkins pipeline. 

##### Using Gitlab CI/CD Pipeline
      
* Create a repository on Gitlab and configure its CI/CD pipeline following this [guideline](/content/processes/bootstrapping/gitlab-pipeline-configuration.md).

* Configure following Gitlab CI/CD environemnt variables:

| Environment Variable | Description | Type |
|---|---|---|
| IS_DRY_RUN | Pipeline execution mode. Valid values are `true` or `false`. `true` to only show changes, `false` to actually execute steps | string |

* Add the terrafrom manifests using the directory structure given below:
```bash
.
├── aws-resources-manifest/
│   └── configuration_vars.tfvars
│   └── variables.tf
│   └── provider.tf
│   └── route53-zone.tf
│   └── stackator-s3-kops-state.tf
├── .gitlab-ci.yml
```

* Add the terraform manifest folder in the repository and insert the following content in `.gitlab-ci.yml` file.
```yaml
image:
name: stakater/gitlab:0.0.3

stages:
- deploy

deploy:
stage: deploy
script:

  # moving inside manifests folder
  - cd aws-resources-manifest/

  # initializing terraform env
  - terraform init
  - terraform validate

  - if [ $IS_DRY_RUN == "true" ]; then \

  -     echo "Running pipeline as dry run mode"; \
  -     terraform plan; \
        
  - elif [ $IS_DRY_RUN == "false" ]; then \ 
  -     echo "Creating resource"; \ 
  -     terraform apply -auto-approve; \

  - else \
  -     echo "Invalid value for IS_DRY_RUN provided:" $IS_DRY_RUN;
  # error exit code is 1
  -     exit 1
  - 
```
<hr/>

### Kubernetes Cluster Creation

* Make sure that all pre-requisite requirements specified in [AWS Resource Creation](/content/kubernetes/aws.html#aws-resource-creation) are complete.

#### Manifests Creation

Create a `cluster.yaml` file by using [stakater kops cluster templates](https://github.com/stakater/kops-cluster-templates). Fill the template placeholders with valid values.

#### Cluster Creation

* Cluster can be created by multiple ways:

##### By Using CLI

```bash

# configure these envrionment variables before using the command given below, description of these env vars are provided in the sections given below.
export AWS_ACCESS_KEY
export AWS_ACCESS_KEY_SECRET
export KOPS_STATE_STORE_NAME
export CLUSTER_NAME
export ACTION
export IS_DRY_RUN
export REGION
export SSH_PUB_KEY
export NO_OF_CLUSTER_NODES

# moving inside manifests folder
cd cluster-manifests

# configuring SSH_PUBLIC_KEY
echo $SSH_PUB_KEY | base64 -d > $HOME/.ssh/id_rsa_aws.pub

# configuring AWS credentials
mkdir -p $HOME/.aws/
printf "[default]\naws_access_key_id = $AWS_ACCESS_KEY\naws_secret_access_key = $AWS_ACCESS_KEY_SECRET" > $HOME/.aws/credentials
printf "[default]\nregion = $REGION" > $HOME/.aws/config

# creating cluster
kops replace -f cluster.yaml --name $CLUSTER_NAME --state $KOPS_STATE_STORE_NAME --force

kops create secret --name $CLUSTER_NAME --state $KOPS_STATE_STORE_NAME $SSH_PUB_KEY admin -i ~/.ssh/id_rsa_aws.pub

# Creating cluster
kops update cluster $CLUSTER_NAME --state $KOPS_STATE_STORE_NAME $DRY_RUN
kops export kubecfg --name $CLUSTER_NAME --state $KOPS_STATE_STORE_NAME

# Verying cluster creation
count=0; \
tryLimit=100; \
tryCount=0; \
nodeCount=$NO_OF_CLUSTER_NODES; \

# loop to validate nodes are created
while [ $tryCount -lt $tryLimit ] && [ $count -lt $nodeCount ]; do \

        # storing the result of command to check whether command contains True or not
        count="$(kops validate cluster $CLUSTER_NAME --state $KOPS_STATE_STORE_NAME | grep -o 'True' | wc -l)"; \

        echo 'Sleeping for 15 seconds ...' && sleep 15s; \
        echo "Number of try:" + $tryCount; \

        tryCount=$((tryCount + 1)); \
done

# for rolling update the cluster
kops rolling-update cluster --name $CLUSTER_NAME --state $KOPS_STATE_STORE_NAME $DRY_RUN
# for tearing down the cluster
kops delete cluster --name $CLUSTER_NAME --state $KOPS_STATE_STORE_NAME $DRY_RUN
```

* Project should have the following structure:

```bash
.
├── cluster.yaml
```

##### Using Jenkins Pipeline

* Create a simple `Jenkins pipeline` that should executes the `Jenkinsfile`. Follow these steps to configure the pipeline.

* Under general heading select `This project is parameterized` option. Then add the following parameters:

    | Environment Variable | Description | Type |
    |---|---|---|
    | AWS_AUTH_METHOD | User can use either `arn` or `access_key` method for authentication. Possible values are `arn` or `access_key` | string |
    | AWS_ROLE_ARN | AWS role's arn | string |
    | AWS_ACCESS_KEY | AWS user's access key | string |
    | AWS_ACCESS_KEY_SECRET | AWS user's access key secret | string |
    | KOPS_STATE_STORE_NAME | [Kops store](https://github.com/kubernetes/kops/blob/master/docs/state.md) name for cluster states. | string |
    | CLUSTER_NAME | Name of the cluster. | string |
    | CLUSTER_CONFIG_FILE | Name of cluster configuration file that was created in previous steps. | yaml |
    | ACTION | Pipeline action. Valid values are `deploy` or `teardown`. | string |
    | SSH_PUB_KEY | SSH public key required to pull repository. | multiline string ) |
    | IS_DRY_RUN | Check to run pipeline in dry run mode. Valid values are `true` or `false`. | string |

* Under Pipeline heading select `Pipeline script from SCM` under `definition` drop down. Then in `SCM` drop down select `Git`. Add Repository URL and credentials and specify branch.

* Specify the location of `Jenkinsfile` as well if you placed it in a nested folder. For this guide it should be `Jenkinsfile`.

* Add the manifest given below in the Jenkins file:
```groovy
#!/usr/bin/groovy
@Library('github.com/stakater/stakater-pipeline-library@v2.15.0')

String authMethodArn = "arn"
String authMethodAccessKey = "access_key"
String awsAuthMethod = ""

try {
    awsAuthMethod = AWS_AUTH_METHOD
} catch (Throwable e) {
    throw e
}

if ( ! (awsAuthMethod in [authMethodArn, authMethodAccessKey]) ) {
    error("AWS_AUTH_METHOD must either be 'arn' or 'access_key'")
}

String awsRoleArn = ""
try {
    awsRoleArn = AWS_ROLE_ARN
} catch (Throwable e) {
    throw e
}

if (awsRoleArn == "" && awsAuthMethod == authMethodArn) {
    error("AWS_ROLE_ARN must be specified when auth method is $authMethodArn") 
}

String awsAccessKeyId = ""
try {
    awsAccessKeyId = AWS_ACCESS_KEY
} catch (Throwable ignored) {
    awsAccessKeyId = ""
}

String awsSecretAccessKey = ""
try {
    awsSecretAccessKey = AWS_ACCESS_KEY_SECRET
} catch (Throwable ignored) {
    awsSecretAccessKey = ""
}

if ( (awsAccessKeyId == "" || awsSecretAccessKey == "") && awsAuthMethod == authMethodAccessKey ) {
    error("AWS_ACCESS_KEY and AWS_ACCESS_KEY_SECRET must be specified when auth method is $authMethodAccessKey") 
}

String kopsStateStore = ""
try {
    kopsStateStore = KOPS_STATE_STORE_NAME
} catch (Throwable e) {
    throw e
}

if (kopsStateStore == "") {
    error("KOPS_STATE_STORE_NAME must be specified") 
}

String clusterName = ""
try {
    clusterName = CLUSTER_NAME
} catch (Throwable e) {
    throw e
}

if (CLUSTER_NAME == "") {
    error("CLUSTER_NAME must be specified") 
}

String clusterConfigFile = ""
try {
clusterConfigFile = CLUSTER_CONFIG_FILE
} catch(Throwable ignored) {
clusterConfigFile = "cluster.yaml"
}

String action = ""
try {
    action = ACTION
} catch (Throwable ignored) {
    action = "deploy"
}

String sshPubKey = ""
try {
    sshPubKey = SSH_PUB_KEY
} catch (Throwable ignored) {
    sshPubKey = ""
}

Boolean isDryRun = true
try {
    isDryRun = IS_DRY_RUN == "true" ? true : false
} catch (Throwable e) {
    error("IS_DRY_RUN must be specified either true or false")
}

numberOfNodesIncludingMaster="7"
MOUNT_PATH = '/home/jenkins/.ssh'
awsSudoCommand = ""
if (awsAuthMethod == authMethodArn) {
    awsSudoCommand = "awssudo -u ${awsRoleArn}"
}

dryRunFlag = isDryRun ? "" : "--yes"

    clientsK8sNode(clientsImage: 'stakater/pipeline-tools:v2.0.4') {

        def amazon = new io.stakater.cloud.Amazon()
        def common = new io.stakater.Common()

        stage('Checkout Code') {

            checkout scm
            sh """
                mkdir -p ${MOUNT_PATH}
                echo "${sshPubKey}" > ${MOUNT_PATH}/stakater_id_rsa.pub
            """
        }

        container('clients') {
            if (awsAuthMethod == authMethodAccessKey) {
                amazon.persistAwsKeys(awsAccessKeyId, awsSecretAccessKey)
            }

            if (action.equals('deploy')) {

                stage('Configure Cluster') {
                    sh """
                        ${awsSudoCommand} kops replace -f cluster.yaml --name ${clusterName} --state ${kopsStateStore} --force
                        ${awsSudoCommand} kops create secret --name ${clusterName} --state ${kopsStateStore} sshpublickey admin -i ${MOUNT_PATH}/stakater_id_rsa.pub
                    """
                }

                stage('Create Cluster') {
                    sh """
                        ${awsSudoCommand} kops update cluster ${clusterName} --state ${kopsStateStore} ${dryRunFlag}
                    """
                    sh """
                        ${awsSudoCommand} kops export kubecfg --name ${clusterName} --state ${kopsStateStore}
                    """
                }

                stage('Verify Cluster') {
                    if (!isDryRun) {
                        String count = "0"
                        int tryLimit=100
                        while ((! count.equals(numberOfNodesIncludingMaster)) && tryLimit > 0) {
                            count = common.shOutput """
                                ${awsSudoCommand} kops validate --state ${kopsStateStore} cluster ${clusterName} | grep "True" | wc -l
                            """
                            sh "echo 'Sleeping for 15 seconds ...' && sleep 15s"
                            println "Try Limits remaining:" + tryLimit--
                        }
                    }
                }

                stage('Rolling Upgrade Cluster') {
                    sh """
                        ${awsSudoCommand} kops rolling-update cluster --name ${clusterName} --state ${kopsStateStore} ${dryRunFlag}
                    """

                    if (!isDryRun) {
                        sh """
                            echo '***************KUBE CONFIG**************'
                            echo ''
                            cat \${HOME}.kube/config
                            echo ''
                            echo '"*****************************************"'
                        """
                    }
                }
            } else if (action.equals('teardown')) {

                stage('Cluster Teardown') {
                    sh """ 
                        ${awsSudoCommand} kops delete cluster --name ${clusterName} --state ${kopsStateStore} ${dryRunFlag}
                    """                    
                }
            }
        }
    }
```

* Project should have the following structure:

  ```bash
  .
  ├── cluster.yaml
  ├── Jenkinsfile
  ```

##### By Using Gitlab CI/CD Pipeline
    
* Create a repository on Gitlab and configure its CI/CD pipeline following this [guideline](/content/processes/bootstrapping/gitlab-pipeline-configuration.md).

* Configure these environment variables:

    | Environment Variable | Description | Type |
    |---|---|---|
    | AWS_ACCESS_KEY | AWS user's access key | string |
    | AWS_ACCESS_KEY_SECRET | AWS user's access key secret | string |
    | KOPS_STATE_STORE_NAME | [Kops store](https://github.com/kubernetes/kops/blob/master/docs/state.md) name for cluster states. | string |
    | CLUSTER_NAME | Name of the cluster. | string |
    | ACTION | Pipeline action. Valid values are `deploy` or `teardown`. | string |
    | SSH_PUB_KEY | SSH public key required to pull repository. | multiline string ) |
    | IS_DRY_RUN | Check to run pipeline in dry run mode. Valid values are `true` or `false`. | string |
    | REGION | Region to create the cluster | string |
    | NO_OF_CLUSTER_NODES | Number of nodes in cluster | number |

* Project should have the following structure:
    ```bash
    .
    ├── cluster.yaml
    ├── .gitlab-ci.yml
    ```

* Add the terraform manifest folder in the repository and insert the following content in `.gitlab-ci.yml` file.

```yaml
image:
name: stakater/pipeline-tools:v2.0.5
entrypoint: ["/bin/bash", "-c"]

before_script:

    # displaying current configuration
- echo $AWS_ACCESS_KEY
- echo $AWS_ACCESS_KEY_SECRET
- echo $KOPS_STATE_STORE_NAME
- echo $CLUSTER_NAME
- echo $ACTION
- echo $IS_DRY_RUN
- echo $REGION
- echo $SSH_PUB_KEY
- echo $NO_OF_CLUSTER_NODES

    # check to decide either run the pipeline in dry run mode or run actual pipeline
- if [ $IS_DRY_RUN == "true" ]; then \
-     export DRY_RUN=""; \
- else \
-     export DRY_RUN="--yes"; \
- fi

stages:
- deploy

deploy:
stage: deploy
script:
    
    # configuring SSH_PUBLIC_KEY
    - mkdir -p ~/.ssh/
    - echo $SSH_PUB_KEY | base64 -d > $HOME/.ssh/id_rsa_stakater.pub

    # persisting AWS keys
    - mkdir -p $HOME/.aws/

    - printf "[default]\naws_access_key_id = $AWS_ACCESS_KEY\naws_secret_access_key = $AWS_ACCESS_KEY_SECRET" > $HOME/.aws/credentials
    - printf "[default]\nregion = $REGION" > $HOME/.aws/config

    # execute deploy action
    - if [ $ACTION == "deploy" ]; then \
    -        echo "Deploy"; \

            # configuring cluster
    -        kops replace -f cluster-manifests/cluster.yaml --name $CLUSTER_NAME --state $KOPS_STATE_STORE_NAME --force; \
    -        kops create secret --name $CLUSTER_NAME --state $KOPS_STATE_STORE_NAME sshpublickey admin -i ~/.ssh/id_rsa_stakater.pub; \

    #        # create cluster
    -        echo "Creating cluster"; \
    -        kops update cluster $CLUSTER_NAME --state $KOPS_STATE_STORE_NAME $DRY_RUN; \
    -        kops export kubecfg --name $CLUSTER_NAME --state $KOPS_STATE_STORE_NAME; \

    -        if [ $IS_DRY_RUN != "true" ]; then \
    -                echo "Verying cluster creation"; \
    -                count=0; \
    -                tryLimit=100; \
    -                tryCount=0; \
    -                nodeCount=$NO_OF_CLUSTER_NODES; \
                    # loop to validate nodes are created
    -                while [ $tryCount -lt $tryLimit ] && [ $count -lt $nodeCount ]; do \

                            # storing the result of command to check whether command contains True or not
    -                        count="$(kops validate cluster $CLUSTER_NAME --state $KOPS_STATE_STORE_NAME | grep -o 'True' | wc -l)"; \

    -                        echo 'Sleeping for 15 seconds ...' && sleep 15s; \
    -                        echo "Number of try:" + $tryCount; \

    -                        tryCount=$((tryCount + 1)); \
    -                done
    -        fi
            # rolling update cluster
    -        kops rolling-update cluster --name $CLUSTER_NAME --state $KOPS_STATE_STORE_NAME $DRY_RUN; \
    -        cat /opt/app/.kube/config

    # execute teardown action
    - elif [ $ACTION == "teardown" ]; then \

    -         echo "Teardown"; \
    -         kops delete cluster --name $CLUSTER_NAME --state $KOPS_STATE_STORE_NAME $DRY_RUN; \

    - else \
    -     echo "Invalid action provided"; \
    -     exit 1; \
    - fi

```