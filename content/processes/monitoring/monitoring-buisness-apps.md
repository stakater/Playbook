# Monitoring in buisness apps

## Updating buisness app

### Spring

Follow the steps below to expose monitoring metrics of a spring boot application at `/actuator/prometheus`.

#### Add Dependencies

The following dependencies are needed to expose micrometer and application metrics

```xml
<dependencies>
    <!-- For micrometer support -->
    <dependency>
        <groupId>io.micrometer</groupId>
        <artifactId>micrometer-core</artifactId>
        <version>1.1.4</version>
    </dependency>
    <dependency>
        <groupId>io.micrometer</groupId>
        <artifactId>micrometer-registry-prometheus</artifactId>
        <version>1.1.4</version>
    </dependency>
</dependencies>
```

#### Update Configuration

Add the following properties to `application.properties` to expose the micrometer endpoint.

```bash
management.endpoint.metrics.enabled=true
management.endpoints.web.exposure.include=*
management.endpoint.prometheus.enabled=true
management.metrics.export.prometheus.enabled=true
```

#### Add micrometer registry

Add the MeterRegistry bean to your spring boot application by adding the follwoing snippet to your SpringBootApplication class.

```java
    @Bean
    MeterRegistryCustomizer<MeterRegistry> metricsCommonTags() {
        return registry -> registry.config().commonTags("application", "common-service");
    }
```

This will help you create custom metrics within the application

#### Use Counter

To count the number of times an operation has been performed, just create a `io.micrometer.core.instrument.Counter` variable by doing

```java
Counter.builder("count_metric_name").description("Description of metric").register(meterRegistry);
```

the Counter class exposes a simple increment method that can be used to count.

#### Time Measurement

To add metrics that keeps track of processing time taken by a piece of code, follow the following snippet:

```java
private final Timer timer = Timer.builder("metricsname").tag("tagKey", "tagValue").register(meterRegistry);
long start = System.nanoTime();
...your code here
timer.record(System.nanoTime() - start, TimeUnit.NANOSECONDS);
```

## Adding Service Monitor

You need to add a service monitor so that prometheus knows where your app is running and where it should scrap for metrics. To create a service monitor, create a file named `service-monitor.yaml` with following content:

```yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  labels:
    app: {APP_NAME}-monitor
  name: {APP_NAME}-monitor
  namespace: {NAMESPACE}
spec:
  endpoints:
    - interval: 30s
      path: /actuator/prometheus
      port: web
  namespaceSelector:
    matchNames:
      - "{TARGET_NAMESPACE}"
  selector:
    matchLabels:
      app: {APP_NAME}
```

Replace `{APP_NAME}`, `{NAMESPACE}` and `{TARGET_NAMESPACE}` with correct values in the above file. Here `{NAMESPACE}` is the namespace in which prometheus is running and `{TARGET_NAMESPACE}` is the namespace in which your app is running. Also, your pods should have a label `app: {APP_NAME}`. If it doesn't have it then update the selector in the above file according to your scenario.

Apply the above manifest to create service monitor using the command below:

```bash
oc apply -f service-monitor.yaml
```

## Adding Prometheus Rule

Prometheus can be configured to trigger alerts based on metrics using Prometheus rule. To create alerts for your app create a file named `prometheus-rule.yaml` with following content

```yaml
apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
metadata:
  labels:
    prometheus: k8s
    role: prometheus-rulefiles
  name: prometheus-rules-{NAMESPACE}
  namespace: {NAMESPACE}
spec:
  groups:
  - name: application.rules
    rules:
    - alert: HighEmailUsage
      annotations:
        message: 'Email usage is greater than 10.'
      expr: count_requests_total > 10
      for: 10s
      labels:
        severity: warning
```

Replace `{NAMESPACE}` with the name of namespace in which prometheus is deployed. This sample config generates an alert when your buisness application metric `count_requests_total` meets the criteria `count_requests_total > 10`. This can be changed based on your scenario and more alerts can be added as new array elements.