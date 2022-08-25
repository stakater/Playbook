# Openshift Container Platform Cluster deployment on Azure

## Introduction

This document contains the guideline to deploy `Openshift Container Platform Cluster` on Azure. There are many ways to create an OCP cluster on Azure and also it supports Azure Openshift offering which is completely managed, but we encourage to create cluster on our own to have full control.

## Method 1: Deploy using Terraform

We encourage to create all the Infrastructure and deploy OCP on it using Terraform & Ansible scripts. You can clone [stakater/terraform-azure-openshift](https://github.com/stakater/terraform-azure-openshift) repo and create an Openshift cluster on Azure by following the steps.

**1. Generate Certificate**

To generate certificate to be used by the openshift cluster, use the certs module. Configure the cert.tfvars in certs/ folder as needed.

To generate the certificate using ACME, do:

```bash
cd certs
terraform apply -var-file=cert.tfvars
```

To get the certificate values, do:

```bash
terraform output public_certificate_pem
terraform output public_certificate_key
terraform output public_certificate_intermediate_pem
```

Once the certificate is generated, you can use these certificates in either terraform-ocp.tfvars or terraform-okd.tfvars files according to your needs

**2. Create service principal**

Create a service principal which will allow terraform to create resources on your behalf on azure

```bash
az ad sp create-for-rbac -n {PRINCIPAL_NAME} --password {PASSWORD} --role contributor --scopes /subscriptions/{subscription-id}
```
**3. Create resources**

You can tweak the `openshift/provision/template-inventory.yaml`. Its rendered, copied and executed on the server using openshift/inventory.tf.

To configure OKD, modify the variables in `openshift/terraform-okd.tfvars`, leave the empty variables and replace the variables filled with capital letters with your variables and apply:

```bash
cd openshift
terraform apply -var-file=terraform-okd.tfvars
```

To configure OCP, modify the variables in `openshift/terraform-ocp.tfvars`, replace the variables in capital letters and apply:

```bash
cd openshift
terraform apply -var-file=terraform-ocp.tfvars
```

And your cluster will be ready. Today's cluster has been deployed using terraform.

## Method 2: Using Azure's Red Hat OpenShift Container Platform Self-Managed

It is a simple method to bring up an Openshift cluster, you just have to pass configuration to it and it will create a cluster,

### Issues Faced

- You cannot manage it completely e.g. it will create self signed certs for the console url, which browsers does not support so it will be Not Secure.

- You cannot change the count of master and infra nodes.

- There are very little Azure VM Families, you can chose from the portal, and the default VM doesn't support attaching more than 4 disks per node.

### Deployment

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

3. Once cluster is deployed, the cluster can be accessed by these two methods:

    1. `Kube config`: It is available on the bastion node. Bastion node can be accessed using the public key provided at the time of cluster deployment. Get the public ip of bastion node from the Azure portal `Cluster Resource Group -> Bastion public IP`. Use the command given below to access the bastion node.
    ```bash
    ssh -i ~/.ssh/private_key <cluster-admin-name>@<bastion-node-public-ip>
    ```

    2. `Cluster Dashboard`: Cluster console URL is available at this location `Cluster Resource Group ->  Deployments -> redhat.openshift-container-platform-XXXXX -> Outputs -> OpenshiftConsoleURL`.

4. Add an wildcard entry in the Route53/DNS record for the cluster infra load balancer's ip address.

5. Resize the infra nodes to `DS2_v2` because default DS2_v3 only allows 4 disk to be attached to a node but more disks are required. `DS2_v2` allows 8 disks to be attached.
