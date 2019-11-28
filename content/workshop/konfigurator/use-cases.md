# Other Use Cases

## Dynamic Nginx Ingress Controller Configurations

### Problem

Addition of new services/ingresses require configurational changes in Nginx ingress controller and we have to manually change nginx configuration for this purpose.

### Solution

Templatize Nginx Ingress Controller configMap with Konfigurator to watch all services/ingresses and generate configurations dynamically without manual intervention. That configuration can then be directly used in nginx ingress controller using a configMap that is managed by Konfigurator.