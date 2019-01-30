# Logrotate

## Introduction

The logrotate utility is designed to simplify the administration of log files on a system which generates a lot of log files. Logrotate allows for the automatic rotation compression, removal and mailing of log files. Logrotate can be set to handle a log file daily, weekly, monthly or when the log file gets to a certain size.

### Chart

Right now no public helm chart of logrotate exist, so we have created a PR for that. Till then we are using public chart from stakater-charts, with version `1.0.0` in our cluster. We use umbrella charts to deploy logrotate on our cluster. Currently we are using [this](https://github.com/stakater/stakaterkubelogging) repository for elasticsearch deployment

### Image

Currently we are using this `stakater/logrotate:3.13.0` stakater public image for logrotate in stakater. There is no official public image available for logrotate, that's why we have created our own logrotate public image.

### Cherry Pickable

Yes

### Single Sign-on

Not applicable

## Installation

### Installation Steps

Most of the times logrotate will be deployed from pipeline of [this](https://github.com/stakater/stakaterkubehelmLogging) repository. It will have updated configurations and dependencies for logrotate. But we can also install it manually (not recommended). To install logrotate manually, clone `https://github.com/stakater/stakaterkubehelmLogging` repo and you can run the make targets of repository containing latest used implementation of logrotate. This will install all dependencies and logrotate as well.

1. Clone `https://github.com/stakater/stakaterkubehelmLogging` repository
2. Update the hard coded values mentioned [here](#Hard-coded-values)
3. Run this command. `make install CHART_NAME=logging`

### Dependencies

Logrotate doesn’t require any dependency to run

### Char Info

```yaml
name: logrotate
version: 1.0.0
repository: https://stakater.github.io/stakater-charts
alias: logrotate
```

### Hard-coded-values

This document contains the hard coded values for Logrotate, and its dependencies. 

```yaml
environment:
  cronSchedule: 0 */12 * * *

config:
   k8sRotatorConf: |-
     /var/lib/docker/containers/*/*.log {
         rotate 5
         copytruncate
         missingok
         notifempty
         compress
         maxsize 200M
         daily
         create 0644 root root
     }
```