# StakaterPlatform

## Overview 
Kick-start your kubernetes cluster with Stakater Platform. A consolidated solution for logging, tracing, monitoring, delivery, security and much more.

Stakater Platform consist of 7 stacks;
- [Control](https://playbook.stakater.com/content/stacks/control.html)
- [Delivery](https://playbook.stakater.com/content/stacks/delivery.html)
- [Logging](https://playbook.stakater.com/content/stacks/logging.html)
- [Monitoring](https://playbook.stakater.com/content/stacks/monitoring.html)
- [Security](https://playbook.stakater.com/content/stacks/security.html)
- [Alerting](https://playbook.stakater.com/content/stacks/alerting.html)
- [Tracing](https://playbook.stakater.com/content/stacks/tracing.html)

## Why StakaterPlatform ?

StakaterPlatform gives you a head start for managing your kubernetes cluster by providing open source tools across seven 
stacks so that you are only concerned about developing your applications, StakaterPlatform will take care of the rest.


## Workflow

StakaterPlatform works on GitOps principle using an opensource tool [Flux](https://github.com/fluxcd/flux) which makes sure that cluster is always in the desired state by tracking a git repository. To make changes in your cluster, commit your changes in the git repository and the changes will be reflected in the kubernetes cluster.


## Prerequisites

- Kubernetes cluster with at least 8 VCPUS & 32 GB of RAM
- kubectl (between v1.11 & v1.15.3)
- helm (v2.15.0 or lower)
- A working domain (e.g. `stakaterplatform.com` ) 
- SSL Certificate for that domain

## Install via local machine

1. [Duplicate](https://help.github.com/en/github/creating-cloning-and-archiving-repositories/duplicating-a-repository#mirroring-a-repository) this [repository](https://github.com/stakater/stakaterplatform).
2. Update [configuration variables](#Basic-Configuration) in `variables.config` file and provide the relevant values.
3. [Recommended but optional] To take full advantage of the tool stack configure [Additional Variables](docs/detailed-config.md) as well.
4. Ensure that correct context is set for kubectl & helm.
5. run `make configure`, this will make all required substitutions based on configuration variables in the repository. When prompted commit those changes.
6. [Add the public SSH key](https://help.github.com/en/github/authenticating-to-github/adding-a-new-ssh-key-to-your-github-account) of flux(configs/flux.pub) to your Git repository with **write access**.
7. Once changes are committed, run `make deploy` this will deploy flux, which will in turn deploy StakaterPlatform via GitOps. Estimated time for everything to be up and running is 5-10 
9. Use the printed dashboard token to access the Kubernetes dashboard at `dashboard-control.YOURDOMAINNAME`
10. Visit `https://forecastle-control.YOURDOMAINNAME` and you'll be able to view all applications deployed by StakaterPlatform.


**Note:** Since `variables.config` file and `configs/` directory contains private information those files are not being
 tracked in git and won't/shouldn't be committed. In case you want to commit those changes run `make track-secrets`.

## Install via GitLab CI Pipeline

1. [Duplicate](https://help.github.com/en/github/creating-cloning-and-archiving-repositories/duplicating-a-repository#mirroring-a-repository) this [repository](https://github.com/stakater/stakaterplatform) in a GitLab account.
2. Update [configuration variables](#Basic-Configuration) in `variables.config` file and provide the relevant values.
3. Create a [Personal Access Token](https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html#creating-a-personal-access-token) on GitLab and note down Personal Access Token (Available only when created)
4. Configure CI/CD Environment variables in `<Your GitLab Project> -> Settings -> CI/CD`.
5. Add Following variables for the pipeline

| Pipeline Variables | Description |  
|:---|:---|
| KUBE_CONFIG | `Base64 encoded` KubeConfig of the kubernetes cluster you want to deploy on |
| REPO_ACCESS_TOKEN | Personal access token generated in Step 3 |
| TARGET | Make file target. Value: `pipeline-deploy` |
| AWS_ACCESS_KEY_ID | (Define only if `CLOUD_PROVIDER` is `aws`) AWS Access Key Id. |
| AWS_SECRET_ACCESS_KEY | (Define only if `CLOUD_PROVIDER` is `aws`) AWS Secret Access Key. |

6. [Add the public SSH key](https://docs.gitlab.com/ee/ssh/#per-repository-deploy-keys)(Deploy Keys) to your GitLab account with **write access** printed at the end of pipeline logs.
7. Once key is added StakaterPlatform will deploy on your cluster (Estimated time: 10-15 minutes). :confetti_ball: :confetti_ball:
8. Use the printed dashboard token to access the Kubernetes dashboard at `dashboard-control.DOMAIN`

## Verification

### Locally
Run `make verify` to run tests to ensure that all the relevant endpoints are up and running.

### GitLab CI
Run pipeline with Pipeline variable: `TARGET` = verify 

## Basic Configuration
| Variables | Description | Default |  
|:---|:---|:---:|
| CLOUD_PROVIDER | Name of the k8s cloud provider | `nil` <br> (`aws` \| `azure`) |
| DNS_PROVIDER | Cloud DNS Provider | `aws` (Route53) |
| EXTERNAL_DNS_AWS_ACCESS_KEY_ID | AWS Access Key Id having access to create/delete/update Route53 HostedZone entries | `nil` |
| EXTERNAL_DNS_AWS_SECRET_ACCESS_KEY | AWS Secret Access Key having access to create/delete/update Route53 HostedZone entries | `nil` |
| DOMAIN | Domain to use for StakaterPlatform | `nil` |
| BASE64_ENCODED_SSL_CERTIFICATE_CA_CRT | Base64 encoded Intermediate Certificate value | `nil` |
| BASE64_ENCODED_SSL_CERTIFICATE_TLS_CRT | Base64 encoded Server Certificate value |`nil` |
| BASE64_ENCODED_SSL_CERTIFICATE_TLS_KEY | Base64 encoded Certificate Key value |`nil` |
| STAKATER_PLATFORM_SSH_GIT_URL | SSH URL for your Github repo. | `nil`<br>(e.g `git@github.com/stakater/StakaterPlatform.git`. Notice `:` is replaced with `/` in the URL ) |
| STAKATER_PLATFORM_BRANCH | Branch to use for `STAKATER_PLATFORM_SSH_GIT_URL` | `master` |


For generating certificates view: [Creating & using custom SSL certificates](https://playbook.stakater.com/content/processes/exposing/create-use-tls-custom-cert.html)


## Detailed Configuration and Stack definitions

To take full advantage of our tool stack, it is recommended to have the following things set-up:
1. 3 Slack channels with [webhook's](https://slack.com/intl/en-pk/help/articles/115005265063-Incoming-WebHooks-for-Slack) added. These are required for:
    * Dev-notifications: Notifications regarding up/down time and regarding new builds from jenkins
    * infra-alerts: Alerts from infrastructure
    * apps-alerts: Alerts for apps
2. An account at (Uptime Robot)[https://uptimerobot.com/] for (IMC)[https://github.com/stakater/IngressMonitorController] 
to work and provide you with up/down time alerts. For other supported down time monitors visit https://github.com/stakater/IngressMonitorController#supported-uptime-checkers


### Global Variables
| Variables | Description | Default |  
|---|---|---|
| CLOUD_PROVIDER | Name of the k8s cloud provider | `nil` <br> (`aws` \| `azure`) |
| DNS_PROVIDER | Cloud DNS Provider | `aws` (Route53) |
| EXTERNAL_DNS_AWS_ACCESS_KEY_ID | AWS Access Key Id | `nil` |
| EXTERNAL_DNS_AWS_SECRET_ACCESS_KEY | AWS Secret Access Key | `nil` |
| DOMAIN | Domain to expose StakaterPlatform | `nil` |
| BASE64_ENCODED_SSL_CERTIFICATE_CA_CRT | Base64 encoded Intermediate Certificate value | `nil` |
| BASE64_ENCODED_SSL_CERTIFICATE_TLS_CRT | Base64 encoded Server Certificate value |`nil` |
| BASE64_ENCODED_SSL_CERTIFICATE_TLS_KEY | Base64 encoded Certificate Key value |`nil` |
| STAKATER_PLATFORM_SSH_GIT_URL | SSH URL for your Github repo. | `nil`<br>(e.g `git@github.com/stakater/StakaterPlatform.git`. Notice `:` is replaced with `/` in the URL ) |
| STAKATER_PLATFORM_BRANCH | Branch to use for `STAKATER_PLATFORM_SSH_GIT_URL` | `master` |

### KeyCloak
| Variables | Description | Default |  
|---|---|---|
| KEYCLOAK_CLIENT_ID | Client ID for KeyCloak Gatekeeper  | `stakater-online-platform` |
| KEYCLOAK_CLIENT_SECRET | Client Secret for KeyCloak Gatekeeper | `1ce66f91-2068-4f3d-9578-f03fa8259230` |
| KEYCLOAK_DEFAULT_USERNAME | Username for the default user created |`stakater-user` |
| KEYCLOAK_DEFAULT_PASSWORD | Password for the default user created |`zUPaZnEfmYpcdd6X` |
| KEYCLOAK_DB_USER | KeyCloak DB (Postgresql) username |`admin` |
| KEYCLOAK_DB_PASSWORD | KeyCloak DB (Postgresql) password |`L3VT3hBysLGtsJaZ` |
| KEYCLOAK_PASSWORD | Password for the admin user `stakater` |`vuHBBDaVsS35jvF9` |

### IngressMonitorController IMC

| Variables | Description | Default |  
|---|---|---|
| IMC_API_KEY | API key of the monitor service provider |`nil` |
| IMC_ALERT_CONTACTS | Alert contacts for the monitor service provider |`nil` |

### Nexus
| Variables | Description | Default |  
|---|---|---|
| NEXUS_ADMIN_ACCOUNT_USER | Username for admin account |`nexus-admin` |
| NEXUS_ADMIN_ACCOUNT_PASSWORD | Password for admin account |`L8TcnrwMytCFpAFe` |
| NEXUS_CLUSTER_ACCOUNT_USER | Username for cluster admin account |`nexus-cluster-admin` |
| NEXUS_CLUSTER_ACCOUNT_PASSWORD | Password for cluster admin account |`mrzUGWrD9buDYhMF` |

### Jenkins
| Variables | Description | Default |  
|---|---|---|
| JENKINS_NOTIFICATIONS_SLACK_CHANNEL | Slack channel name to notify for jenkins pipeline result |`OPTIONAL` (e.g. `#slack-channel-name`) |
| JENKINS_NOTIFICATIONS_SLACK_WEBHOOK_URL | Slack webhook URL to notify for jenkins pipeline result |`OPTIONAL` |
| JENKINS_PIPELINE_GITHUB_TOKEN | GitHub API token. If configured Pipeline will comment on Pull Requests |`OPTIONAL` |
| JENKINS_PIPELINE_GITLAB_TOKEN | GitLab API token. If configured Pipeline will comment on Pull Requests |`OPTIONAL` |
| JENKINS_PIPELINE_BITBUCKET_TOKEN | BitBuckt API token. If configured Pipeline will comment on Pull Requests  |`OPTIONAL` |
| JENKINS_DOCKER_MAVEN_USERNAME | Maven repository used by Jenkins to store maven artifiacts |`admin` |
| JENKINS_DOCKER_MAVEN_PASSWORD | Maven repository used by Jenkins to store maven artifiacts |`xJuAWjG4GzrCkPJU` |
| JENKINS_LOCAL_NEXUS_USERNAME | Local repository used by Jenkins to store artifiacts |`admin` |
| JENKINS_LOCAL_NEXUS_PASSWORD | Local repository used by Jenkins to store artifiacts | `LXwEkC4jZzQj3DHY` |
| JENKINS_NEXUS_USERNAME | Nexus Username. Used by docker command in Jenkins Pipeline | `admin` |
| JENKINS_NEXUS_PASSWORD | Nexus Password. Used by docker command in Jenkins Pipeline | `CN3B6uY998kpBFDd` |
 
### AlertManager
| Variables | Description | Default |  
|---|---|---|
| SLACK_INFRA_ALERTS_CHANNEL | Slack channel name to send Alertmanager infrastructure alerts |`#stakater-platform-infra-alerts` |
| SLACK_INFRA_ALERTS_WEBHOOK_URL | Slack channel webhook URL to send Alertmanager infrastructure alerts |`OPTIONAL` |
| SLACK_APPS_ALERTS_CHANNEL | Slack channel webhook URL to send Alertmanager application alerts |`#stakater-platform-apps-alerts` |
| SLACK_APPS_ALERTS_WEBHOOK_URL | Slack channel name to send Alertmanager application alerts |`OPTIONAL` |

### Grafana
| Variables | Description | Default |  
|---|---|---|
| GRAFANA_USERNAME | Grafana dashboard username |`admin` |
| GRAFANA_PASSWORD | Grafana dashboard password |`CN3B6uY998kpBFDd` |


### Flux
In directory `configs`, SSH keys flux(private) & flux.pub(public) exist which flux uses for GitOps. You can provide, paste content of, your own SSH keys there. Else, a new unique key pair will be generated every time for you. 


## Uninstall

Run `make destroy` to remove StakaterPlatform from your cluster.


## Production Configuration and Hardening

- Change default usernames and passwords for all tools (`variables.config`)
- Add your own SSH keys for flux
- Use Identity Providers (e.g. Google, Active Directory etc.) and configure keyCloak to use that
- Replace all secrets with sealed-secrets. [Stakater Workshop - Sealed Secrets](https://playbook.stakater.com/content/workshop/sealed-secrets/introduction.html)
- Use keycloak for SSO over all exposed applications

## Compatibility Matrix

StakaterPlatform has been tested on following kubernetes flavors:

| Platform Version| K8s Version  | Infrastructure |
|---|---|---|
| v0.0.1 | 1.14 | [![image](./image/eks.png)](https://aws.amazon.com/eks/) &nbsp; eks.6 |
| v0.0.1 | 1.14.8 | [![image](./image/aks.png)](https://docs.microsoft.com/en-us/azure/aks/) &nbsp; aks |


## Community

If you have questions, check the [Documentation](https://playbook.stakater.com/content/stacks/stakaterplatform.html) and
 talk to us on slack [#community on Stakater Slack](https://stakater.slack.com/messages/community).
 
Click [here](https://slack-inviter.stakater.com) to join [Stakater](https://stakater.com) on Slack.


## Useful Resources

[Stakater Platform](https://playbook.stakater.com/content/stacks/stakaterplatform.html)

[Create Slack Webhook](https://playbook.stakater.com/content/processes/monitoring/creating-hooks-slack.html)

[Configuring Kibana](https://playbook.stakater.com/content/processes/logging/configure-kibana.html)

[Keycloak](https://playbook.stakater.com/content/processes/security/keycloak.html)

[Creating & using custom SSL certificates](https://playbook.stakater.com/content/processes/exposing/create-use-tls-custom-cert.html)

[Excerpts of useful knowledge based on our teams learning](https://github.com/stakater/til)
