# Prometheus in openshift

To create prometheus in openshift, Create a file named prometheus.yaml with the following content

```yaml
apiVersion: monitoring.coreos.com/v1
kind: Prometheus
metadata:
  labels:
    prometheus: k8s
  name: prometheus-dev
  namespace: {NAMESPACE}
spec:
  alerting:
    alertmanagers:
      - name: alertmanager-operated
        namespace: {NAMESPACE}
        port: web
  replicas: 1
  ruleSelector:
    matchLabels:
      prometheus: k8s
      role: prometheus-rulefiles
  securityContext: {}
  serviceAccountName: prometheus-k8s
  serviceMonitorNamespaceSelector:
    any: true
  serviceMonitorSelector:
    matchLabels:
      app: "common-service"
  version: v2.3.2
---
apiVersion: route.openshift.io/v1
kind: Route
metadata:
  name: prometheus-operated
  namespace: {NAMESPACE}
spec:
  port:
    targetPort: web
  tls:
    insecureEdgeTerminationPolicy: Redirect
    termination: edge
  to:
    kind: Service
    name: prometheus-operated
    weight: 100
  wildcardPolicy: None
```

Replace `{NAMESPACE}` with the name of namespace in which you want prometheus to be deployed. It will try to connect with alert manager service `alertmanager-operated` on port `web`.