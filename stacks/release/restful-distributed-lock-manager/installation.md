# Installation and Dependencies of RDLM

## Installation Steps

rdlm can be deployed using pipeline of [this](https://github.com/stakater/stakaterkubehelmrelease) repository. We can also deploy this manually (not recommended) via console.
1. Download the chart 
```bash
helm repo add stakater https://stakater.github.io/stakater-charts
helm repo update
helm fetch stakater/restful-distributed-lock-manager --version 1.0.2
```
2. Unzip the chart and go the the unzipped chart directory.
3. Update the values.yaml file. See the hard coded values [here](#Hard-coded-values)
4. Run below command
```bash
helm install --name <release name> . --namespace <namespace name>
```

## Post Installation Configuration

No manual configuration is needed.

## Dependencies

Currently rdlm does not have external dependencies of any application and it can be deployed as standalone application.

## Hard-coded-values

There are not much hard coded values in the chart of restful distributed lock-manager and this chart is also not dependent on any other chart. Below are few hard coded values that can be changed depending upon the application usage.

```yaml
restful-distributed-lock-manager:
  rdlm:
      container:
        name: rdlm
        imageName: stakater/restful-distributed-lock-manager
        imageTag: 0.5.3
        port: 8080
        targetPort: 8888
```