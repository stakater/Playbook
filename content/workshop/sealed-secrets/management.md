# Key Management

[[toc]]

## Overview
This document provides guidelines on the management of SealedSecret keys.

## Secret Rotation

There are two ways to secure the secrets:

### Key Renewal

In this method the SealedSecret keys will be rotated/renewed. The are two ways for key renewal:

#### Scheduled

By default, KeyPairs are automatically renewed every `30 days`. This can be configured on controller startup with the `--key-renew-period=<value>` flag. The value field can be given as golang duration flag (eg: 720h30m). A value of 0 will disable automatic key renewal.

The feature has been historically called "key rotation" but this term can be confusing. Sealed secrets are not automatically rotated and old keys are not deleted when new keys are generated. Old sealed secrets resources can be still decrypted.

Once the key is renewed we need to fetch the cert and seal the secrets again.


#### Non-scheduled / Early Key Renewal

To renew the key before the expiration date, follow the guideline given below:

1. Label the old key as compromised.

```bash
sudo kubectl -n NAMESPACE label secrets SECRET-NAME sealedsecrets.bitnami.com/sealed-secrets-key=compromised --overwrite=true
```

2. Make sure that the `compromised` label is assigned. 

3. Restart the controller.

4. Get the new public key:
    
```bash
sudo kubeseal --fetch-cert --controller-name=CONTROLLER-NAME --controller-namespace=NAMESPACE
```

5. Store the key in a file.

6. Re-seal your secrets with the new key.
```bash
sudo kubeseal --cert CERT-FILE < UNSEALED-SECRET.yaml -o yaml > SEALED-SECRET.yaml
```

## How to reuse SealedSecret Key

Sealed secret has one problem that a key pair is generated only once, so a sealed secret generated for one cluster will not be usable in another cluster. This problem can be resolved by reusing the decryption key. To do it follow the steps given below:

1. Get the decryption key using the command given below:

    ```bash
    sudo  kubectl get secret -n NAMESPACE -l sealedsecrets.bitnami.com/sealed-secrets-key -o yaml > MASTER.yaml
    ```

    Store this key at the secure location like data key vault.

2. Now this key can be used in another cluster like
    ```bash
    sudo kubectl apply -f MASTER.yaml
    ```
    Make sure the key is being created in the correct `namespace`. When the SealedSecret controller starts it will scan the namespace to check whether a key already exists or not.
