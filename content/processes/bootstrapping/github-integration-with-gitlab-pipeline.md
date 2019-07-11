# Github Repository Integration with Gitlab CI/CD Pipeline

## Overview

This guide provides guideline on how to configure Github repository with Gitlab CI/CD pipeline.


## Configuration

This section provides guideline regrading integration:

* Make sure that Gitlab account user must have the access to Github repositories.

* Create a new project in Gitlab.

* Select `CI/CD for external repo` from `New Project` dashboard.

* It provides further two options on how connect the new project with remote repository:

  1. Github.

  2. git Repo by URL.

* Select the `Github` option, it will show list of repositories. Select any one repository to configure its pipeline. Gitlab with sync the project.

* Gitlab provides following feature for synced project:

  * Import the project.
  * Enable [Pull Mirroring](https://docs.gitlab.com/ee/workflow/repository_mirroring.html#pulling-from-a-remote-repository-starter).
  * Enable [GitHub project integration](https://docs.gitlab.com/ee/user/project/integrations/github.html).
  * Create a web hook on GitHub to notify GitLab of new commits.




  

 


