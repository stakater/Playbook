# Bootstrapping & managing kubernetes cluster with kops

This guide is for managing k8s cluster on AWS with kops

## Prerequisites

- An account on github (or your preferred git provider) which has the ability to create private repositories. This is needed because terraform state gets pushed to the repository and it should be kept private
- An organization on your preferred git provider. In this guide, we will consider `stackator` as the organization name.
- A jenkins server which is configured with the above git account.

## Step 1: Create a repo to hold git provider config

We manage git state with code as well which we call e.g. `github-as-code`
This is the only repo which is created manually; and all other repo's will be created automatically.
To create and configure this repo, follow the following steps.

- Choose an appropriate Repository name. Recommended naming convention is `{project-name|company-name}-{git-provider}-config` e.g. `stackator-github-config`
- Go to github (or your preferred git provider) and create a private repository with the decided name.
- Add `.gitignore` file with following content

    ```bash
    # Compiled files
    terraform.tfvars
    *.backup
    .terraform
    *.sh
    ```

- Create `Jeknisfile` with following content

    ```bash
    #!/usr/bin/groovy
    @Library('github.com/stakater/stakater-pipeline-library@v2.13.0')

    def dummy

    terraformValidateAndApply {
  
    }
    ```

- Create `main.tf` file with following content

    ```terraform
    provider "github" {
        organization = "${var.github_organization}"
        version = "1.2.1"
    }

    terraform {
        required_version = ">= 0.11.8"
    }
    ```

    If you are using a service other than github as your git provider then explore terraform and use correct provider.

- Create `variables.tf` file with following content

    ```terraform
    variable "github_organization" {
        default = "stackator"
    }
    ```

    You should replace `stackator` with your organization name on github (or your preferred git provider).

## Step 2: Create Pipeline to automatically create github repositories

Create a new pipeline in the Jenkins server. Give it an appropriate name e.g `stackator-github-config`. Configure the pipeline type e.g `multibranch`, git credentials, project and the repository name. Specify the build configuration to `by Jenkinsfile` and specify the path of Jenkinsfile which is `Jenkinsfile`.

## Step 3: Configure a git repo for creating cluster using terraform

To manage the infrastructure components needed by kops; we use terraform. Let's create a github repo using terraform to contain all this terraform code.

To create the repo, follow these steps.

- Create a file named `repo-stackator-aws-config.tf` with the following content.

    ```terraform
    module "stackator-aws-config" {
        source         = "github.com/stakater/terraform-module-github.git//modules/repository?ref=1.0.9"
        name           = "stackator-aws-config"
        require_status_checks = true
        enable_branch_protection = true
        enforce_admins = false
        private = true
        description = "Jenkins pipeline to deploy, teardown and upgrade AWS resources"
        topics = ["stakater", "kops", "kubernetes"]
        webhooks = [
            {
            url = "{YOUR_JENKINS_WEBHOOK_URL}",
            events = "push,pull_request"
            secret = "mySecret"
            }
        ]
    }
    ```

    Do replace `YOUR_JENKINS_WEBHOOK_URL` to enable automatic pipeline triggering. The webhooks block can also be removed in case you want to trigger pipelines manually.

- If your webhook works then the pipeline should get triggered automatically and create the repo in your organization.

- Create a role on AWS IAM that will be used to create resources on AWS using terraform. The role should have access to resources that you will be creating. General services allowed should be iam, cloudfront, s3, route53, ec2 etc. This role should be assumable from your jenkins server via trust relationship. Note down the arn of this role. It will be needed later on.
- In the newly created repo add the following files:
  - `.gitignore` with following content

    ```bash
    # Compiled files
    terraform.tfvars
    *.backup
    .terraform
    *.sh
    .idea
    ```

  - `Jenkinsfile` with following content

    ```bash
    #!/usr/bin/groovy
    @Library('github.com/stakater/stakater-pipeline-library@v2.13.0')

    def dummy

    terraformValidateAndApply {
  
    }
    ```

  - `main.tf` with following content

    ```terraform
    provider "aws" {
        region     = "eu-west-1"
        assume_role {
            role_arn = "{your_role_arn}"
        }
    }
    ```

This repo is now ready to manage all of your terraform related resources on AWS.

## Step 4: Create cluster using kops

### I) Create s3 bucket to store terraform state of kops cluster

To store the state of kops cluster, you need to create an s3 bucket that will store the state of resources created by kops. To create the s3 bucket, add a file by the name of `stackator-s3-kops-state.tf` with following content

```terraform
module "stackator_s3_kops_state" {
  source = "github.com/stakater/blueprint-storage-aws.git//modules/s3/private?ref=v3.0.0"
  name = "stackator-kops-state"  
}
```

### II) Create route 53 hosted zone to be used by kops

In order to build a Kubernetes cluster with `kops`, we need to prepare somewhere to build the required DNS records. In AWS, DNS records are managed by `Route53` hosted zones.
To create a simple Route53 hosted zone, let's create a file `route53-zone-stackator.tf` with following content

```terraform
module "stackator_route53_zone" {
  source = "github.com/stakater/blueprint-utilities-aws.git//modules/route53/public?ref=v0.3.0"
  public_domain = "${var.public_domain}"
  force_destroy = "${var.force_destroy}"
}
```

For different scenarios like assigning a sub domain hosted zone to kops etc, read the detailed `kops` documentation [here](https://github.com/kubernetes/kops/blob/master/docs/aws.md#configure-dns)

### III) Create a repo for kops cluster

Now lets create a new repo for kops cluster that will actually create the cluster. The naming convention should be `{repo-company|project-kops-cluster.tf}`

Create a file named `repo-stackator-aws-config.tf` with the following content.

```terraform
module "stackator-kops-cluster" {
    source         = "github.com/stakater/terraform-module-github.git//modules/repository?ref=1.0.9"
    name           = "stackator-aws-config"
    require_status_checks = true
    enable_branch_protection = true
    enforce_admins = false
    private = true
    description = "Jenkins pipeline to deploy, teardown and upgrade a kubernetes cluster via kops"
    topics = ["stakater", "kops", "kubernetes"]
}
```

It is better not to add a webhook to this repo since the pipeline should be built with parameters and hence the pipeline shouldn't get triggered automatically.

Once this repo is created, create the follwing lines in the created repo

- Create a file named `Jenkinsfile` with following content

    ```groovy
    #!/usr/bin/groovy
    @Library('github.com/stakater/stakater-pipeline-library@master')

    String auth_method_arn = "arn"
    String auth_method_access_key = "access_key"
    String aws_auth_method = ""

    try {
        aws_auth_method = AWS_AUTH_METHOD
    } catch (Throwable e) {
        throw e
    }

    if ( ! (aws_auth_method in [auth_method_arn, auth_method_access_key]) ) {
        error("AWS_AUTH_METHOD must either be 'arn' or 'access_key'")
    }

    String aws_role_arn = ""
    try {
        aws_role_arn = AWS_ROLE_ARN
    } catch (Throwable e) {
        throw e
    }

    if (aws_role_arn == "" && aws_auth_method == auth_method_arn) {
        error("AWS_ROLE_ARN must be specified when auth method is $auth_method_arn") 
    }

    String aws_access_key_id = ""
    try {
        aws_access_key_id = AWS_ACCESS_KEY
    } catch (Throwable ignored) {
        aws_access_key_id = ""
    }

    String aws_secret_access_key = ""
    try {
        aws_secret_access_key = AWS_ACCESS_KEY_SECRET
    } catch (Throwable ignored) {
        aws_secret_access_key = ""
    }

    if ( (aws_access_key_id == "" || aws_secret_access_key == "") && aws_auth_method == auth_method_access_key ) {
        error("AWS_ACCESS_KEY and AWS_ACCESS_KEY_SECRET must be specified when auth method is $auth_method_access_key")
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

    numberOfNodesIncludingMaster="4"
    MOUNT_PATH = '/home/jenkins/.ssh'
    awsSudoCommand = ""
    if (aws_auth_method == auth_method_arn) {
        awsSudoCommand = "awssudo -u ${aws_role_arn}"
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
                if (aws_auth_method == auth_method_access_key) {
                    amazon.persistAwsKeys(aws_access_key_id, aws_secret_access_key)
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
                        if (!isDryRun) {
                            sh """
                                ${awsSudoCommand} kops export kubecfg --name ${clusterName} --state ${kopsStateStore}
                            """
                        }

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

- Next use [stakater kops templates](https://github.com/stakater/kops-cluster-templates) to generate your own kops cluster template and copy it to this repo and name it `cluster.yaml`

### IV) Prepare IAM Role for cluster creation

We will need an aws role to create the cluster. The role should have administrator access i.e

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "Statement1",
            "Effect": "Allow",
            "Action": [
                "iam:*",
                "cloudfront:*",
                "s3:*",
                "route53:*",
                "ec2:*",
                "autoscaling:*"
            ],
            "Resource": "*"
        }
    ]
}
```

Now there are two ways to use this IAM role

1. Your jenkins should either be able to assume this role. For this edit trust relationship of this role and specify jenkins role there.
2. Create a programmatic access user and assign the above role/policy to that user. Note down the access key id and password and we will use it later on to access.

### V) Create a pipeline for kops cluster

In Jenkins create a simple pipeline that should execute the above Jenkinsfile. Follow these steps to configure the pipeline.I

- Under general heading select `This project is parameterized` option. Then add the following parameters

    |Key |Type|Default|Description|
    |----|----|-------|-----------|
    |CLUSTER_NAME|string||Name of the cluster e.g test.stackator.com|
    |KOPS_STATE_STORE_NAME|string||The name of s3 bucket e.g s3://stackator-kops-state|
    |CLUSTER_CONFIG_FILE|string|cluster.yaml|The kops config file i.e inside the `stackator-kops-cluster` repo|
    |AWS_AUTH_METHOD|string-options|arn|Auth method to use (either arn or access_key)|
    |AWS_ROLE_ARN|string||AWS Role ARN that should be assumed (must be specified if `AWS_AUTH_METHOD` is `arn`)|
    |AWS_ACCESS_KEY|string||Id of access key to use. (must be specified if `AWS_AUTH_METHOD` is `access_key`)|
    |AWS_ACCESS_KEY_SECRET|string||Secret of access key to use. (must be specified if `AWS_AUTH_METHOD` is `access_key`)|
    |SSH_PUB_KEY|string||Pub key to be used by kops for ssh|
    |ACTION|string-options|deploy|The action to perform (either deploy or teardown)
    |IS_DRY_RUN|Boolean|true|set to true to dry run or false to actually apply the change|

- Under Pipeline heading select `Pipeline script from SCM` under `definition` drop down. Then in `SCM` drop down select `Git`. Add Repository URL and credentials and specify branch.
- Specify the location of `Jenkinsfile` as well if you placed it in a nested folder. For this guide it should be `Jenkinsfile`.
