# Keycloak

Keycloak is an Open Source Identity and Access Management solution. It provides an easy way to add authentication including Single Sign-on to applications and services with minimum effort. Keycloak handles persistence and user authentication all out of the box.

Instead of having to login to individual applications, users authenticate with Keycloak rather than individual applications. This means that the individual applications don’t have to implement their own login forms, authentication, and storage of users and sessions. Once logged-in to Keycloak, users don’t have to login again to access a different application. And similarly once logged-out from Keycloak, users don’t have to log out of individual applications. Enabling login with social networks is also easy. The configuration for these can be added via Keycloak’s admin console. No code or changes are required to individual applications.

Keycloak supports OpenID Connect and SAML protocols. OpenID Connect (OIDC) is an extension of the OAuth 2 authentication protocol. While OAuth 2.0 is a framework for building authorization protocols, and OIDC is the full implementation of a authentication and authorization protocol. SAML 2.0 is similar to OIDC but a lot older and consequently more mature. It has its roots in SOAP and works by exchanging XML documents between the authentication server and the application, so it tends to be a bit more verbose than OIDC. In most cases OIDC is recommended by Keycloak.

## Setup

A [stable chart](https://github.com/helm/charts/tree/master/stable) for keycloak is available in the official [public helm chart repository](https://kubernetes-charts.storage.googleapis.com/). The chart deploys a StatefulSet for Keycloak and also includes a deployment of PostgreSQL which it uses as the database for Keycloak. The chart can also be configured to use an external instance of PostgreSQL instead of the bundled deployment, such as AWS RDS.

Going by the philosophy of GitOps and maintaining all our configuration in code, we use a json file to configure our keycloak realm and import it into keycloak at deployment time. Following is an example configuration of the Keycloak chart. While the standalone operating mode is not recommended for a production setup as it becomes a single point of failure for applications, the example is show for a standalone operating mode to keep things simple while introducing the rest of the required configuration. The realm json is loaded into a configmap and then referenced in the Keycloak chart through the configmap.

```yaml
replicas: 1

image:
  repository: jboss/keycloak
  tag: 4.8.3.Final
  pullPolicy: IfNotPresent

persistence:
  # If true, the Postgres chart is deployed
  deployPostgres: false

# The database vendor. Can be either "postgres", "mysql", "mariadb", or "h2"
  dbVendor: postgres

## The following values only apply if "deployPostgres" is set to "false"

# Specifies an existing secret to be used for the database password
  existingSecret: "keycloak-secrets"
  # The key in the existing secret that stores the password
  existingSecretKey: database.password

dbName: kc-database
  dbHost: keycloak-postgresql.rds
  dbPort: 5432
  dbUser: keycloak

extraArgs: >
  -Djgroups.bind_addr=global
  -Dkeycloak.migration.action=import
  -Dkeycloak.migration.provider=singleFile
  -Dkeycloak.migration.file=/opt/jboss/keycloak/standalone/configuration/import/realm.json
  -Dkeycloak.migration.strategy=IGNORE_EXISTING

## Allows the specification of additional environment variables for Keycloak
 extraEnv: |
  - name: OPERATING_MODE
  value: standalone

## Add additional volumes and mounts, e. g. for custom themes
 extraVolumes: |
  - name: keycloak-config
  configMap:
   name: keycloak-configmap
   items:
   - key: realm.json
    path: realm.json
 extraVolumeMounts: |
  - name: keycloak-config
  mountPath: /opt/jboss/keycloak/standalone/configuration/import/realm.json
  subPath: realm.json

podAnnotations:
  fluentdConfiguration: >
  [
   {
    "containers":
    [
     {
      "expression": "/^\\S*\\s-\\s-\\s\\[(?<time>\\S*)[\\S\\s]*\\]\\s(?<message>[\\S\\s]*)/",
      "expressionFirstLine": "/^\\:\\:f{4}:[0-9]+.[0-9]+\\.[0-9]+\\.[0-9]+/",
      "timeFormat": "%d/%b/%Y:%H:%M:%S",
      "containerName": "keycloak"
     }
    ]
   }
  ]

service:
  labels:
  expose: "true"
  port: 80
  annotations:
  xposer.stakater.com/annotations: |-
   kubernetes.io/ingress.class: external-ingress
   ingress.kubernetes.io/force-ssl-redirect: true
   forecastle.stakater.com/expose: true
   forecastle.stakater.com/icon: https://www.keycloak.org/resources/images/keycloak_logo_480x108.png
   forecastle.stakater.com/appName: keycloak
   exposeIngressUrl: globally
  config.xposer.stakater.com/Domain: company.com
  config.xposer.stakater.com/IngressNameTemplate: '{{.Service}}'
  config.xposer.stakater.com/IngressURLTemplate: 'keycloak.{{.Namespace}}.{{.Domain}}'
```

The postgresql details are provided in the persistence section including the server details, database username and password (referenced from a kubernetes secret).

The realm json is loaded from the configmap into a volume, under extraVolumeMounts, which is mounted in Keycloak. In the extraArgs of the Keycloak container we specify the path of the mounted realm json which we want to import.

```yaml
keycloak-configmap:
  ConfigMapName: "keycloak-configmap"
  Data:
    realm.json: |-
      {
        "realm": "stakater",
        "enabled": true,
        "loginTheme": "keycloak",
        "sslRequired": "external",
         ...
      }
```

The operating mode is specified with the environment variables under extraEnv of the container.

It is necessary to create or obtain a client configuration for any application to be able to use Keycloak. You usually configure a new client for each new application hosted on a unique host name. When an application interacts with Keycloak, the application identifies itself with a client ID so Keycloak can provide a login page, single sign-on (SSO) session management, and other services.

The traditional method in the OAuth2 specification for authentication is to use a client id and secret. The client has a secret, which needs to be known to both the application and the Keycloak server. You can generate the secret for a particular client in the Keycloak administration console or then specify the secret in the keycloak realm json.

**Note:** It's recommended to whitelist keycloak URLs containing the slugs `/auth/admin` and `/auth/realms/master/protocol/openid-connect`. These URLs should only be accessible to the admins. We use nginx to restrict access [nginx-restrict-service-access](https://github.com/stakater/til/blob/master/nginx-ingress/restrict-service-access-by-ip-whitelisting.md)

## KeyCloak with Identity Providers

Follow the following steps to harden the KeyCloak authentication by using Open ID Connect (OIDC) plugin to autheticate users via authetication service.

### Google

1. Open https://console.developers.google.com and select your project.
2. Open credentials tab from lab navigation bar
3. Open `OAuth consent screen` tab and select Application type, give application name and add your authorized domain. In our case, it is `stakater.com`
4. Open `Credentials` tab and create `OAuth 2.0 client IDs`. Give your `Authorized redirect URIs`. In stakater's case it is https://keycloak.tools.stakater.com/auth/realms/stakater/broker/google/endpoint
Here is how to build this url
    - https://keycloak.tools.stakater.com is your external url for keycloak.
    - `stakater` is your realm name.
5. Enable api for `google+` by searching it from top search bar in google console.
6. Add `google` authentication provider in KeyCloak using this [link](https://www.keycloak.org/docs/6.0/server_admin/index.html#google)
7. After performing these steps, update the `clientId` and `clientSecret` with newly created `OAuth 2.0 client IDs` of your google identity provider in keycloak.
8. If you face `Invalid parameter: redirect_uri` or `URI mismatch` when authenticating with google, please make sure
    - You have correct `clientId` and `clientSecret` of google idp.
    - Your keycloak client has `Valid Redirect URIs`. It must contain the internal endpoint keycloak service.
    - Your `Authorized redirect URIs` in google console has valid uris.

### Azure Active Directory

Follow [this](https://docs.microsoft.com/en-us/azure/aks/azure-ad-integration#deploy-cluster) tutorial if you want to deploy Azure Active directory with Azure Kubernetes Service AKS

1. Create Users in Azure using the Administrator account using [this](https://docs.microsoft.com/en-us/azure/active-directory/fundamentals/add-users-azure-active-directory). The new Users will be shown as source *Azure Active Directory* as below

![Diagram](./image/add-users-ad.png)

2. Go to your Azure AD instance, select *App Registrations* on the left panel and click *Endpoints* on the top panel displayed. Copy values for *OAuth 2.0 authorization  endpoint (v2)* and *OAuth 2.0 token endpoint (v2)* values. these will be used in the Keycloak configurations.

3. Go to your Azure AD instance, select *App Registrations* on the left panel and Select Azure AD Client Application created when Azure Active directory was created. Copy the *Application (client) ID*. Click *Certificates and Secrets* from the left panel and click *New Client Secret* button and create a new secret. Copy the value of the secret.

4. After the users are created open Keycloak administrative console and Select Identity Providers in the left panel.

5. Click on the Add Provider drop down and select OpenID Connect v1.0 

6. Fill in the Options as below:
  
    * alias: azure-ad
    * Display Name: Microsoft Azure AD
    * First login flow: first broker login
    * Authorization URL: (*OAuth 2.0 authorization  endpoint (v2)*)
    * Token URL: (*OAuth 2.0 token endpoint (v2)*)
    * Client ID: (*Application (client) ID*) from step 3
    * Client secret: client secret from step 3
    * Prompt: unspecified

7. Click Save to create the OIDC type Identity Provider.

8. Copy the Redirect URI form the created Identity Provider. In Azure AD instance go to App Registration, Select AD Client application, select Authentication, and paste this URI in Redirect URI field and type Web and click the add button to add.

![Diagram](./image/redirect-URI.png)

9. Open application in browser to test Keycloak is working fine with Azure AD.


