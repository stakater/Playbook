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
    app: {SERVICE_NAME}-monitor
  name: {SERVICE_NAME}-monitor
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
      app: {SERVICE_NAME}
```

Apply this to create service monitor.