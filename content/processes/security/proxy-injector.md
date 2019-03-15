Stakater Proxy Injector

Deploying a sidecar container for Keycloak Gatekeeper with all our applications can be a hassle. So we want to automatically inject a keycloak gatekeeper container in a pod, for any deployment that requires to connect to keycloak, instead of manually adding a sidecar container with each deployment. This Proxy Injector controller will continuously watch deployments in specific or all namespaces, and automatically add a sidecar container for keycloak gatekeeper. Configuration for the keycloak gatekeeper is done through annotations of the respective deployment or with ConfigMap of the ProxyInjector.

Some common configuration can either be added to the proxy injector config.yaml in the ConfigMap, or can be overridden at the application deployment level using annotations on the target deployments. Following are the core configuration properties

```
listen: this is the interface the gatekeeper should be listening on e.g. "0.0.0.0:80" to listen on the localhost pod.

upstream-url: url for the upstream endpoint you wish to proxy

resources: list of resources to proxy uri, methods, roles

client-id: client id used to authenticate to the oauth service

client-secret: client secret used to authenticate to the oauth service
```

All of the available [Gatekeeper configuration](https://www.keycloak.org/docs/latest/securing_apps/index.html#configuration-options) can also be specified on ProxyInjector annotations.

More information on ProxyInjector can be found [here](../../tools/global/proxyinjector/developer-documentation.md)