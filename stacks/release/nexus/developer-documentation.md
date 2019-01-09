# Developer Documentation for Nexus

## Introduction

[Nexus](https://www.sonatype.com/nexus-repository-sonatype) is a repository manager that can store and manage components, build artifacts, and release candidates in one central location. At stakater, we use nexus to store docker images of our prod application like stakaterfrontend and emailservice etc.

## Installation

### Chart

We use public helm charts to deploy nexus on our cluster. [Here](https://github.com/helm/charts/tree/master/stable/sonatype-nexus) is the public chart that we use and `1.12.1` is the public chart version that is used in our cluster. We use umbrella charts to deploy nexus on our cluster. Currently we are using [this](https://github.com/stakater/stakaterkubehelmrelease) repository for nexus deployment.

### Image

Currently we are using this `quay.io/travelaudience/docker-nexus:3.13.0_alpine_3.8.1` public image for nexus in stakater.

### Cherry Pickable

Yes

### Single Sign-on

No, currently nexus does not support SSO with keycloak.