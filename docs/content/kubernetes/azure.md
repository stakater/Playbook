# Azure

## Overveiew
This guide provides guidelines regarding kubernetes cluster creation using Microsoft Azure with AKS ([Azure Kubernetes Service](https://docs.microsoft.com/en-us/azure/aks/intro-kubernetes)) with AAD (Azure Active Directory) using bash script automation.

Azure Kubernetes Cluster can be created in two ways:

1. Bash
2. Terraform

## Pre-Requisites

Following pre-requisite requirements must be fullfilled:

* A domain on AWS (currently we use AWS domain to forward it to Azure AKS). 

* A Micorsoft Azure account with admin rights (needed to grant consent to server application)

::: tip Note
If admin account is not available and you need to request admin consent for application permission, comment out the line 50 and uncomment the line 48 in `bash/deploy-aks.sh`
:::

## Configuration & Deployment

1. GitHub Repository to deploy AKS cluster can be found [here](https://github.com/stakater/terraform-azure-aks). Clone it:

2. Project has the following directory structure:

```bash
.
├── terraform/
│   └── active_directory.tf
│   └── main.tf
│   └── outputs.tf
│   └── service_principal.tf
│   └── variables.tf
├── bash/
│   └── config
│   └── deploy-aks.sh
│   └── deploy.sh
│   └── setup-domain.sh
```

3. AKS with AAD cluster creation is automated using bash scripts. These bash scripts run according to the configuration provided in the `config` file. Set the following parameters in order to create the desired cluster.

| Parameter | Description |
|---|---|
| username | username of the admin account |
| password | password of the admin account |
| aksName | Name of the AKS cluster to be created |
| resourceGroup | Name of ResourceGroup in which AKS Cluster is to be created |
| location | Desired location of the cluster e.g. `eastus` |
| location | Number of nodes in the cluster |
| externalDnsNamespace | Namespace in which externaldns service is running `global` in our case |
| dnsResourceGroup | ResourceGroup for externaldns service `externaldns` in our case |
| dnsZoneName | DNS entry for Domain e.g. `workshop.stakater.com` |

### BASH

Azure Kuberbetes Service with Azure Active Directory requires following steps:

1. Move to the `bash` folder

```bash
cd bash/
```

2. Edit the `config` file to setup the variables

3. Make sure all three .sh files are executable

```bash
chmod 744 <file>
```

4. Run by using the following command to start the deployment

```bash
bash ./deploy.sh
```

5. After a while terminal will display this message: 

::: tip Note
Note the Nameservers and add it to the hosted zone in AWS. Hit any key to continue deployment.
:::

::: tip Note
Use the above Nameservers and add their values in the hosted zones.
:::

6. Following line will be displayed on the terminal to request the admin to consent to the permissions if the account being used is `not an admin account`. When the admin has consented to the permissions, Press any key to continue the deployment


::: tip Note
Ask Administrator to consent on the Application Permissions
:::

7. When the deployment is done, it will ask the user to login using a web browser with a token. Use the token to login via web browser.


### Terraform

This guide provides guideline regarding kubernetes cluster creation using [Terraform](https://www.terraform.io/)

**1. Pre-requisites**

* Terraform [Install](https://www.terraform.io/downloads.html)
* az-cli [Install](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest)
* A Micorsoft Azure account with admin rights (needed to grant consent to server application)

::: tip Note
If admin account is not available and you need to request admin consent for application permission, the command `terraform apply` will fail. When it fails. Request the admin to consent for the Server Application, and run `terraform apply` again to complete the deployment
:::

**2. Configuration**

All the configuration that is to be needed should be done in `variables.tf` file. Edit the `variables.tf` for the creation of desired cluster.

**3. Deployment**

*  Move to terraform folder
```bash
cd terraform/
```

* Edit `variables.tf` as per requirement.

* Initialize Terraform
```bash
terraform init
```

* Plan Terraform deployment. Remove errors if it shows any errors
```bash
terraform plan
```

* Apply the changes
```bash
terraform apply
```

## Verification

1. When deployment is complete, use the following command on the terminal to start the proxy server: 

```bash
kubectl proxy
```

2. Open any browser and pas the URL given below to check whether cluster is deployed successfully or not:


```bash
http://localhost:8001/api/v1/namespaces/kube-system/services/https:kubernetes-dashboard:/proxy/#!
```