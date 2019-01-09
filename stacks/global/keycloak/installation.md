# Installation and Dependencies of Keycloak

## Installation Steps

1. Most of the times keycloak will be deployed from pipeline of [this](https://github.com/stakater/stakaterkubehelmglobal) repository. It will have updated configurations and dependencies for keycloak.
2. We can also install it manually (not recommended). To install keycloak manually, clone [this](https://github.com/stakater/stakaterkubehelmglobal) repo and you can run the make targets of repo containing latest used implementation of keycloak. This will install all dependencies and keycloak as well.
    1. Clone this repository
    2. Update the hard coded values mentioned [here](#Hard-coded-values)
    3. Update the `requirements.yaml` and comment out non-required dependencies. To view dependencies of keycloak, follow [this](#Dependencies) guideline.
    4. Run this command. `make install CHART_NAME=global`
3. Verify from UI that keycloak pod is running and accessible.

## Dependencies

Below are the dependencies to install keycloak

```yaml
- name: keycloak
  version: 4.0.1
  repository: https://kubernetes-charts.storage.googleapis.com/
  alias: keycloak

- name: postgresql
  version: 2.6.0
  repository: https://kubernetes-charts.storage.googleapis.com
  alias: postgresql

- name: configmap
  version: 1.0.1
  repository: https://stakater.github.io/stakater-charts/
  alias: keycloak-configmap

- name: xposer
  version: 0.0.3
  repository: https://stakater.github.io/stakater-charts 
  alias: xposer

- name: secrets
  version: 1.0.2
  repository: https://stakater.github.io/stakater-charts 
  alias: secrets
```

## Hard-coded-values

Below are hard coded values for keycloak and it's dependencies.
**NOTE** All credentials used here are not real. Please get the latest credentials before using these hard coded values.

### Keycloak

Below are hard coded values for keycloak image and pullSecret.

```yaml
  keycloak:
    replicas: 1
    image:
      repository: jboss/keycloak
      tag: 4.5.0.Final
      pullPolicy: IfNotPresent
      pullSecrets:
      - name: dockerconfig
```

Below are hardcoded values for persistence. We are deploying postgresql seperately and not as part of keycloak chart. So achieve that deployPostgres is false and dbVendor is postgres. We are getting postgresql credentials from a secret and here are are giving that secret name and key. dbHost is the service name of posgresql to connect postgresql.

```yaml
keycloak:
persistence:
    deployPostgres: false
    dbVendor: postgres
    existingSecret: "keycloak-secrets"
    existingSecretKey: db.password
    dbName: keycloak-db
    dbHost: stakater-global-postgresql.global
    dbPort: 5432
    dbUser: keycloak
```

Below are the extra containers and environment variables that are used in keycloak. `KEYCLOAK_USER` and `KEYCLOAK_PASSWORD` have fake values, update these before using it.

```yaml
keycloak:
  extraArgs: >
    -Djgroups.bind_addr=global
    -Dkeycloak.migration.action=import
    -Dkeycloak.migration.provider=singleFile
                -Dkeycloak.migration.file=/opt/jboss/keycloak/standalone/configuration/import/stakater-realm.json
    -Dkeycloak.migration.strategy=IGNORE_EXISTING

  extraEnv: |
    - name: OPERATING_MODE
      value: standalone
    - name: HIDE_OPENSHIFT_BTN
      value: "true"
    - name: HIDE_GITHUB_BTN
      value: "false"
    - name: PROXY_ADDRESS_FORWARDING
      value: "true"
    - name: K8S_API_SERVER
      value: http://kubernetes
    - name: AUTH_URL
      value: http://auth
    - name: KEYCLOAK_URL
      value: http://keycloak
    - name: KEYCLOAK_USER
      value: testuser
    - name: KEYCLOAK_PASSWORD
      value: "testpassword"

      ## Add additional volumes and mounts, e. g. for custom themes
  extraVolumes: |
    - name: keycloak-config
      configMap:
        name: keycloak-configmap
        items:
          - key: stakater-realm.json
            path: stakater-realm.json
    - name: data
      emptyDir: {}
  extraVolumeMounts: |
    - name: keycloak-config
      mountPath: /opt/jboss/keycloak/standalone/configuration/import/stakater-realm.json
      subPath: stakater-realm.json
    - name: data
      mountPath: /opt/jboss/keycloak/standalone/deployments
```

Below are fluentd pod annotations

```yaml
keycloak:
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
```

Below are service labels and annotations to expose keycloak

```yaml
keycloak:
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
      config.xposer.stakater.com/Domain: stakater.com
      config.xposer.stakater.com/IngressNameTemplate: '{{.Service}}'
      config.xposer.stakater.com/IngressURLTemplate: 'keycloak.{{.Namespace}}.{{.Domain}}'
```

### Postgresql

Update db name for postgresql to be used in keycloak

```yaml
postgresql:  
  postgresqlDatabase: 'keycloak-db'
```

Update the persistence values. `helm.sh/resource-policy: keep` makes sure that the volume does not gets deleted even if we delete keycloak and postgresql.

```yaml
postgresql: 
  persistence:
    enabled: true
    storageClass: "efs"
    accessModes:
      - ReadWriteOnce
    size: 10Gi
    annotations:
      helm.sh/resource-policy: keep
```

Update database credentials for postgresql. `postgresqlUsername` and `postgresqlPassword` have fake values, update these before using it.

```yaml
postgresql:
    postgresqlUsername: testUsernam
    postgresqlPassword: testPassword
```

### Secrets

Add two secrets for keycloak using secrets chart. These secrets have fake values, update these before using it.

```yaml
secrets:
    Secrets:
    -   name: keycloak-secrets
        data:
            db.user: test
            db.password: test
        type: Opaque
    -   name: dockerconfigjson
        data:
            .dockerconfigjson: |-
                {
                  "auths": {
                    "testurl:443": {
                      "auth": "testsecret"
                    }
                  }
                }
        type: kubernetes.io/dockerconfigjson
```

### Keycloak-configmap

Add the realm configuration in a configmap for keycloak. All credentials used here are fake. Get the latest credentials before using this. `secret`,`clientId` and `clientSecret` have fake values, update these before using it. You can also create new credentials by following below mentioned steps

1. Create a project in google developer console and generate client secret and client id. Follow steps mentioned [here](https://github.com/stakater/til/blob/master/keycloak/setup-google-idp-with-keycloak.md) and [here](https://www.keycloak.org/docs/3.0/server_admin/topics/identity-broker/social/google.html) to do that.
2. Update the client secret and client id values in identity provider settings either from UI or in realm configmap.

```yaml
keycloak-configmap:
  ConfigMapName: "keycloak-configmap"
  Data:
    stakater-realm.json: |-
      {
        "realm": "stakater",
        "enabled": true,
        "loginTheme": "keycloak",
        "sslRequired": "external",
        "accessTokenLifespan" : 2592000,
        "accessTokenLifespanForImplicitFlow" : 1296000,
        "ssoSessionIdleTimeout" : 2592000,
        "accessCodeLifespanUserAction" : 36000,
        "accessCodeLifespanLogin" : 2592000,
        "ssoSessionMaxLifespan" : 2592000,
        "offlineSessionIdleTimeout" : 2592000,
        "accessCodeLifespan" : 60,
        "clients": [
          {
            "clientId": "stakater-online-platform",
            "enabled": true,
            "standardFlowEnabled": true,
            "implicitFlowEnabled": false,
            "directAccessGrantsEnabled": true,
            "authorizationServicesEnabled" : true,
            "fullScopeAllowed": true,
            "serviceAccountsEnabled": true,
            "clientAuthenticatorType": "client-secret",
            "secret": "12345-1234-abcd-1234-abcd12345",
            "publicClient" : true,
            "adminUrl" : "",
            "baseUrl" : "",
            "redirectUris": [
              "http://localhost:8080/api/login/*",
              "http://auth/*",
              "*",
              "http://stakater-global-keyc-http.global/*"
            ],
            "webOrigins": [
              "*"
            ],
            "defaultRoles": ["uma_protection"],
            "authorizationSettings" : {
              "allowRemoteResourceManagement" : true,
              "policyEnforcementMode" : "ENFORCING",
              "scopes" : [ {
                "name" : "read:space"
                }, {
                "name" : "admin:space"
              } ]
            }
          },
          {
            "clientId": "che",
            "enabled": true,
            "redirectUris": [
              "*"
            ],
            "implicitFlowEnabled": false,
            "directAccessGrantsEnabled": true,
            "publicClient": true,
            "protocol": "openid-connect",
            "fullScopeAllowed": true
          }
        ],
        "users": [{
            "username": "service-account-stakater-online-platform",
            "enabled": true,
            "totp": false,
            "emailVerified": false,
            "email": "service-account-stakater-online-platform@placeholder.org",
            "serviceAccountClientId": "stakater-online-platform",
            "credentials": [],
            "disableableCredentialTypes": [],
            "requiredActions": [],
            "realmRoles": ["offline_access", "uma_authorization"],
            "clientRoles": {
              "realm-management": ["view-users", "manage-authorization"],
              "broker": ["read-token"],
              "stakater-online-platform": ["uma_protection"],
              "account": ["manage-account", "view-profile"]
            },
            "groups": []
        }],
        "clientScopeMappings": {
          "realm-management": [
              {
                  "client": "stakater-online-platform",
                  "roles": ["view-users"]
              },
              {
                  "client": "stakater-online-platform",
                  "roles": ["manage-authorization"]
              }
          ],
          "broker": [
              {
                  "client": "stakater-online-platform",
                  "roles": ["read-token"]
              }
          ]
        },
        "roles" : {
          "realm" : [
            {
              "name": "read:space",
              "description": "Read space"
            },
            {
              "name": "admin:space",
              "description": "Admin space"
            }
          ]
        },
        "identityProviders": [
          {
            "alias": "google",
            "providerId": "google",
            "enabled": true,
            "updateProfileFirstLoginMode": "on",
            "trustEmail": true,
            "storeToken": true,
            "addReadTokenRoleOnCreate": true,
            "config": {
              "hideOnLoginPage": false,
              "clientId": "12345-1234-abcd-1234-abcd12345.apps.googleusercontent.com",
              "disableUserInfo": "",
              "userIp": "false",
              "clientSecret": "abcdef123456789",
              "useJwksUrl": "true"
            }
          }
        ]
      }
```