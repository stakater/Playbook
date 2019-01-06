# Hard coded values

This document contains the hard coded values for Logrotate, and its dependencies. 

# Char Info
```
name: logrotate
version: 1.0.0
repository: https://stakater.github.io/stakater-charts
alias: logrotate
```

# Hard coded values
```
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