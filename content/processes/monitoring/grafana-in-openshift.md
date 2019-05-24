# Deploying grafana in openshift

To deploy grafana in openshift using helm, just use the following grafana values in a file e.g `grafana-values.yaml`

```yaml
sidecar:
  dashboards:
    enabled: true
adminPassword: "adminPassword"
rbac:
  create: true
  pspEnabled: false
  # it will
  namespaced: true
securityContext:
  runAsUser: 1000260001
  fsGroup:
  runAsNonRoot: true
datasources:
  datasources.yaml:
    apiVersion: 1
    datasources:
    - name: Prometheus
      type: prometheus
      url: http://prometheus-operated:9090
      access: proxy
      isDefault: true
```

After replacing, the prometheus URL and your custom password in the `grafana-values.yaml`, run

```bash
RELEASE="grafana"
NAMESPACE="monitoring"

helm upgrade --install $RELEASE --namespace $NAMESPACE stable/grafana -f grafana-values.yaml --force
```

Helm chart cannot create the route at the moment so if needed you can create it by saving the following manifest in a file named `route.yaml`.

```yaml
apiVersion: route.openshift.io/v1
kind: Route
metadata:
  labels:
    app: grafana
    chart: grafana-3.3.8
    heritage: Tiller
  name: grafana
  namespace: {NAMESPACE}
spec:
  port:
    targetPort: service
  tls:
    insecureEdgeTerminationPolicy: Redirect
    termination: edge
  to:
    kind: Service
    name: {GRAFANA_SERVICE}
    weight: 100
  wildcardPolicy: None
```

Replace `NAMESPACE` and `GRAFANA_SERVICE` (the name of grafana helm release) with correct values and then run

```bash
oc apply -f route.yaml
```