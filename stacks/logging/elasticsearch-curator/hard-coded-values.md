# Hard coded values

This document contains the hard coded values for elasticsearch curator, and its dependencies. 

# Char Info
```
name: elasticsearch-curator
version: 1.0.1
repository: https://kubernetes-charts.storage.googleapis.com
alias: elasticsearch-curator
```

# Hard coded values
```
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