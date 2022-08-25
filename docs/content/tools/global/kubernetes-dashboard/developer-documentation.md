# Kubernetes Dashboard

## Introduction

[Kubernetes Dashboard](https://github.com/kubernetes/dashboard) is a general purpose, web-based UI for Kubernetes clusters. It allows users to manage applications running in the cluster and troubleshoot them, as well as manage the cluster itself

### Chart

We use public helm charts to deploy kubernetes-dashboard on our cluster. [Here](https://github.com/helm/charts/tree/master/stable/kubernetes-dashboard) is the public chart that we use and `0.10.2` is the public chart version that is used in our cluster. We use umbrella charts to deploy kubernetes-dashboard on our cluster. Currently we are using [this](https://github.com/stakater/StakaterKubeHelmGlobal) repository for kubernetes-dashboard deployment.

### Image

Currently we are using this `k8s.gcr.io/kubernetes-dashboard-amd64:v1.10.1` public image for dashboard in stakater.

### Cherry Pickable

Yes

### Single Sign-on

Yes. We use proxyinjector for achieving single sign on. Please refer to its documentation [here](https://playbook.stakater.com/content/tools/global/proxyinjector/developer-documentation.html)

## Installation

### Installation Steps

1. Dashboard can be deployed using pipeline of [this](https://github.com/stakater/stakaterkubehelmglobal) repository. We can also deploy this manually (not recommended) via console. To deploy it manually
    1. Download the chart
    ```bash
    helm repo add stable https://kubernetes-charts.storage.googleapis.com
    helm repo update
    helm fetch stable/kubernetes-dashboard --version 0.10.2
    ```
    2. Unzip the chart and go the the unzipped chart directory.
    3. Update the values.yaml file. See the hard coded values [here](#Hard-coded-values)
    4. Run below command
    ```bash
    helm install --name <release name> . --namespace <namespace name>
    ```

### Post Installation Configuration

Refer to the section `Dashboard RBAC with Keycloak` below.

### Web UI Access

You can access the dashboard UI using this url: https://dashboard.global.stakater.com
If it would ask for token, get the token of service-account for dashboard.

### Dependencies

Currently kubernetes-dashboard does not have external dependencies of any application and it can be deployed as standalone application. But we use proxy injector and keycloak to enable SSO.

### Hard-coded-values

We use public helm chart version `0.10.2` for Kubernetes dashboard. We use default values of public chart except below mentioned values

```yaml
kubernetes-dashboard:
  # enable cluster admin role for dashboard
  rbac:
    clusterAdminRole: true
  # Add single sign in by using proxy injector annotations
  annotations:
    authproxy.stakater.com/image-name: quay.io/gambol99/keycloak-proxy
    authproxy.stakater.com/image-tag: v2.1.1
    authproxy.stakater.com/enabled: "true"
    authproxy.stakater.com/upstream-url: "http://127.0.0.1:9090"
    authproxy.stakater.com/source-service-name: stakater-global-kubernetes-dashboard
    authproxy.stakater.com/redirection-url: "https://dashboard.global.stakater.com"
    authproxy.stakater.com/listen: "0.0.0.0:80"
  enableInsecureLogin: true
  # service labels and annotations
  service:
    labels:
      expose: "true"
    annotations:
      config.xposer.stakater.com/Domain: stakater.com
      config.xposer.stakater.com/IngressNameTemplate: '{{.Service}}-{{.Namespace}}'
      config.xposer.stakater.com/IngressURLTemplate: 'dashboard.{{.Namespace}}.{{.Domain}}'
      xposer.stakater.com/annotations: |-
        kubernetes.io/ingress.class: external-ingress
        ingress.kubernetes.io/force-ssl-redirect: true
        forecastle.stakater.com/expose: true
        forecastle.stakater.com/icon: https://github.com/stakater/ForecastleIcons/raw/master/kubernetes.png
        forecastle.stakater.com/appName: Dashboard
```

## Dashboard RBAC with Keycloak

Normally when Kubernetes dashboard is configured with Keycloak, it fails to apply RBAC rules for users because the Kubernetes-dashboard-proxy uses kubernetes-api-server to determine the access rights. But kubernetes-api-server has no way of knowing which users groups are granted which access rights in Keycloak. So in order to give kubernetes-api-server access to Keycloak, we pass the following parameters in kops `cluster.yaml` file

```yaml
kubeAPIServer:
    oidcClientID: stakater-online-platform
    oidcGroupsClaim: groups
    oidcIssuerURL: https://keycloak.global.stakater.com/auth/realms/stakater
    oidcUsernameClaim: email
```

In KeyCloak we create a client with the following parameters:
* Client ID: stakater-online-platform
* Client Protocol: openid-connect
* Access Type: confidential
* Valid Redirect URIs: "*"

and create a Mapper with the following parameters:
* Name: groups
* Mapper Type: Group Membership
* Token Claim Name: groups

Now the Keycloak becomes an identity provider.

We create a group named `admin` in Groups and add users who need to have admin access.
and create a `ClusterRoleBinding` to assign this group `admin` a built-in `cluster-admin` access using the following manifest.
```
kind: ClusterRoleBinding
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: keycloak-admin-group
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cluster-admin
subjects:
- kind: Group
  name: /admin
```
Add the keycloak annotations to the `kubernetes-dashboard.yaml` like below and apply:
```
annotations:
    authproxy.stakater.com/enabled: "true"
    authproxy.stakater.com/upstream-url: "http://127.0.0.1:9090"
    authproxy.stakater.com/source-service-name: stakater-global-kubernetes-dashboard
    authproxy.stakater.com/redirection-url: "https://dashboard.global.stakater.com"
    authproxy.stakater.com/listen: "0.0.0.0:80"
```
Now the users in `admin` group in Keycloak can now have `cluster-admin` access in Kubernetes. Similarly different groups can be created to grant them diffferent level of permissions e.g. users on the project `ABC` can have a group `ABC-developers` and only have right to read/write `ABC-namespace` on kubernetes dashboard.