# Cluster: Azure

## Overview

This guide provides guideline regarding kubernetes cluster creation using Microsoft Azure with AKS ([Azure Kubernetes Service](https://docs.microsoft.com/en-us/azure/aks/intro-kubernetes)) with AAD (Azure Active Directory) using bash script automation.


## Pre-requisites

* A Micorsoft Azure account with admin rights (needed to grant consent to server application)
* A domain on AWS (currently we use AWS domain to forward it to Azure AKS) 

## Configuration

AKS with AAD cluster creation is automated using bash scripts. These bash scripts run according to the configuration
provided in the `config` file. Set the following parameters in order to create the desired cluster.

* username                (username of the admin account)
* password                (password of the admin account)
* aksName                 (Name of the AKS cluster to be created)
* resourceGroup           (Name of ResourceGroup in which AKS Cluster is to be created)
* location                (Desired location of the cluster e.g. `eastus`)
* nodeCount               (Number of nodes in the cluster)
* externalDnsNamespace    (Namespace in which externaldns service is running `global` in our case)
* dnsResourceGroup        (ResourceGroup for externaldns service `externaldns` in our case)
* dnsZoneName             (DNS entry for Domain e.g. `workshop.stakater.com`)

## Deployment

Azure Kuberbetes Service with Azure Active Directory requires following steps:

1. Configure the `config` file
2. Make sure all three files are executable
```bash
chmod 744 <file>
```
3. Run by using the following command to start the deployment
```bash
bash ./config
```

4. After a while terminal will display this message
```
Use the above Nameservers to add in the hosted zone...
```
Note the Nameservers and add it to the hosted zone in AWS. Hit any key to continue deployment.

5. After some time terminal will ask the user to login using a web browser with a token. Use the token to login via web browser.

## Verification

1. When setup is complete. use the following command on the terminal
```bash
kubectl proxy
```
2. go to the following URL via web browser and verify if kubernetes cluster is running
```
http://localhost:8001/api/v1/namespaces/kube-system/services/https:kubernetes-dashboard:/proxy/#!
```

## Next Steps
1. Configure Access Control to give users permissions to use kubernetes services. Refer to the section "Create RBAC binding" in `processes:deployment -> Azure Active Directory with Azure Kubernetes Service`


2. Configure KeyCloak Refer to the section "Configure KeyCloak with Microsoft Azure Active Directory" in `processes:deployment -> Azure Active Directory with Azure Kubernetes Service`