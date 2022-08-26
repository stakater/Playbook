# TLS using Cert-Manager


Use the following guide to use cert-manager for valid SSL certificates for your application:

[Cert-Manager Quick Guide](https://cert-manager.readthedocs.io/en/latest/tutorials/acme/quick-start/index.html)

## Differences from Guide (for Stakater)

* Use `ClusterIssuer` instead of `Issuer` in `staging-issuer.yaml` and `prod-issuer.yaml`

* Above guide creates separate Ingresses and then add annotations on Ingress resources but in Stakater Ingresses are created automatically by Xposer. So these annotations should be passed in the Xposer annotations in service yaml. e.g. below is a sample yaml for Kibana dashboard service. (Note the `certmanager.k8s.io` annotations)

```
apiVersion: flux.weave.works/v1beta1
kind: HelmRelease
metadata:
  name: stakater-logging-kibana
  namespace: logging
spec:
  releaseName: stakater-logging-kibana
  chart:
    repository: https://kubernetes-charts.storage.googleapis.com
    name: kibana
    version: 1.1.1
  values:
    image:
      tag: "6.2.4"
    files:
      kibana.yml:
        server.name: kibana
        server.host: "0"
        server.port: 5601
        elasticsearch.url: "http://elasticsearch-stakater-logging-cluster.logging:9200"
    service:
      externalPort: 80
      annotations:
        config.xposer.stakater.com/Domain: workshop.stakater.com
        config.xposer.stakater.com/IngressNameTemplate: '{{.Service}}-{{.Namespace}}'
        config.xposer.stakater.com/IngressURLTemplate: 'kibana-{{.Namespace}}.{{.Domain}}'
        config.xposer.stakater.com/TLS: "true"
        xposer.stakater.com/annotations: |-
          certmanager.k8s.io/cluster-issuer: letsencrypt-prod
          certmanager.k8s.io/acme-challenge-type: http01
          kubernetes.io/ingress.class: internal-ingress
          ingress.kubernetes.io/rewrite-target: /
          ingress.kubernetes.io/force-ssl-redirect: false
          forecastle.stakater.com/expose: true
          forecastle.stakater.com/icon: https://github.com/stakater/ForecastleIcons/raw/master/kibana.png
          forecastle.stakater.com/appName: Kibana
```