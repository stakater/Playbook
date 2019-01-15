# Installation and Dependencies of Elasticsearch-Curator

## Installation Steps

Most of the times elasticsearch-curator will be deployed from pipeline of [this](https://github.com/stakater/stakaterkubehelmLogging) repository. It will have updated configurations and dependencies for elasticsearch-curator. But we can also install it manually (not recommended). To install elasticsearch-curator manually, clone [this](https://github.com/stakater/stakaterkubehelmLogging) repo and you can run the make targets of repo containing latest used implementation of elasticsearch-curator. This will install all dependencies and elasticsearch-curator as well.

1. Clone `https://github.com/stakater/stakaterkubehelmLogging` repository
2. Update the hardcoded values mentioned [here](#Hard-coded-values)
3. Run this command. `make install CHART_NAME=logging`

## Dependencies

Elasticsearch-curator requires an elasticsearch instance to manage its indices

## Char Info

```yaml
name: elasticsearch-curator
version: 1.0.1
repository: https://kubernetes-charts.storage.googleapis.com
alias: elasticsearch-curator
```

## Hard-coded-values

This document contains the hard coded values for elasticsearch curator, and its dependencies.

```yaml
cronjob:
   # At 00:00 every day
   schedule: "0 0 * * *"
 config:
   elasticsearch:
     hosts:
       - elasticsearch-stakater-logging-cluster.logging
     port: 9200
 configMaps:
   action_file_yml: |-
     ---
     actions:
       1:
         action: delete_indices
         description: "Clean up ES by deleting old indices"
         options:
           timeout_override:
           continue_if_exception: False
           disable_action: False
           ignore_empty_list: True
         filters:
         - filtertype: age
           source: name
           direction: older
           timestring: '%Y.%m.%d'
           unit: days
           unit_count: 2
           field:
           stats_result:
           epoch:
           exclude: False
```