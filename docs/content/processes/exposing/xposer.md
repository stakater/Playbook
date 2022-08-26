# Xposer


Creating an ingress resource and defining the rule for mapping a dns name to a service backend is one more manual step that we can automate with the help of Xposer, developed by the Stakater team. We can provide configuration in annotations of our services, which Xposer reads and based off which it automatically creates an Ingress resource.

As an example, if we have the following annotations on our service ...

```yaml
apiVersion: v1
kind: Service
Metadata:
  labels:
    expose: 'true'
  annotations:
    config.xposer.stakater.com/IngressNameTemplate: 'forecastle-ingress'
    config.xposer.stakater.com/IngressURLTemplate: 'forecastle.stakater.com'
  name: forecastle
```

… Xposer will read in these and create an Ingress with the configured values for this service as a backend. The ingress definition will be similar to the following:

```yaml
apiVersion: extensions/v1beta1,
kind: Ingress,
  metadata: {
    name: forecastle-ingress,
  }
...
    rules: [
      {
    host: forecastle.stakater.com,
    http: {
       paths: [
           {
                path: /,
                backend: {
            serviceName: forecastle,
            servicePort: 80
                }
            }
        ]
    }
      }
    ]
...
```
Xposer also supports three variables that can be used for the ingress url and name. Since we would like to keep our configuration flexible, and automated, these variables help in reducing the amount of hardcoded values in configuration. These are the Service name, Namespace and Domain.

```yaml
apiVersion: v1
kind: Service
Metadata:
  labels:
    expose: 'true'
  annotations:
    config.xposer.stakater.com/IngressNameTemplate: "{{`{{.Service}}-{{.Namespace}}`}}"
    config.xposer.stakater.com/IngressURLTemplate: "{{`{{.Service}}.{{.Domain}}`}}"
    config.xposer.stakater.com/Domain: company.com
  name: forecastle
```
At Stakater we follow the best practice of using these three values to construct the ingress url and name based on the values from the Service itself. This firstly reduces the chances of any typographical errors that can be introduced because of manual entry. And secondly, it helps in case a service is either renamed or moved to a different namespace. We either follow the  `Service.Namespace.Domain` scheme or the `Service.Domain` scheme in case the former becomes too long or unwieldy.

There are of course some annotations that we would have liked to add to our Ingress, but if the ingress is being automatically created, how do we specify those? Most notably, we would like to specify the Ingress class as described in the previous blog post, to match either the external or internal ingress controller. This is done with a separate annotation on the service which Xposer reads and processes.

```yaml
annotations:
  xposer.stakater.com/annotations: |-
    kubernetes.io/ingress.class: external-ingress
    ingress.kubernetes.io/force-ssl-redirect: true
    certmanager.k8s.io/cluster-issuer: letsencrypt-production
    some.other.annotation: some-value
```
More information on Xposer can be found [here](https://github.com/stakater/Xposer/)