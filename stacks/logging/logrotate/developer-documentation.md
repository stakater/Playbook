# Introduction

The logrotate utility is designed to simplify the administration of log files on a system which generates a lot of log files. Logrotate allows for the automatic rotation compression, removal and mailing of log files. Logrotate can be set to handle a log file daily, weekly, monthly or when the log file gets to a certain size.

# Installation

Right now no public helm chart of logrotate exist, so we have created a PR for that. Till then we are using public chart from stakater-charts, with version `1.0.0` in our cluster. We use umbrella charts to deploy cerebro on our cluster. Currently we are using this repository for elasticsearch deployment
```
https://github.com/stakater/stakaterkubelogging
```

 but we are depreciating it and replacing it with this repository.
```
https://github.com/stakater/stakaterkubehelmLogging
```

# Dependencies

Logrotate doesn’t require any dependency to run

# Steps

* Most of the times logrotate will be deployed from pipeline of `https://github.com/stakater/stakaterkubehelmLogging` repository. It will have updated configurations and dependencies for logrotate. But we can also install it manually (not recommended). To install logrotate manually, clone `https://github.com/stakater/stakaterkubehelmLogging` repo and you can run the make targets of repo containing latest used implementation of logrotate. This will install all dependencies and logrotate as well.

    * Clone `https://github.com/stakater/stakaterkubehelmLogging` repository
    * Update the hardcoded values mentioned in the `hard-coded-values.md`
    * Run this command. `make install CHART_NAME=logging`