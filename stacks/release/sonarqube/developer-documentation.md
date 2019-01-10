# Developer Documentation for Sonarqube

## Introduction

SonarQube is an open sourced code quality scanning tool. SonarQube provides the capability to not only show health of an application but also to highlight issues newly introduced. With a Quality Gate in place, you can fix the leak and therefore improve code quality systematically.

## Chart

We use public helm charts to deploy sonarqube on our cluster. [Here](https://github.com/helm/charts/tree/master/stable/sonarqube) is the public chart that we use and `0.10.3` is the public chart version that is used in our cluster. We use umbrella charts to deploy sonarqube on our cluster. Currently we are using [this](https://github.com/stakater/stakaterkubehelmrelease) repository for sonarqube deployment.

## Image

Currently we are using this `sonarqube:7.4-community` public image for sonarqube in stakater.

## Cherry Pickable

Yes

## Single Sign-on

Yes