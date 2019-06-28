# Gitlab Pipeline Configuraton

## Overview

This guideline desribes how to configure pipeline on Gitlab.

## Details

This section provides details about the Gitlab pipeline.

* Gitlab pipeline by default uses shared runners. Shared Runners on GitLab run in autoscale mode and are powered by Google Cloud Platform. Autoscaling means reduced wait times to spin up builds, and isolated VMs for each project, thus maximizing security. They're free to use for public open source projects and limited to `2000 CI minutes` per month per group for private projects.

* Gitlab [runner](https://docs.gitlab.com/runner/) is a process that run jobs.

* Gitlab pipeline default timeout is `1 hour`, which is not efficient because if pipeline process gets stuck at some step then it will consume resources which is not good when resources are limited. So, it is a good practice to observe the time taken by pipeline and set an average timeout for pipeline execution.

* Gitlab provides CI/CD enviroment variables that can be used to pass some configuration to pipeline runner, that can be used for decision making during pipeline execution.

## Configuration

* Create a project on gitlab.

* If required setup CI/CD environment variables using the UI provided at `Project Setting -> CI/CD -> Variables`.

* Gitlab provides a feature to `mask` the CI/CD environment variable so that its value is not visible in pipeline execution logs. But the problem with this approach is that it requre varibles to be encoded in some format like base64 otherwise it will not mask it.

* Workaround of above issue is to redirect the command location to other location. Example is provided below:
  ```bash
  $ <command> > /dev/null
  ```

* Create a [`.gitlab-ci.yml`](https://docs.gitlab.com/ee/ci/yaml/) file in the project root directory that contains pipeline execution commands.