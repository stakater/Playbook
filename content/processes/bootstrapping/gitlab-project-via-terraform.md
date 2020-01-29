# Setup gitlab project via terraform

[[toc]]

So you have created a new Gitlab account, and now you want to create a group and a couple of projects. We will use terraform to setup everything from scratch

## Why terraform

Terraform enables us to safely create, change, and improve infrastructure as code. We can get the following benefits by using Terraform 

  1. We can manage everething via code, and can save ourself from manual configurations
  2. We can use code to create our groups, and projects
  3. We can use code to manage users, and their access for our groups and projects
  4. We can add webhooks for our projects easily and can keep track of them via code which is much simpler than manual management
  5. We can easily re-create our infrastructure if let's say we want to move everything to a new group etc

## Getting started

We need to follow the following steps to setup our infrastructure via terraform

## Create a Group

First of all create a manual group from UI for setting up our terraform repo. Let's call this group `carbook-bootstraper`.

## Create a Project

Now create a project manually from UI which will contain all our required terraform code. Let's call this project `carbook-gitlab-config`

## Adding terraform scripts

Now clone the manually created project `carbook-gitlab-config`. We need to add 3 things to this project

  1. Terraform script for creating our group
  2. Terraform script for creating project
  3. A Jenkinsfile for creating infrastructure, and pipelines

Let's start by adding a terraform script for creating our group

## Terraform script for creating our group

Inside our project `carbook-gitlab-config` create a new file let's say `carbook-group.tf`. This file will be responsible for creating `carbook` group, and managing users, and their access. Following is an example file:

```
module "group_carbook" {
  source = "github.com/stakater/terraform-module-gitlab.git//modules/group?ref=0.0.1"
  name = "carbook"
  path = "carbook"
  description = "My group description"
  visibility = "private"
  users = [
    {
      user_id = gitlab-user-id
      access_level = "owner"
    },    
    {
      user_id = gitlab-user-id
      access_level = "master"
    },
    {
      user_id = gitlab-user-id
      access_level = "developer"
    },
    {
      user_id = gitlab-user-id
      access_level = "developer"
    }
  ]
}
```

In the above file we are specifying our group `name`, `path`, `access-level`, and a set of users which have access to this group. We can add as many users as we want, and can assign them a specific access level.

## Terraform script for creating project

Let's create a new file now `project-search-service.tf`. This file will be responsible for creating a new project `search-service` inside the above created group. Following is an example file: 

```
module "project_search_service" {
  source = "github.com/stakater/terraform-module-gitlab.git//modules/project?ref=0.0.5"
  name = "search-service"
  visibility = "private"
  enable_branch_protection = true
  description = "My project description"
  group_id = "${module.group_carbook.group_id}"
  default_branch = "master"
  webhooks = [
    {
      url = "webhook-url",
      merge_requests_events = true
    },
    {
      url = "webhook-url",
      push_events = true
    } 
  ]
}
```

This file will create the project `search-service` in our group `carbook`. We can change all the above properties, add or remove webhooks etc according to our requirements, and create multiple project files.

## A Jenkinsfile for creating infrastructure, and pipelines

Let's now add a Jenkinsfile which will create our infrastructure including pipelines for all the projects file. Create a new file in project `carbook-gitlab-config` with name `Jenkinsfile`, and add the following content: 

```
#!/usr/bin/groovy
@Library('github.com/stakater/fabric8-pipeline-library@v2.11.0') _

setupGitlabProject {
    gitUserName = 'git-username'
    gitEmail = 'git-email'
    jobFolderName = 'carbook'
    jobFolderDisplayName = 'carbook'
    jobFolderDescription = 'Folder for projects in CarBook Group'
    tfFilesPrefix = 'project-'
}
```

The method `setupGitlabProject` was added in pipeline library version `2.11.0`, so make sure not to use an older version.

The following parameters are used in `setupGitlabProject` 

    * gitUserName = Your GIT Username

    * gitEmail = Your GIT Email
    
    * jobFolderName = Name of the folder which will contain all pipelines of terraform projects specified in `carbook-gitlab-config` 
    
    * jobFolderDisplayName = Name of the folder visible in Jenkins which will contain all pipelines of terraform projects specified in `carbook-gitlab-config` 
    
    * jobFolderDescription = Description of the folder visible in Jenkins which will contain all pipelines of terraform projects specified in `carbook-gitlab-config` 
    
    * tfFilesPrefix = Prefix of all the terraform files present in `carbook-gitlab-config` group responsible for creating new projects in `carbook` group. Note that the group terraform file in `carbook-gitlab-config` should not follow this prefix. 

## Creating a manual pipeline for terraform project

Now we need to create a pipline for `carbook-gitlab-config` which will use the Jenkinsfile we created above. As the pipeline will run our new group, users, and projects will be created. Also a new folder in our Jenkins with all the pipelines for projects will also be created. For setting up Gitlab pipeline in Jenkins see [Gitlab Configuration](https://playbook.stakater.com/content/tools/release/jenkins/developer-documentation.html#gitlab-configurations)