# Prometheus Alerting

For alerting, Prometheus Server triggers alerts on Prometheus AlertManager based on the rules defined within AlertManager. The alert trigger sends notifications through a desired notification channel.

## Prometheus monitoring
   
Let’s take a quick look at how we can use prometheus for monitoring on a Kubernetes cluster.

A convenient way of deploying Prometheus on Kubernetes is by using the Prometheus Operator. With Prometheus there are a few components involved at the center of which we have the Prometheus Server. Prometheus server essentially scrapes metric data that other services expose. Each Kubernetes node exposes certain Services like Node Exporter & Kubelet, which contain system level metrics. Node Exporter collects OS level metrics of a node through Docker host and Kubelet contains cadvisor which collects container metrics from the Docker Engine. For Kubernetes monitoring, Prometheus scrapes metrics from each Kubelet and Node Exporter from all nodes.

There may be some services such as ephemeral and batch jobs that Prometheus server cannot reliably scrape because of their ephemeral nature. For such a case we have the Prometheus Pushgateway which is able to have such jobs or services push their metrics to it, and in turn Pushgateway exposes these metrics to Prometheus for scraping.

For visualization we have Grafana which queries Prometheus and groups the results and displays it in Dashboards.

## Alert Manager

Prometheus Operator creates/configures/manages Prometheus atop Kubernetes and makes Kubernetes native Prometheus configuration in the form of Customer Resource Definitions (CRDs). Two of these CRDs are for PrometheusRule and AlertManager.

We can define multiple alerting rules using PrometheusRule which are actually Prometheus queries. When the rule query is satisfied, it fires the alert to AlertManager. Each rule can have labels. AlertManager has Routes, which can be defined using these labels and each Route can have multiple Receivers, and each receiver can send the notification to a specific app like Slack or email. We can also set a time period during which a rule is satisfied, for the alert to be triggered, e.g. we want the alert to trigger if Kubelet is down for 2 minutes.

Following is an example configuration which shows the configuration of 2 alerts based on the same metric, i.e. the number of responsive kubelets. The threshold for the percentage of kubelets however is different and are therefore labelled differently.

```yaml
- alert: K8SKubeletDown
  expr: count(up{job="kubelet"} == 0) / count(up{job="kubelet"}) > 0.03
  for: 5m
  labels:
    severity: warning
    kind: infra
  annotations:
    description: Prometheus failed to scrape {{ $value }}% of kubelets.
    summary: Many Kubelets cannot be scraped
- alert: K8SKubeletDown
  expr: absent(up{job="kubelet"} == 1) or count(up{job="kubelet"} == 0) / count(up{job="kubelet"}) > 0.1
  for: 5m
  labels:
    severity: critical
    kind: infra
  annotations:
    description: Prometheus failed to scrape {{ $value }}% of kubelets, or all Kubelets have disappeared from service discovery.
    summary: Many Kubelets cannot be scraped
```
In the first alert configured above, if the percentage of unresponsive kubelets stays above 3% for 5 minutes, an alert of severity Warning is triggered. In second alert, if the percentage of unresponsive kubelets stays above 10% for 5 minutes, an alert of severity Error is triggered.