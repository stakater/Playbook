# Introduction

SonarQube is an open sourced code quality scanning tool. SonarQube provides the capability to not only show health of an application but also to highlight issues newly introduced. With a Quality Gate in place, you can fix the leak and therefore improve code quality systematically. 

# Installation:

We use public helm chart of sonarqube to deploy sonarqube in our cluster.

```
https://github.com/upmc-enterprises/elasticsearch-operator/tree/master/charts/sonarqube
```

Right now we have a pending PR so we are using version `0.11.0` from stakater-charts. We use umbrella charts to deploy cerebro on our cluster. Currently we are using this repository for cerebro deployment
```
https://github.com/stakater/stakaterkubeRelease
```

 but we are depreciating it and replacing it with this repository.
```
https://github.com/stakater/stakaterkubehelmRelease
```

# Known Issues:

There are 2 known issues with latest public helm chart: 

    * It doesn’t install custom plugins with current version of sonarqube used in the public chart. It doesn’t work even with the latest sonarqube image, but only works with the version 7.1 
    * It doesn’t read & apply custom sonar.properties file 

1st issue is resolved currently by using 7.1 version of sonarqube docker image. For 2nd issue we contacted the chart owner, and he has identified the issue. He confirmed that he will fix the issue soon. Till then we are configuring custom sonar properties manually. 

# Dependencies

Sonarqube required a database to persist its results. With the public chart we can either use mysql or postgres

# Steps:

* Most of the times sonarqube will be deployed from pipeline of `https://github.com/stakater/stakaterkubehelmRelease` repository. It will have updated configurations and dependencies for sonarqube. But we can also install it manually (not recommended). To install sonarqube manually, clone `https://github.com/stakater/stakaterkubehelmRelease` repo and you can run the make targets of repo containing latest used implementation of sonarqube. This will install all dependencies and sonarqube as well.
    * Clone `https://github.com/stakater/stakaterkubehelmRelease` repository
    * Update the hardcoded values mentioned in the `hard-coded-values.md`
    * Run this command. `make install CHART_NAME=release`

* Verify from UI that cerebro pod is running and accessible.
