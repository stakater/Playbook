# Other Use Cases

## Dynamic Nginx Ingress Controller Configurations

### Problem

New Services that are needed to be configured in Nginx Ingress Controller have to be manually changed in the configMap for Nginx Ingress Controller to use.

### Solution

Templatize Nginx Ingress Controller configMap with Konfigurator to watch all services/ingresses and generate configurations dynamically without manual intervention