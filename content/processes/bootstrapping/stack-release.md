# Stack: Release

## Overview
This document provides guidelines about the configuration required to deploy Release stack on the kubernetes cluster.

## Details
Release Stack details can found on this [link](/content/tools/release/chartmuseum/developer-documentation.html).

## Configuration

This section provides high level overview of configuration: 

* Release stack [repository](https://github.com/stakater/StakaterKubeHelmRelease) resides on Github.

* Release stack can be deployed by Jenkins but in a new deployment when jenkins is not available, we need some online service like Bitbucket or Gitlab CI/CD pipeline. Currently, we are only supporting Gitlab.

## Deployment

Details about Release Stack deployment are provided on this [guide](/content/processes/bootstrapping/deploying-stakater-stacks.html).


