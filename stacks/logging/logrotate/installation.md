# Installation and Dependencies of Cerebro

## Installation Steps

Most of the times logrotate will be deployed from pipeline of [this](https://github.com/stakater/stakaterkubehelmLogging) repository. It will have updated configurations and dependencies for logrotate. But we can also install it manually (not recommended). To install logrotate manually, clone `https://github.com/stakater/stakaterkubehelmLogging` repo and you can run the make targets of repository containing latest used implementation of logrotate. This will install all dependencies and logrotate as well.

1. Clone `https://github.com/stakater/stakaterkubehelmLogging` repository
2. Update the hard coded values mentioned [here](#Hard-coded-values)
3. Run this command. `make install CHART_NAME=logging`

## Dependencies

Logrotate doesn’t require any dependency to run

## Char Info

```yaml
name: logrotate
version: 1.0.0
repository: https://stakater.github.io/stakater-charts
alias: logrotate
```

## Hard-coded-values

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