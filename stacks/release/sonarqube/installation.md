# Installation and Dependencies for Sonarqube:

## Installation Steps

Most of the times sonarqube will be deployed from pipeline of [this](https://github.com/stakater/stakaterkubehelmRelease) repository. It will have updated configurations and dependencies for sonarqube. But we can also install it manually (not recommended). To install sonarqube manually, clone [this](https://github.com/stakater/stakaterkubehelmRelease) repo and you can run the make targets of repo containing latest implementation of sonarqube. This will install all dependencies and sonarqube as well.
1. Clone [this](https://github.com/stakater/stakaterkubehelmRelease) repository
2. Update the hardcoded values mentioned in the [here](#Hard-coded-values)
3. Run this command. `make install CHART_NAME=release`
4. Verify from UI that cerebro pod is running and accessible.

## Known Issues

There are 2 known issues with latest public helm chart:

* It doesn’t install custom plugins with current version of sonarqube used in the public chart. It doesn’t work even with the latest sonarqube image, but only works with the version 7.1
* It doesn’t read & apply custom sonar.properties file

1st issue is resolved currently by using 7.1 version of sonarqube docker image. For 2nd issue we contacted the chart owner, and he has identified the issue. He confirmed that he will fix the issue soon. Till then we are configuring custom sonar properties manually.

## Dependencies

Sonarqube required a database to persist its results. With the public chart we can either use mysql or postgres

```yaml
- name: sonarqube
  version: 0.12.2
  repository: https://kubernetes-charts.storage.googleapis.com
  alias: sonarqube
```

## Hard-coded-values

Service annotations and labels are hard coded.

```yaml
sonarqube:
  service:
    type: ClusterIP
    labels:
      expose: "true"
    annotations:
      config.xposer.stakater.com/Domain: stakater.com
      config.xposer.stakater.com/IngressNameTemplate: '{{.Service}}-{{.Namespace}}'
      config.xposer.stakater.com/IngressURLTemplate: 'sonarqube.{{.Namespace}}.{{.Domain}}'
      xposer.stakater.com/annotations: |-
        kubernetes.io/ingress.class: internal-ingress
        ingress.kubernetes.io/force-ssl-redirect: true
```

Persistence and postgresql values are hard coded.

```yaml
sonarqube:
  persistence:
    enabled: true
    storageClass: "default"
    accessMode: ReadWriteOnce
    size: 10Gi
  postgresql:
    persistence:
      storageClass: "default"
```

We have an extra oauth plugin

```yaml
sonarqube:
  plugins:
    install:
      - "https://github.com/vaulttec/sonar-auth-oidc/releases/download/v1.0.4/sonar-auth-oidc-plugin-1.0.4.jar"
```

Add sonarProperties file containing keycloak configuration for SSO. Update `sonar.auth.oidc.clientSecret.secured=testsecret` with the real client secret.

```yaml
sonarqube:
  sonarProperties: |
    sonar.forceAuthentication=true
    sonar.auth.oidc.enabled=true
    sonar.core.serverBaseURL=https://sonarqube.release.stakater.com
    sonar.auth.oidc.providerConfiguration={"issuer":"https://keycloak.global.stakater.com/auth/realms/stakater","authorization_endpoint":"https://keycloak.global.stakater.com/auth/realms/stakater/protocol/openid-connect/auth","token_endpoint":"https://keycloak.global.stakater.com/auth/realms/stakater/protocol/openid-connect/token","token_introspection_endpoint":"https://keycloak.global.stakater.com/auth/realms/stakater/protocol/openid-connect/token/introspect","userinfo_endpoint":"https://keycloak.global.stakater.com/auth/realms/stakater/protocol/openid-connect/userinfo","end_session_endpoint":"https://keycloak.global.stakater.com/auth/realms/stakater/protocol/openid-connect/logout","jwks_uri":"https://keycloak.global.stakater.com/auth/realms/stakater/protocol/openid-connect/certs","check_session_iframe":"https://keycloak.global.stakater.com/auth/realms/stakater/protocol/openid-connect/login-status-iframe.html","grant_types_supported":["authorization_code","implicit","refresh_token","password","client_credentials"],"response_types_supported":["code","none","id_token","token","id_token token","code id_token","code token","code id_token token"],"subject_types_supported":["public","pairwise"],"id_token_signing_alg_values_supported":["ES384","RS384","HS256","HS512","ES256","RS256","HS384","ES512","RS512"],"userinfo_signing_alg_values_supported":["ES384","RS384","HS256","HS512","ES256","RS256","HS384","ES512","RS512","none"],"request_object_signing_alg_values_supported":["none","RS256"],"response_modes_supported":["query","fragment","form_post"],"registration_endpoint":"https://keycloak.global.stakater.com/auth/realms/stakater/clients-registrations/openid-connect","token_endpoint_auth_methods_supported":["private_key_jwt","client_secret_basic","client_secret_post","client_secret_jwt"],"token_endpoint_auth_signing_alg_values_supported":["RS256"],"claims_supported":["sub","iss","auth_time","name","given_name","family_name","preferred_username","email"],"claim_types_supported":["normal"],"claims_parameter_supported":false,"scopes_supported":["openid","phone","address","email","profile","offline_access"],"request_parameter_supported":true,"request_uri_parameter_supported":true,"code_challenge_methods_supported":["plain","S256"],"tls_client_certificate_bound_access_tokens":true,"introspection_endpoint":"https://keycloak.global.stakater.com/auth/realms/stakater/protocol/openid-connect/token/introspect"}
    sonar.auth.oidc.clientId.secured=stakater-online-platform
    sonar.auth.oidc.clientSecret.secured=testsecret
```