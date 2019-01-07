# Hard coded values

This document contains the hard coded values for Cerebro, and its dependencies. 

# Char Info
```
name: cerebro
version: 0.5.1
repository: https://stakater.github.io/stakater-charts
alias: cerebro
```

# Hard coded values
```
config:
   secret: "ki:s:[[@=Ag?QIW2jMwkY:eqvrJ]JqoJyi2axj3ZvOv^/KavOT4ViJSv?6YY4[N"
   hosts:
     - host: "http://elasticsearch-stakater-logging-cluster.logging:9200"
       name: "elasticsearch-stakater-logging-cluster"

 deployment:
   annotations:
     authproxy.stakater.com/image-name: quay.io/gambol99/keycloak-proxy
     authproxy.stakater.com/image-tag: v2.1.1
     authproxy.stakater.com/enabled: "true"
     authproxy.stakater.com/upstream-url: "http://127.0.0.1:9000"
     authproxy.stakater.com/source-service-name: stakater-logging-cerebro
     authproxy.stakater.com/redirection-url: "https://cerebro.logging.stakater.com"
     authproxy.stakater.com/listen: "0.0.0.0:80"

 service:
   annotations:
     config.xposer.stakater.com/Domain: stakater.com
     config.xposer.stakater.com/IngressNameTemplate: '{{.Service}}-{{.Namespace}}'
     config.xposer.stakater.com/IngressURLTemplate: 'cerebro.{{.Namespace}}.{{.Domain}}'
     xposer.stakater.com/annotations: |-
       kubernetes.io/ingress.class: internal-ingress
       ingress.kubernetes.io/force-ssl-redirect: true
       forecastle.stakater.com/expose: true
       forecastle.stakater.com/icon: https://raw.githubusercontent.com/stakater/ForecastleIcons/master/cerebro.png
       forecastle.stakater.com/appName: Cerebro
```