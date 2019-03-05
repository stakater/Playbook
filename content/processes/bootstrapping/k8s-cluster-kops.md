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
