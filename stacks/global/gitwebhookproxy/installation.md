# Installation and Dependencies of Gitwebhookproxy

## Installation Steps

1. Gitwebhookproxy can be deployed using pipeline of [this](https://github.com/stakater/stakaterkubehelmglobal) repository. We can also deploy this manually (not recommended) via console. To deploy it manually
    1. Download the chart
    ```bash
    helm repo add stakater https://stakater.github.io/stakater-charts
    helm repo update
    helm fetch stakater/gitwebhookproxy --version 0.2.61
    ```
    2. Unzip the chart and go the the unzipped chart directory.
    3. Update the values.yaml file. See the hard coded values [here](#Hard-coded-values)
    4. Run below command
    ```bash
    helm install --name <release name> . --namespace <namespace name>
    ```

## Post Installation Configuration

No manual configuration is needed.

## Web UI Access

You can access the gitwebhookproxy health end point using below urls:
Github: https://gitwebhookproxy.global.stakater.com/health
Gitlab: https://gitlabwebhookproxy.global.stakater.com/health

## Dependencies

Gitwebhookproxy does not depend on other charts

## Hard-coded-values

Gitwebhookproxy has two types of hard coded values. We can either configure it for Github or for Gitlab.
Below mentioned set of values explain that.

### Github

```yaml
gitWebhookProxy:
  useCustomName: false
  customName: gitwebhookproxy
  # Configuration to setup gitwebhookproxy
  config:
    provider: github
    # Jenkins url
    upstreamURL: "https://jenkins.release.stakater.com"
    allowedPaths: "/github-webhook,/project"
    # github web hook secret to validate github events
    secret: "dummysecret"
    # Users to ignore from triggering pipeline
    ignoredUsers: "stakater-user"
  # Service labels and annotations
  service:
    labels:
      expose: "true"
    annotations:
      config.xposer.stakater.com/Domain: stakater.com
      config.xposer.stakater.com/IngressNameTemplate: '{{.Service}}-{{.Namespace}}'
      config.xposer.stakater.com/IngressURLTemplate: '{{.Service}}.{{.Namespace}}.{{.Domain}}'
      xposer.stakater.com/annotations: |-
        kubernetes.io/ingress.class: external-ingress
        ingress.kubernetes.io/force-ssl-redirect: true
        monitor.stakater.com/enabled: true
```

### Gitlab

```yaml
gitWebhookProxy:
  useCustomName: true
  customName: gitlabwebhookproxy
  # Configuration to setup gitwebhookproxy
  config:
    provider: gitlab
    # Jenkins url
    upstreamURL: "https://jenkins.release.stakater.com"
    allowedPaths: "/github-webhook,/project"
    # gitlab web hook secret to validate gitlab events, if secret is not set then it gitwebhookproxy does not validate
    secret: ""
    # Users to ignore from triggering pipeline
    ignoredUsers: "carbook.bot"
  # Service labels and annotations
  service:
    labels:
      expose: "true"
    annotations:
      config.xposer.stakater.com/Domain: stakater.com
      config.xposer.stakater.com/IngressNameTemplate: '{{.Service}}-{{.Namespace}}'
      config.xposer.stakater.com/IngressURLTemplate: '{{.Service}}.{{.Namespace}}.{{.Domain}}'
      xposer.stakater.com/annotations: |-
        kubernetes.io/ingress.class: external-ingress
        ingress.kubernetes.io/force-ssl-redirect: true
        monitor.stakater.com/enabled: true
```