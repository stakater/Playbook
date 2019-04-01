# Chowkidar

Chowkidar is an Urdu word for watchman, and generically Stakater Chowkidar is implemented to have configuration for certain actions to be performed on certain events in the kubernetes cluster. One of the current event-actions that Chowkidar supports and that we are going to discuss today is the notification on slack at the creation of a Pod without a resource request and limit defined.

Let us first take a look at what resource limit and requests are for containers and pods.

## Scenario background

### Container Resource limits

By default a container has no resource limits and can use as much of a resource as the host allows. The container can however be configured to set a limit to how much memory or CPU a container can use.

### Memory

It is good practice to keep a limit on how much host memory a running container can consume. On linux, when there is a shortage of memory to perform important system functions the kernel kills processes to free up memory. Any process can be killed for this purpose, including Docker. Docker does try to adjust the priority of the docker daemon with respect to the out of memory exception however it does not do the same for containers. An individual container may therefore likely be killed in such an event..

In docker we can force limits on the memory consumption of containers. A hard limit can be set to disallow the container to use no more than a given amount of memory. A soft limit allows the container to use as much memory as needed as long as the system does not have other memory consumption requirements. The following options can be used with the docker run command to enforce these memory limits:

`--memory`: This is the maximum memory the container can use, i.e. the hard limit

`--memory-reservation`: This is the memory limit imposed on the container when docker detects low memory on the host machine, i.e. the soft limit

### CPU

A container by default has unlimited access to the host’s CPU. You can set various constraints to limit a given container’s access to the host machine’s CPU. Some of the docker run flags for configuring the amount of CPU resources the container has are as follows:

`--cpus`: This is the limit of the number of CPUs the container is allowed to use, i.e. a hard limit

`--cpu-shares`: This is the container’s weight for CPU access and is considered only when CPU cycles are constrained. So in a way this is a soft limit.
Container resources in Kubernetes

The docker configuration options that we reviewed above can be specified in Kubernetes on the containers in pods. Each Container of a Pod can specify one or more of the following configuration:

- `spec.containers[].resources.limits.cpu`
- `spec.containers[].resources.limits.memory`
- `spec.containers[].resources.requests.cpu`
- `spec.containers[].resources.requests.memory`

When the kubelet starts a Container of a Pod, it passes the CPU and memory limits to the container runtime. In the case of docker these configuration map directly or indirectly as follows:

- `spec.containers[].resources.requests.cpu` → `--cpu-shares`
- `spec.containers[].resources.limits.memory` → `--memory`

## Implementing Chowkidar

Specifying requests and limits for memory/cpu in the container deployments is a good practice since otherwise there is a possibility of having a container eat up too many resources with not enough left for more important containers/processes, or in extreme cases getting important containers/processes killed off by the OS to relieve stress on the constrained resources. We would like to implement this best practice in all our deployments, and in case any container without this best practice is deployed, we would like to have this container be brought to our notice.

Chowkidar will watch all the Pods being deployed, and if there is any without a resource request/limit specified, we will configure to be notified via slack.

Chowkidar allows you to have multiple controllers that will continuously watch types in all the namespaces and automatically perform any actions given in the yaml file. With this, you can easily check for any criteria on your Pods/other types and take corresponding actions.

We will specify the following configuration on Chowkidar:

- `type`: The type of Resource you want to monitor, i.e. Pods
- `watchcriterion`: The criterion for which you want to take actions for the controller i.e. resourceExists. resourceExists will make sure Pods should have Resources and if not found, it will take action.
- `actions`: The Array of actions that you want to take, i.e. slack. For Slack you need to provide token and Channel Name as Parameters in the yaml file

Following are the yaml files for deploying Chowkidar with our required configuration:

```
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  annotations:
    configmap.reloader.stakater.com/reload: chowkidar
  labels:
    app: chowkidar
    group: com.stakater.platform
    provider: stakater
    version: v0.0.31
    chart: "chowkidar-v0.0.31"
    release: "RELEASE-NAME"
    heritage: "Tiller"
  name: chowkidar
spec:
  replicas: 1
  revisionHistoryLimit: 2
  selector:
    matchLabels:
      app: chowkidar
      group: com.stakater.platform
      provider: stakater
  template:
    metadata:
      labels:
        app: chowkidar
        group: com.stakater.platform
        provider: stakater
    spec:
      containers:
      - env:
        - name: KUBERNETES_NAMESPACE
          valueFrom:
            fieldRef:
              fieldPath: metadata.namespace
        - name: CONFIG_FILE_PATH
          value: /configs/config.yaml
        image: "stakater/chowkidar:v0.0.31"
        imagePullPolicy: IfNotPresent
        name: chowkidar
        volumeMounts:
        - mountPath: /configs
          name: config-volume
      serviceAccountName: chowkidar
      volumes:
      - configMap:
          name: chowkidar
        name: config-volume

---
apiVersion: v1
kind: ConfigMap
metadata:
  labels:
    app: chowkidar
    group: com.stakater.platform
    provider: stakater
    version: v0.0.31
    chart: "chowkidar-v0.0.31"
    release: "RELEASE-NAME"
    heritage: "Tiller"
  name: chowkidar
data:
  config.yaml: |-
    controllers:
    - type: pods
      watchcriterion:
        operator: and
        identifiers:
        - resourceExists
        - healthCheckExists
      actions:
      - name: slack
        params:
          channel: channel-name
          token: your-token
```

We will also need to provide Chowkidar with the required access control:

```
apiVersion: v1
kind: ServiceAccount
metadata:
  labels:
    app: chowkidar
    group: com.stakater.platform
    provider: stakater
    version: v0.0.31
    chart: "chowkidar-v0.0.31"
    release: "RELEASE-NAME"
    heritage: "Tiller"
  name: chowkidar
---
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: ClusterRole
metadata:
  labels: 
    app: chowkidar
    group: com.stakater.platform
    provider: stakater
    version: v0.0.31
    chart: "chowkidar-v0.0.31"
    release: "RELEASE-NAME"
    heritage: "Tiller"
  name: chowkidar-role
rules:
  - apiGroups:
      - ""
    resources:      
      - pods
    verbs:
      - list
      - get
      - watch
---
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: ClusterRoleBinding
metadata:
  labels: 
    app: chowkidar
    group: com.stakater.platform
    provider: stakater
    version: v0.0.31
    chart: "chowkidar-v0.0.31"
    release: "RELEASE-NAME"
    heritage: "Tiller"
  name: chowkidar-role-binding
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: chowkidar-role
subjects:
  - kind: ServiceAccount
    name: chowkidar
    namespace: default
```

More information on Xposer can be found [here](https://github.com/stakater/Chowkidar/)