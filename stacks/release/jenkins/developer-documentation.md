# Jenkins

## Introduction

We at Stakater use Jenkins as our continuous integration, continuous development and  continuous testing server. Jenkins is a self-contained, open source automation server which can be used to automate all sorts of tasks related to building, testing, and delivering or deploying software.

### Chart

We use public helm charts to deploy jenkins on our cluster. [Here](https://github.com/helm/charts/tree/master/stable/jenkins) is the public chart that we use and `0.23.0` is the public chart version that is used in our cluster. We use umbrella charts to deploy jenkins on our cluster. Currently we are using [this](https://github.com/stakater/stakaterkubehelmrelease) repository for jenkins deployment.

### Image

Currently we are using this `jenkins/jenkins:lts` public image for jenkins in stakater.

### Cherry Pickable

Yes, Depends Only on keycloak for SSO

### Single Sign-on

Yes, our jenkins setup supports SSO

## Installation

### Installation Steps

1. Most of the times Jenkins will be deployed manually and not via pipeline because jenkins is the entity that is used to run these pipelines.
2. To install jenkins manually, you can run the make targets of repo containing latest used implementation of jenkins. This will install all dependencies and jenkins as well.
    1. Clone [this](https://github.com/stakater/stakaterkubehelmrelease) repository
    2. Update the hardcoded values mentioned [here](#Hard-coded-values)
    3. Update the `release/requirements.yaml` and comment out non-required dependencies. To view dependencies of jenkins, follow [this](#Dependencies) guideline.
    4. Run this command. `make install CHART_NAME=release`
3. Verify from UI that jenkins pod is running and accessible.

### Post-Installation-Configurations

Configuration is divided into three parts. Jenkins own configuration, github configuration and gitlab configuration.

#### Jenkins Configurations

1. Go to `Manage Jenkins` on left navigation bar. Select the first option `Configure System`
2. Update the `Cloud -> Kubernetes -> Kubernetes Pod Template -> Advance` and empty the `Limit CPU` and `Limit Memory` fields.
3. Update the `Cloud -> Kubernetes -> Kubernetes Pod Template ->`
    1. Name: base
    2. Labels: base
4. Update `# of executors` to 5
5. Update `Usage` to `Only build jobs with label expressions matching this node`

#### Github Configurations

1. Go to `Manage Jenkins` on left navigation bar. Select the first option `Configure System`
2. Update `GitHub -> GitHub Server` (Use Add GitHub Server if not added already)
    1. Name: Github
    2. API URL: https://api.github.com
    3. Credentials: Generate new github credentials of `stakater-user` or reuse existing credentials. And use these as secret-text in jenkins credentials.
        1. Add Credentials with kind Secret Text
        2. Secret: testsecret (Or get new one from teamlead)
        3. ID: GithubToken
        4. Save and use this credential.
    4. Test connection. It should be successful.
    5. Click on `Advance` and use gitwebhookproxyurl for `Override Hook URL` e.g. https://gitwebhookproxy.tools.stackator.com/github-webhook/
    6. Use the secret that is being used in github repos for webhook authentication for Shared secret. e.g. `testsecret`
        1. Add Credentials with kind `Secret Text`
        2. Secret: testsecret (Or get new one from teamlead)
        3. ID: DummySecret
        4. Save and use this credential.
    7. Make sure this secret is same for github, gitwebhookproxy and jenkins.

#### Steps to Create Github Organizations

1. Click on `New Item` on left navigation bar.
2. Enter an item name and select `Github Organization` and click ok.
3. Enter the Display name. E.g. Stakater
4. Select Credentials
5. Enter Owner. It is the name of github organization. Make sure it is in small case.
6. Update `Discover pull requests from forks -> Trust -> Contributors`
7. Check `Periodically if not otherwise run` and uncheck/disable it.
8. Enter `Automatic branch project triggering -> Branch names to build automatically PR` (This is a random regex to avoid triggering all webhook)
9. Click apply and then save. It should automatically start scanning the repos. If it doesn’t start then manually start scanning the organization by clicking the `Scan Organization Now` button on left navigation bar.

#### Organizations

Steps to Create Github Organizations are same for every github organization. After the scan is complete, follow update these values in each organization to complete the setup.

**Stakater:**
```text
Owner: stakater
Filter by name (with regular expression): ([A-Z][a-z0-9]+)+
Branch names to build automatically: (PR-\d+|master)
```

**Stackator Input:**
```text
Owner: stakater
Filter by name (with regular expression): [\w-]*input\b|^stackator-[\w-]*|^stakater-[\w-]*
Branch names to build automatically: (PR-\d+|master)
```

**Stakater Charts:**
```text
Owner: stakater-charts
Branch names to build automatically: (PR-\d+|master)
```

**Stakater Docker:**
```text
Owner: stakater-docker
Branch names to build automatically: (PR-\d+|master)
```

**Stakater Lab:**
```text
Owner: stakater-lab
Branch names to build automatically: (PR-\d+|master)
```

#### Gitlab Configurations

1. Go to `Manage Jenkins` on left navigation bar. Select the first option `Configure System`
2. Uncheck `Enable authentication for '/project' end-point`
3. Update `Gitlab -> GitLab connections`
    1. Connection name: gitlab
    2. Gitlab host URL: https://gitlab.com/
    3. Credentials: Create gitlab token and use that token as GitLab API token while creating credentials
    4. Token: testToken (Get Latest token from teamlead)
    5. Test Connection. It should be successful.
4. Go to `Manage Jenkins` on left navigation bar. Select the second option `Configure Global security`
5. Uncheck `CSRF Protection -> Enable script security for Job DSL scripts`

#### Steps to Create Gitlab Organizations

1. Click on `New Item` on left navigation bar.
2. Enter an item name and select `Multibranch Pipeline` and click ok. Name of item should be as same as given in its gitlab webhook url ie. carbook-gitlab-config
3. Enter the Display name. E.g. carbook-gitlab-config
4. Update `Branch Sources -> Git`
    1. Project Repository: https://gitlab.com/carbook/carbook-gitlab-config
    2. Credentials: Create jenkins username with password credentials and use `carbook.bot` as username and ID. Get password from team lead.
5. Save and apply the changes.
6. Trigger master branch and it will automatically create remaining gitlab pipelines.
7. Scan manual pipelines so their branches get discovered

### Dependencies

Below are the dependencies of jenkins. PRs have been created for all these dependencies in public helms chart repository but we are waiting for the approval.
We need to deploy these dependencies with jenkins.

```yaml
- name: storage
  version: 1.0.1
  repository: https://stakater.github.io/stakater-charts/
  alias: mvnstorage
- name: secrets
  version: 1.0.2
  repository: https://stakater.github.io/stakater-charts/
  alias: secrets
- name: rbac
  version: 1.0.1
  repository: https://stakater.github.io/stakater-charts/
  alias: rbac
- name: configmap
  version: 1.0.1
  repository: https://stakater.github.io/stakater-charts/
  alias: configmap
- name: xposer
  version: 0.0.3
  repository: https://stakater.github.io/stakater-charts/
  alias: xposer
- name: restful-distributed-lock-manager
  version: 1.0.2
  repository: https://stakater.github.io/stakater-charts/
  alias: restful-distributed-lock-manager
```

### Hard-coded-values

Below are hard coded values for Jenkins and it's dependencies.
**NOTE** All credentials used here are not real. Please get the latest credentials before using these hard coded values.

#### configmap values

Update the external-docker-registry-url and set it’s value equals to the docker repository url attached with nexus.

```yaml
external-docker-registry-url: docker.release.stakater.com:443
```

#### xposer values

Update the domain and set it’s value equals to the your domain
```yaml
domain: stakater.com
```

#### secrets values

1. Update this `jenkins-docker-cfg` secret and update the data in `config.json` containing docker repository url of nexus.
2. Update this `jenkins-maven-settings` secret and update the data in `settings.xml` containing docker repository url of nexus.
3. Update this `docker-registry-secret` secret and update the data in `.dockercfg` containing docker repository url of nexus.
4. Update this `k8s-current-cluster-kubeconfig` secret and update the data in `config` containing the kube config of cluster.

#### Jenkins values

Update below values in Jenkins chart.

1. Update the storage class name

```yaml
jenkins:
  Persistence:
    Enabled: true
    StorageClass: efs
```

2. Update the HostName value

```yaml
jenkins:
  Master:
    HostName: jenkins.release.stakater.com
```

3. Update the ingress annotations and TLS host name

```yaml
jenkins:
  Master:
    Ingress:
      Annotations:
        ingress.kubernetes.io/force-ssl-redirect: "true"
        kubernetes.io/ingress.class: external-ingress
        ingress.kubernetes.io/proxy-body-size: 150m
        forecastle.stakater.com/expose: "true"
        forecastle.stakater.com/icon: https://github.com/stakater/ForecastleIcons/raw/master/jenkins.png
      TLS:
      - hosts:
        - jenkins.release.stakater.com
```

4. Update the keyclaok realm settings. Get the `clientSecret` from team lead.

```yaml
jenkins:
  Master:
    SecurityRealm: |-
      <securityRealm class="org.jenkinsci.plugins.oic.OicSecurityRealm" plugin="oic-auth@1.0">
        <clientId>stakater-online-platform</clientId>
        <clientSecret>testsecret</clientSecret>
        <tokenServerUrl>https://keycloak.release.stakater.com/auth/realms/stakater/protocol/openid-connect/token</tokenServerUrl>
        <authorizationServerUrl>https://keycloak.release.stakater.com/auth/realms/stakater/protocol/openid-connect/auth</authorizationServerUrl>
        <userNameField>email</userNameField>
        <scopes>openid email</scopes>
      </securityRealm>
```

### Plugins

Below is the list of plugins needed for Jenkins to work properly. Add these under `InstallPlugins` in `values.yaml`

```yaml
- git:3.9.1
- oic-auth:1.4
- github:1.29.2
- github-pullrequest:0.2.4
- github-oauth:0.29
- github-api:1.92
- github-branch-source:2.4.1
- github-issues:1.2.4
- workflow-multibranch:2.20
- pipeline-model-api:1.3.2
- pipeline-stage-step:2.3
- workflow-cps-global-lib:2.11
- pipeline-github-lib:1.0
- kubernetes:1.12.6
- kubernetes-pipeline-steps:1.5
- kubernetes-pipeline-aggregator:1.5
- workflow-basic-steps:2.11
- jdk-tool:1.1
- jackson2-api:2.8.11.3
- blueocean-pipeline-api-impl:1.8.4
- pipeline-utility-steps:2.1.0
- gitlab-plugin:1.5.10
- gitlab-merge-request-jenkins:2.0.0
- job-dsl:1.70
- cloudbees-folder:6.6
- authorize-project:1.3.0
- gitlab-hook:1.4.2
- pipeline-stage-view:2.10
- ssh-agent:1.17
- ssh:2.6.1
- ssh-credentials:1.14
- ssh-steps:1.1.1
- rich-text-publisher-plugin:1.4
- timestamper:1.8.10
```

### Jobs

Below are the Jenkin Jobs that we use in stakater. [Here](#Post-Installation-Configurations) is the procedure to configure these jobs.

```text
carbook-gitlab-config   =  Multibranch Pipeline = Gitlab Pipeline

developer-handbook      =  Multibranch Pipeline = Github Pipeline

Stackator Input         =  Organization         = Github Pipeline

Stakater                =  Organization         = Github Pipeline

Stakater Charts         =  Organization         = Github Pipeline  

Stakater Docker         =  Organization         = Github Pipeline

Stakater Lab            =  Organization         = Github Pipeline
```

### Credentials

1. Gitlab
    1. gitlab token: Create gitlab token and use that token as GitLab API token while creating credentials in `Manage Jenkins`
    2. carbook.bot:  Create jenkins username with password credentials and use carbook.bot as username and credentials id. Get password from team lead. These credentials will be used when creating Multibranch Pipeline for gitlab
2. Github
    1. stakater-user: Generate new github credentials of stakater-user or reuse existing credentials. And use these as secret-text in jenkins credentials. These will be used while configuring github in Manage Jenkins
    2. testsecret: Use the secret that is being used in github repos for webhook authentication for Shared secret