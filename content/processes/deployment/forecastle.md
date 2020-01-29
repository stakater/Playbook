# Forecastle

[[toc]]

Forecastle is a Kubernetes controller and a web dashboard. It watches Ingresses and looks for specific annotations on them to indicate whether the Ingress needs to be registered on the dashboard or not. If the relevant configuration is discovered in the annotations of the ingress, the Ingress URL is added to the Forecastle dashboard. The dashboard displays all the running applications that are registered with it, and provides a simple way to access them.

The applications are automatically separated into sections based on the kubernetes namespace. The dashboard page also has a search bar which can be used to filter the application list to find a particular application without having to scroll through the whole list.

## How it works

### Configuration

Forecastle watches for specific annotations on ingresses. To make an app/ingress be discoverable and added to the Forecastle dashboard, the `forecastle.stakater.com/expose` annotation with `true` value should be added to the ingress. There are other annotations which can be optionally used to customize how the application is displayed in the dashboard, but without the `expose` annotation mentioned they will be ignored.

With `forecastle.stakater.com/icon` we can specify the URL of an image that should be used for the application button on the dashboard.

`forecastle.stakater.com/appName` can be used to specify a custom display name for the application on the dashboard. If this annotation isn’t specified, the name of the ingress is used by default.

A group/section name can be specified using `forecastle.stakater.com/group`. This is the section on the dashboard page under which the application will be listed. If the annotation is not used, the application will be displayed under the section titled after its namespace by default.

When an Ingress with the required annotations is created in the cluster, the ingress is added to the Forecastle dashboard. Likewise when the ingress is removed from the cluster, it’s link button is removed from the dashboard.

### Authentication

While the Forecastle dashboard does not have a login mechanism built-in or support yet for integration with OAuth providers, etc., at Stakater we do use Keycloak single sign-on with Keycloak gatekeeper to protect the Forecastle dashboard. Keycloak gatekeeper redirects any unauthenticated requests to the Keycloak server, and once an authenticated session is established it forwards the requests to the target Forecastle container.

It is therefore recommended to use some external authentication mechanism to protect access to the Forecastle dashboard, such as using [Keycloak](../../stacks/security/keycloak.md) with [Stakater Proxy Injector](../../stacks/security/proxy-injector.md).

### Running multiple instances

If needed, we can run multiple instances of forecastle by deploying multiple instances and configure the specific list of namespaces that Forecastle should watch for ingresses. The list of namespaces to watch is configured in the ConfigMap of the deployment.
```yaml
data:
  config.yaml: |-
    namespaces:
    - qa-1
    - qa-2
```

We can also have multiple Forecastle instances work within the same namespace and watch ingresses in the same namespace, but have applications register to only a selected number of the dashboards based on the instance name of the Forecastle deployment. The `instanceName` parameter is configured in the Forecastle deployment ConfigMap as follows:
```yaml
data:
  config.yaml: |-
    instanceName: dev-forecastle
```

On the Ingress, this configuration will be specified using the `forecastle.stakater.com/instance` annotation. The annotation value can be a comma separated list of the forecastle instances where we want to register the ingress. This way we can have the application display on a single or multiple dashboards based on the value we specify in the `instance` annotation.

Having multiple instances of Forecastle can be useful from an authorization point-of-view. For example if we want dev team members to only have access to applications deployed for the dev team, they can have authorization to use the relevant Forecastle dashboard only. Similarly the QA team can have access to only a QA relevant Forecastle dashboard. And it’s possible there may be some tools for which we are using a single instance across different environments, e.g. if we have a single instance of Jenkins working for both the dev and qa environments. In such a case we can have Jenkins be displayed on both instances of Forecastle dashboard.

## More Information

More information on Forecastle can be found [here](../../tools/global/forecastle/developer-documentation.md)