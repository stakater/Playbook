# Descheduler

## Introduction

In Kubernetes the [`Kubernetes Scheduler`](https://kubernetes.io/docs/concepts/scheduling/kube-scheduler/) component schedule pods on nodes based on the defined policy. Pods can be scheduled on other nodes due to following reasons:

1. `Node utilization:` Pods will be scheduled to other nodes if a node is `under` or `over` utilized. 

2. `Scheduling Policies:` Scheduling policies like taints, labels and node/pod affinity rules are changed. 

3. `Node Failure:` A Node is failed its pods will be scheduled to other availble node in the cluster. 

4. `Node Addition`: A node is added in the cluster then pods from the other nodes that are over utilized will be scheduled to the new node.

[Deschedular](https://github.com/kubernetes-sigs/descheduler) based on its policy can move and evict pods but it doesn't reschedule them. Pods rescheduling is done by Kubernetes Scheduler.  

