# Developer Documentation for Keycloak

## Introduction

Keycloak is an open source software product to allow single sign-on with Identity Management and Access Management aimed at modern applications and services. We at stakater use keycloak for SSO in many applications like Jenkins, Kubernetes Dashboard and Forecastle etc.

## Installation

### Chart

We use public helm charts to deploy keycloak on our cluster. [Here](https://github.com/helm/charts/tree/master/stable/keycloak) is the public chart that we use and `4.0.1` is the public chart version that is used in our cluster. We use umbrella charts to deploy keycloak on our cluster. Currently we are using [this](https://github.com/stakater/stakaterkubehelmglobal) repository for keycloak deployment.

### Image

Currently we are using this `jboss/keycloak:4.5.0.Final` public image for keycloak in stakater.

### Cherry Pickable

Keycloak can be run as a standalone application. It depends only on postgresql for it's data storage. If we want to provide our own realm while installing the keycloak i.e. stakater realm, we have to provide an additional configmap containing the realm data in json format.

### Single Sign-on

SSO is not applicable on keycloak.
