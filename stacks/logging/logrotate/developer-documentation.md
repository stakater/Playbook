# Developer Documentation for Logrotate

## Introduction

The logrotate utility is designed to simplify the administration of log files on a system which generates a lot of log files. Logrotate allows for the automatic rotation compression, removal and mailing of log files. Logrotate can be set to handle a log file daily, weekly, monthly or when the log file gets to a certain size.

## Installation

### Chart

Right now no public helm chart of logrotate exist, so we have created a PR for that. Till then we are using public chart from stakater-charts, with version `1.0.0` in our cluster. We use umbrella charts to deploy logrotate on our cluster. Currently we are using [this](https://github.com/stakater/stakaterkubelogging) repository for elasticsearch deployment

### Image

Currently we are using this `stakater/logrotate:3.13.0` stakater public image for logrotate in stakater.

### Cherry Pickable

Yes

### Single Sign-on

Not applicable