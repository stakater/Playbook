# Reuse Sealed Secrets

## Problem

SealedSecrets Controller generate a public/private key pair that it uses to encrypt/decrypt data. This key pair is generated once when the SealedSecrets Controller is deployed. The secrets sealed by one controller cannot be decrypted by another controller because the key pair is different for every deployed controller.

## Solution

SealedSecrets Controller stores key pair as a secret. To Reuse the key pair, store the key pair secret locally (never check keypair on git) and apply the key pair secret when you want to reuse the key pair with a different controller.

Use the following command to get the key pair secret

```
oc get secret sealed-secrets-key -n <namespace>
```


For more information on SealedSecrets visit the SealedSecret info [page](/content/processes/security/sealed-secrets.html)