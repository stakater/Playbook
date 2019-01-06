# Hard coded values

This document contains the hard coded values for Kibana, and its dependencies. 

# Char Info
```
name: kibana
version: 1.1.1
repository: https://kubernetes-charts.storage.googleapis.com
alias: kibana
```

# Hard coded values
```
files:
   kibana.yml:
     server.name: kibana
     server.host: "0"
     server.port: 5601
     elasticsearch.url: http://elasticsearch-stakater-logging-cluster.logging:9200

 deployment:
   annotations:
     authproxy.stakater.com/image-name: quay.io/gambol99/keycloak-proxy
     authproxy.stakater.com/image-tag: v2.1.1
     authproxy.stakater.com/enabled: "true"
     authproxy.stakater.com/upstream-url: "http://127.0.0.1:5601"
     authproxy.stakater.com/source-service-name: stakater-logging-kibana
     authproxy.stakater.com/redirection-url: "https://kibana.logging.stakater.com"
     authproxy.stakater.com/listen: "0.0.0.0:80"

 service:
   externalPort: 80
   annotations:
     config.xposer.stakater.com/Domain: stakater.com
     config.xposer.stakater.com/IngressNameTemplate: '{{.Service}}-{{.Namespace}}'
     config.xposer.stakater.com/IngressURLTemplate: 'kibana.{{.Namespace}}.{{.Domain}}'
     xposer.stakater.com/annotations: |-
       kubernetes.io/ingress.class: internal-ingress
       ingress.kubernetes.io/rewrite-target: /
       ingress.kubernetes.io/force-ssl-redirect: true
       forecastle.stakater.com/expose: true
```