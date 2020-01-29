# Introduction

[[toc]]

## Overview

[SealedSecrets](https://github.com/bitnami-labs/sealed-secrets) controller solves the problem of storing kubernetes secret data securely by encrypting the configurations. It can only be decrypted by sealed secret controller running in cluster.

### Problem: Downside of Kubernetes Secrets

In Kubernetes Secrets, the data is stored as base64 encoded string, which is easily decryptable.

### Solution:

Sealed Secrets resolved the issue by encryting the data which is only decryptable by component of sealed secret running in cluster.

## Architecutre

SealedSecrets is composed of two components:

* `Controller`: A cluster-side component for data decryption.
* `Kubeseal`: A client-side utility for data encryption. It uses asymmetric cryptography methods for data encryption.

[![SealedSecret Architecture Diagram](../image/sealed-secret.png)](https://engineering.bitnami.com/articles/sealed-secrets.html)

[Source](https://engineering.bitnami.com/articles/sealed-secrets.html)


### Terms

Following terms will be used a lot in this workshop, so following is their explanation.

* `Secret`: Kubernetes secret which stores data in base64 form.
* `Kubeseal`: A client-side CLI used for data encryption.
* `SealedSecret`: CRD created by SealedSecret Operator, which means the resource that is encrypted and can be pushed to git as well.
* `Key Pair`: The public-private key pair used to encrypt data.

### Working

SealedSecrets Controller generate a public/private key pair that it uses to encrypt/decrypt data. This key pair is generated once when the SealedSecrets Controller is deployed. The secrets sealed by one controller cannot be decrypted by another controller because the key pair is different for every deployed controller. 

So an issue arises, that if you want to replicate your environment, can you use the same SealedSecrets into another cluster/environment. So answer is yes. SealedSecrets Controller stores key pair as a K8s secret. To reuse it, you can fetch the key pair secret and keep it in a secure place like Vault (never check key pair on git) and apply the key pair secret whenever you want to reuse the key pair with a different controller.

There are two ways to seal a secret:

1. Using Controller

Use the command given below to generate sealed-secret:

```bash
sudo kubeseal --controller-name=CONTROLLER-NAME --controller-namespace=NAMESPACE  < UNSEALED-SECRET.yaml > SEALED-SECRET.yaml
```

2. Using Cert

Use the following command to get the cert and store it in a file:

```bash
sudo kubeseal --fetch-cert --controller-name=CONTROLLER-NAME --controller-namespace=NAMESPACE
```

To encrypt the data with cert use the command given below:

```bash
sudo kubeseal --cert CERT-FILE < UNSEALED-SECRET.yaml > SEALED-SECRET.yaml
```

An example is of how sealed secret encryptes the data is given below:

**Data**

Following data needs to protected:

1- `mysql user`: root

2- `mysql password`: @mysqlpassword 

3- `mysql database`: test-database

**Unsealed Data**

Kubernetes secret:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: mysql-secrets
  namespace: nordmart-dev-apps
data:
  mysql_user: cm9vdA==  # <- base64 encoded root
  mysql_password: QG15c3FscGFzc3dvcmQ=  # <- base64 encoded @mysqlpassword
  mysql_database: dGVzdC1kYXRhYmFzZQ==  # -< base64 encoded test-database
```

**Sealed Data**

Encrypted kubernetes secret:

```yaml
apiVersion: bitnami.com/v1alpha1
kind: SealedSecret
metadata:
  name: mysql-secrets
  namespace: nordmart-dev-apps
spec:
  encryptedData:
    mysql_user: AgBy3i4OJSWK+PiTySYZZA9rO43cGDEq.....
    mysql_password: AyBQ@XZOSAK@+A@DZAASDasd21@6.....
    mysql_database: Raz+1@2ZQzia921@ea21@a21az23.......
```
