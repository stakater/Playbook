# Other Use Cases

## Dynamic nginx controller Configurations

### Problem

Addition of new services/ingresses require configurational changes in nginx controller and we have to manually change nginx configuration for this purpose.

### Solution

Templatize nginx controller configMap with Konfigurator to watch all services/ingresses and generate configurations dynamically without manual intervention. That configuration can then be directly used in nginx controller using a configMap that is managed by Konfigurator.