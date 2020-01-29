# Exposing Applications on Azure

[[toc]]

We have a domain stakater.com and want to create a Kubernetes cluster using AKS in Azure and expose applications on subdomain i.e. lab.stakater.com. We will be using External DNS and nginx ingress controller to expose our apps. This article will be referring to all the steps needed to do this.

## Create AKS cluster

Create AKS cluster using Azure portal or with azure cli. Disable HTTP application Routing and set to basic Network configuration as we will be deploying ExternalDNS and Nginx Ingress Controller ourselves.

Set its name, and create a resource group if not already created.

To set current kubectl context, run following commands.

```sh
az login
az aks get-credentials --resource-group <resource-group-name> --name <aks-cluster-name>
```

## Create DNS zone entry

Create a resource group if not created

```sh
az group create -n externaldns -l eastus
```

Create DNS Zone entry in Azure DNS

```sh
az network dns zone create -g externaldns -n lab.stakater.com
```

The above command will return Azure nameservers.

## Add Route53 entry

Create a Route53 entry `lab.stakater.com` in hosted zone i.e. stakater.com and edit its nameservers and add the azure nameservers returned from previous command.

## Add Permissions to modify DNS zone

External-DNS needs permissions to make changes in the Azure DNS server. These permissions are defined in a Service Principal that should be made available to External-DNS as a configuration file.

The Azure DNS provider expects, by default, that the configuration file is at /etc/kubernetes/azure.json. This can be overridden with the `--azure-config-file` option when starting ExternalDNS. So we will be creating a secret with the respective fields.

### Create Service Principal

**Pre-Reqs**

For this step, you need Owner access to the Subscription or ask an Owner to create this Service Principal for you.

```sh
az ad sp create-for-rbac -n ExternalDnsServicePrincipal
```

This will return some fields, note the appId & password as it will be used in next step.

### Create Azure Secret

The preferred way to inject the configuration file is by using a Kubernetes secret. The secret should contain an object named azure.json with content similar to this:

```json
{
  "tenantId": "01234abc-de56-ff78-abc1-234567890def",
  "subscriptionId": "01234abc-de56-ff78-abc1-234567890def",
  "resourceGroup": "MyDnsResourceGroup",
  "aadClientId": "01234abc-de56-ff78-abc1-234567890def",
  "aadClientSecret": "uKiuXeiwui4jo9quae9o"
}
```

The values need to be replaced with the following command outputs.

| Key                   |Command                                                                    |
|-----------------------|-------------------------------------------------------------------------------|
| tenantID                  | az account show --query "tenantId"         |
| subscriptionId        | az account show --query "id"    |
| resourceGroup               | name of resource group e.g. externaldns  in this example |
| aadClientId               | `appId` returned from create Service Principal command |
| aadClientSecret               | `password` returned from create Service Principal command |

Save the above file with name `azure.json` and create a secret with following command

```sh
kubectl create secret generic azure-config-file --from-file=azure.json
```

### Assign rights for Service Principal

Find out the resource ids of the resource group where the dns zone is deployed, and the dns zone itself

```sh
az group show --name externaldns
{
  "id": "/subscriptions/id/resourceGroups/externaldns",
  ...
}
```

Now for the DNS entry

```sh
az network dns zone show --name lab.stakater.com -g externaldns
{
  "id": "/subscriptions/.../resourceGroups/externaldns/providers/Microsoft.Network/dnszones/lab.stakater.com",
  ...
}
```

Now assign the rights to the created service principal, using the resource ids from previous step

1. as a reader to the resource group

`az role assignment create --role "Reader" --assignee <appId GUID> --scope <resource group resource id>`

2. as a contributor to DNS Zone itself

`az role assignment create --role "Contributor" --assignee <appId GUID> --scope <dns zone resource id>`

## Deploy External DNS

Save following values in a file `external-dns-values.yaml`

```yaml
image:
  name: registry.opensource.zalan.do/teapot/external-dns
  tag: v0.5.14                      # At the time of writing 0.5.14 works fine, 0.5.13 & 0.5.12 give an other error
  pullPolicy: IfNotPresent
sources:
  - ingress
domainFilters:
  - lab.stakater.com                # (optional) Just restrict to this domain
provider: azure
logLevel: debug                     # (optional) To see detailed logs
txtOwnerId: stakater
registry: txt
policy: sync
rbac:
  create: true
  apiVersion: v1beta1
azure:
  secretName: azure-config-file     # Secret name created above
extraArgs:
  azure-resource-group: externaldns  # (Optional) Resource group name created above
```

Run the following command to install external-dns chart using helm.

```sh
helm install stable/external-dns --name external-dns -f external-dns-values.yaml
```

## Deploy Nginx Ingress

Save following values in a file `nginx-ingress-values.yaml`

```yaml
controller:  
  publishService:
    enabled: true
    pathOverride: "<namespace-name>/<nginx-ingress-controller-svc-name>"
  replicaCount: 2
  extraArgs:
    annotations-prefix: ingress.kubernetes.io
```

Run the following command to install nginx-ingress chart using helm.

```sh
helm install stable/nginx-ingress --name nginx-ingress -f nginx-ingress-values.yaml
```

## Deploying Application

Now we will deploy a sample nginx app, to verify the complete scenario and whether the application is being exposed. Deploy following manifest.

```yaml
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: nginx
spec:
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - image: nginx
        name: nginx
        ports:
        - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: nginx-svc
spec:
  ports:
  - port: 80
    protocol: TCP
    targetPort: 80
  selector:
    app: nginx
  type: ClusterIP
  
---
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: nginx
  annotations:
    kubernetes.io/ingress.class: nginx
spec:
  rules:
  - host: nginx.lab.stakater.com
    http:
      paths:
      - backend:
          serviceName: nginx-svc
          servicePort: 80
        path: /
```

Nginx Ingress Controller should add status.loadbalancer and add the ip of the loadbalancer. If it doesn't, nginx ingress controller isn't working fine, check again. After some time, check the dns entry in Azure portal, an extra record would have been added in lab.stakater.com. Browse to `nginx.lab.stakater.com` and it should show nginx home page.