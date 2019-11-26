# Sealed Secret Management

## Overview
This document provides guidelines on the management of sealed secrets.

## Key Renewel


### Early Key Renewel

1. Label the old key as compromised.

    ```bash
    sudo kubectl -n <namespace> label secrets <sealed-secrets-key> sealedsecrets.bitnami.com/sealed-secrets-key=compromised --overwrite=true
    ```

2. Make sure that the `compromised` label is assigned. 

3. Restart the controller.

4. Get the new public key:
    ```bash
    sudo kubeseal --fetch-cert --controller-name=<stakater-sealed-secret-sealed-secrets> --controller-namespace=<test-sealed-secret>
    ```

5. Store the key in a file.

6. Re-seal your secrets with the new key.
   

## Reusing the descryption key

To get the master key use the command given below:

```
sudo  kubectl get secret -n <namespace> -l sealedsecrets.bitnami.com/sealed-secrets-key -o yaml > master-new.yaml
```

Store this key at the secure location.
