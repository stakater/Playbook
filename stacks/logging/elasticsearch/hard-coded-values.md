# Hard coded values

This document contains the hard coded values for elasticsearch, and its dependencies. 

# Char Info
```
name: elasticsearch
version: 0.1.5
Repository: https://raw.githubusercontent.com/upmc-enterprises/elasticsearch-operator/master/charts
alias: elasticsearch
```

# Hard coded values
```
 clientReplicas: 1
 masterReplicas: 1
 dataReplicas: 3
 dataVolumeSize: 20Gi
 javaOpts: "-Xms1024m -Xmx1024m"
 zones:
 - eu-west-1a
 - eu-west-1b
 - eu-west-1c
 resources:
   requests:
     memory: 1024Mi
     cpu: 500m
   limits:
     memory: 1536Mi
     cpu: '1'
```