# Setup gitlab project via terraform

## Workflow

Let's suppose we want to create a group `carbook`, which will contain all our required projects. We need to create a manual group e.g `gitlab-bootstraper`, and inside it a manual project e.g `carbook-gitlab-config`. The manual project `carbook-gitlab-config` will be responsible for creating the group `carbook` and all the neeed projects via terraform. To add more projects in `carbook` group one should add terraform files in `carbook-gitlab-config`. `gitlab-bootstrap` group will be managed manually i.e, adding/udpating access of different users

## Configuration

Continuing the previous example, we need to first add `group.tf` file in our project `carbook-gitlab-config`. A sample `group.tf` can be like this:

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

Next we have to add our projects via terraform. A sample project terraform file can be like this: 

```
module "project_carbook_project_1" {
  source = "github.com/stakater/terraform-module-gitlab.git//modules/project?ref=0.0.5"
  name = "carbook-project-1"
  visibility = "private"
  enable_branch_protection = true
  description = "My project description"
  group_id = "${module.group_carbook.group_id}"
  default_branch = "master"
}
```

In this way we can add as much project files we want, and they will be added in our group `carbook`.

## Setting up Jenkins file

In `carbook-gitlab-config` we can add the following Jenkins file to create pipelines of all the projects we created via terraform in `carbook` group. 

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