# Openshift Container Platform Cluster deployment on Azure

## Introduction
This document contains the guideline to deploy `Openshift Container Platform Cluster` on Azure.

## Cluster Deployment Guidelines

Follow the steps to deploy the cluster:

1. Create a cluster using the `Red Hat OpenShift Container Platform Self-Managed` from the Azure Marketplace.

2. Provide the cluster configuration in deployment wizard and deploy the cluster. List  of required parameters are given below:

    | Parameter Name | Description |
    |---|---|
    | Admin Username | Cluster admin username |
    | Add User SSH public key | Cluster admin public SSH key |
    | Subscription | Subscription name |
    | Resource Group | Create a new resource group |
    | Location | Europe west |
    | OCP Cluster Name Prefix | NIL |
    | Node sizes | Size should be changes to D2s_v3 |
    | Key vault Resource Group Name | NIL |
    | Key Vault Name | NIL |
    | Secret Name | NIL |
    | Virtual Network | Default new existing virtual network |
    | Default CIDR Setting or Custom IP Range  | Default setting should be used |
    | Openshift Admin User Password | NIL |
    | RedHat Subscription Manager User Name | NIL |
    | RedHat Subscription Manager User Password | NIL |
    | RedHat Subscription Manager Openshift Pool ID | NIL |
    | RedHat Subscription Manager Openshift Pool ID for Broker / Master Nodes | NIL |
    | Azure AD Service Principal Client ID GUID | NIL |
    | Azure AD Service Principal Client ID Secret | NIl |
    | Container Native Storage | Disable it. |
    | Cluster Logging | Default logging for the cluster. Enable it. |
    | Configure Metrics for cluster | Disable it. |
    | Default Router Subdomain | Subdomain that will be used for routes in the cluster. |

**NOTE**: `NIL` means that the paramter doesn't require any description because parameter name is self-explanatory. Details can be found on Azure offical documentation.

3. Once cluster is deployed, the cluster can be access by two methods:

    1. `Kube config`: It is available on the bastion node. Bastion node can be accessed using the public key provided at the time of cluster deployment. Get the public ip of bastion node from the Azure portal `Cluster Resource Group -> Bastion public IP`. Use the command given below to access the bastion node.
    ```bash
    ssh -i ~/.ssh/private_key <cluster-admin-name>@<bastion-node-public-ip>
    ```

    2. `Cluster Dashboard`: Cluster console URL is available at this location `Cluster Resource Group ->  Deployments -> redhat.openshift-container-platform-XXXXX -> Outputs -> OpenshiftConsoleURL`.

4. Add an wildcard entry in the Route53 for the cluster infra load balancer ip.

5. Resize the infra nodes to `DS2_v2` because default DS2_v3 only allows 4 disk to be attached to a node but more disks are required. `DS2_v2` allows 8 disks to be attached. 
