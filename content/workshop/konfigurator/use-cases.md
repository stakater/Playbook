# Other Use Cases

[[toc]]

Konfigurator is very helpful when there is need to dynamically generate stuff on the basis of Kubernetes API objects. Here are few examples:

## Dynamically generate nginx configuration file

### Problem

Addition of new services/ingresses require configurational changes in nginx and one will have to manually change nginx configuration for this purpose.

### Solution

Templatize nginx config via ConfigMap with Konfigurator to watch all services/ingresses and generate configurations dynamically without manual intervention. That configuration can then be directly used in nginx using a configMap that is managed by Konfigurator.
