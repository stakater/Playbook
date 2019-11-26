# Caveats

## Overview

This section contains the caveats in the current version of SealedSecret.

Latest version is:

```
Chart Version: 1.6.0
Image Version: V0.9.5
```

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

## Key Renewal / Rotation

Its keys are renewed after 30 days by default. New key will not be able to decrypt the old sealed secrets. So if a secret is deleted from a namespace then its controller will not be able to generate secret from the old sealed secret, which makes the old sealed secrets useless.

So, the user needs to generate new sealed secrets from the secrets again.

## SealedSecret Decryption

**Offline Decryption**

SealedSecret can be decrypted offline using its secret key, which is kind of a security leak. The users need to make sure that secret key must never be used outside the cluster.

There is another issue, which is given below

```bash
# the command
kubeseal < <secret-key>.yaml --recovery-unseal --recovery-private-key <secret.key>
```

```bash
# error
error: cannot fetch certificate: services "sealed-secrets-controller" not found
```

**Online Decryption**

SealedSecret can be descrypted using the controller running in the cluster. It is a more secure way to decrypt sealed secrets. Its command is given in the key management section.

In online key decryption method, the secret key was pulled from the cluster. Secret Key is returned in list format:

```yaml
apiVersion: v1

items:

- apiVersion: v1
  data:
    tls.crt: ...
    tls.key: ...
  kind: Secret
  metadata:
    generateName: sealed-secrets-key
    labels:
      sealedsecrets.bitnami.com/sealed-secrets-key: active
    name: sealed-secrets-key2qh5f
    namespace: test-sealed-secret
  type: kubernetes.io/tls

- apiVersion: v1
  data:
    tls.crt: ...
    tls.key: ...
  kind: Secret
  metadata:
    generateName: sealed-secrets-key
    labels:
      sealedsecrets.bitnami.com/sealed-secrets-key: compromised
    name: sealed-secrets-keyscxhn
    namespace: test-sealed-secret
  type: kubernetes.io/tls

kind: List
metadata:
  resourceVersion: ""
  selfLink: ""
```

When it is used to decrypt the data it generates following error:

```bash
error: converting (v1.List) to (v1.Secret): ObjectMeta not present in src
```

SealedSecret team is working on this [issue](https://github.com/bitnami-labs/sealed-secrets/issues/319) resolution.

It can be temporary fixed by creating a new secret from the secret key file that contains secrets list.