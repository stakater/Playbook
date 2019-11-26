# Caveats

## Overview

This section contains the caveats in the current version of SealedSecret.

## ClusterRole Issue

It requires ClusterRole to watch the SealedSecrets. If ClusterRole is not provided, it doesn't operate and continually generates error regarding the cluster-scope RBAC issue.

SealedSecret team is working on a feature to restrict the controller watch to only selected namespaces.

We have given ClusterRole to the SealedSecret's service account with following rules:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: secrets-unsealer
  labels:
    app.kubernetes.io/name: "sealed-secret-name"
rules:
  - apiGroups:
      - bitnami.com
    resources:
      - sealedsecrets
    verbs:
      - get
      - list
      - watch
      - update
  - apiGroups:
      - ""
    resources:
      - secrets
    verbs:
      - get
      - create
      - update
      - delete
  - apiGroups:
      - ""
    resources:
      - events
    verbs:
      - create
      - patch
```

## Multi-tenancy

SealedSecret Controller uses ClusterRole to watch SealedSecret resources in all cluster namespaces, so therefore mutli-tenancy cannot be acheived.

## Key Renewal / Rotation

Its keys are renewed after 30 days by default. New key will not be able to decrypt the old sealed secrets. So if a secret is deleted from a namespace then its controller will not be able to generate secret from the old sealed secret, which makes the old sealed secrets useless.

So, the user needs to generate new sealed secrets from the secrets again.

## Secret Key Security

If secret key is compromised then all the SealedSecrets become useless.

## Secret Key Storage

SealedSecert's secret key must be place in a secure source like online data vaults etc.

## SealedSecrets Management

Before using SealedSecrets following questions must be answered:

1. Who will generate SealedSecrets?
2. Who will maintain it?

## Similar Tools

List of alternative tools are given below:

1. [Kamus](https://github.com/Soluto/kamus).

2. [Helm Secrets](https://github.com/futuresimple/helm-secrets).

