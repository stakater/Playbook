# Developer Documentation for Jenkins

## Introduction

We at Stakater use Jenkins as our continuous integration, continuous development and  continuous testing server. Jenkins is a self-contained, open source automation server which can be used to automate all sorts of tasks related to building, testing, and delivering or deploying software.

## Installation

### Chart

We use public helm charts to deploy jenkins on our cluster. [Here](https://github.com/helm/charts/tree/master/stable/jenkins) is the public chart that we use and `0.23.0` is the public chart version that is used in our cluster. We use umbrella charts to deploy jenkins on our cluster. Currently we are using [this](https://github.com/stakater/stakaterkubehelmrelease) repository for jenkins deployment.

### Image

Currently we are using this `jenkins/jenkins:lts` public image for jenkins in stakater.

### Cherry Pickable

Yes, Depends Only on keycloak for SSO

### Single Sign-on

Yes, our jenkins setup supports SSO