# Installation and Dependencies of ExternalDNS

## Installation Steps

Most of the times ExternalDNS will be deployed from pipeline of [this](https://github.com/stakater/stakaterkubehelmGlobal) repository. It will have updated configurations and dependencies for ExternalDNS. But we can also install it manually (not recommended). To install ExternalDNS manually, clone [this](https://github.com/stakater/stakaterkubehelmGlobal) repo and you can run the make targets of repo containing latest used implementation of ExternalDNS. This will install all dependencies and ExternalDNS as well.

1. Clone [this](https://github.com/stakater/stakaterkubehelmGlobal) repository
2. Update the hard coded values mentioned [here](#Hard-coded-values)
3. Run this command. `make install CHART_NAME=global`

## Post Installation Configuration

No manual configuration is needed.

## Dependencies

ExternalDNS does not depend on other charts

## Hard-coded-values

This document contains the hard coded values for external dns, and its dependencies. 

```yaml
external-dns:
  domainFilters:
    - stackator.com
    - stakater.com
    - gocarbook.com
  txtOwnerId: stakater
  rbac:
    create: true
    apiVersion: v1beta1
```