# Bootstrapping & managing kubernetes cluster with kops

This guide is for managing k8s cluster on AWS with kops

To figure out:

Q1: How to create the S3 bucket to store terraform state?
Q2: How to create Jenkins job for `{git-provider}-as-code` repo? And configure webhook?
Q3: How to securely manage the ssh private key for the bastian host?

## Step 1: Create a repo to hold git provider config

We manage git state with code as well which we call e.g. `github-as-code`

- Recommended naming convention: `{project-name|company-name}-{git-provider}-config` e.g. `stakater-github-config`

This is the only repo which is created manually; and all other repo's will be created automatically.

## Step 2: Create a git repo for terraform for cluster

To manage the infrastructure components needed by kops; we use terraform. kops need both S3 bucket and hosted zone

- Recommended naming convention: ?
- Ensure the Jenkins job is in place
- Ensure webhook is in place

## Step 3: Create S3 bucket

Add terraform config to above repo

- Recommended naming convention:  
- use this terraform

_Note:_ The pipeline should create it

## Step 4: Create Route53 hosted zone 

Add terraform config to above repo

- Recommended naming convention:  
- use this terraform

_Note:_ The pipeline should create it

Create a Jenkins job to run terraform

- Add webhook

You need both s3 bucket and hosted zone before continuing to next step.

## Step 5: Create a git repo for kops cluster config

First add git repo by adding it to `stakater-github-config` which should create Jenkins job and configure webhook

Follow this naming convention:

- Create `Jenkinsfile`
- Create `cluster.template.yaml` file
- 

```
jobdsl.json
{
    "ACTION": {
      "type": "choice",
      "options": ["VALIDATE","UPDATE","CREATE","DELETE"],
      "description": "Please choose action to perform"
    },
    "DEPLOY": {
      "type": "boolean",
      "default": "false",
      "description": "If checked it will apply changes; otherwise DRY-RUN only"
    }
}
```

Create a Jenkins job to manage the cluster

- Add webhook

## Step 6: Fork kops util scripts repo

Next > Configure secure access to the cluster!