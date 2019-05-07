# Auto-cleanup resources on Kubernetes

Dangling resources in a deployment environment such as Kubernetes or Openshift can be a problem. It adds to clutter and may also consume resources unnecessarily. This is especially a problem when there are multiple administrators/developers that are managing the system, and the knowledge of the system is to some extent distributed between them. No one person may be able to definitively say why a particular empty or even non-empty namespace was created in the first place or why it has not been deleted since. This could be a temporary project created on a dev Openshift cluster for prototyping and testing a new feature, or it could be a temporary kubernetes namespace on a staging cluster to demo an application to a particular audience. Either way the scenario indicates that the namespace will be temporary, and all deployments being performed within that will not be required after a particular time. Following the principles of GitOps one can indeed perform all such system changes such as namespace creation and deployments, via Git functions, which inherently provides traceability of these changes. Hence one may be able to trace the creation of such a resource back to the intent as may be described in the commit message, or directly inquire from the committer about it’s purpose and validity. However such an effort to trace the timeline of these events from the git history, can quickly become a complex feat leading one away from more important tasks.

## Jamadar

Jamadar is a Kubernetes controller that watches kubernetes resources at a configured time interval, and identifies dangling resources based on the age of the resource, and configuration provided in the annotations. Jamadar will help us execute scenarios such as deleting namespaces that are one month old. The resources that we would like to persist, and should not be recycled by Jamadar should have a particular annotation with value. Any resources without the annotation will be recycled by Jamadar based on the configured time interval. Additionally there are other actions that can be configured to be performed once the resource clean-up has taken place.

### Configuring

Jamadar can be configured with the following options at deployment time, in the configuration yaml in the ConfigMap.

| Config option       | Description |
|---------------------|-------------|
| pollTimeInterval    | The time interval after which the controller will poll and look for dangling resources, The value can be in “ms”, “s”, “m”, “h” or even combined like “2h45m” |
| age                 | The minimum age of the dangling resource that should be considered for clean-up. The value unit can be any one of “d”, “w”, “m”, “y”. e.g. “7d” for 7 days |
| resources           | The resources that you want to be taken care of by Jamadar. At the moment only supports `namespaces` |
| actions             | The Array of actions that you want to take. At the moment only supports `default` and `slack` |
| restrictedNamespaces| The list of namespaces names that should be ignored |

Following is an example configuration in full:

```yaml
pollTimeInterval: 12h  # Values: "ms", "s", "m", "h".
age: 1m                # Values: "d" or "w" or "m" or "y".
resources:
  - namespaces
actions:
  - name: default
  - name: slack
    params:
      token: <token>
      channel: <channel-name>
restrictedNamespaces: 
  - kube-system
  - default
  - kube-public
  - prod
  - tools
```

#### Supported Resources
     
     At the moment Jamadar supports only namespaces in the resources that can be configured for clean-up. This also corresponds to projects in Openshift.
     
     We will be adding support for other Resources as well in the future.
     
#### Supported Actions
     
     At the moment Jamdar supports the following Actions with their parameters,
     
         Default: No parameters needed, it will just log to console the details.
         Slack: you need to provide token and Channel Name as Parameters in the yaml file
     
     We will be adding support for other Actions as well in the future

### Deploying Jamadar

The kubernetes deployment files are included in the Jamadar repository in the deployments folder. The deployment files include options to deploy using a single yaml manifest, multiple yaml manifests one for each resource type, or Helm chart. The configuration should be edited in the ConfigMap and deployment can be made as per one’s preferred method.

More information on Jamadar can be found [here](https://github.com/stakater/Xposer/)