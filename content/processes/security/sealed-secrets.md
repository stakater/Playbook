# Sealed Secrets

[Sealed secrets](https://github.com/bitnami-labs/sealed-secrets) controller solves the problem of storing kubernetes secret configurations securely. Secrets will be encrypted as secrets in kubernetes secrets, secrets can only be decrypted by sealed secret controller running in cluster.


## Details

Kubernetes also have a way to manage [secrets](https://playbook.stakater.com/content/processes/security/secrets-management.html) but sealed secret controller provides a better way to do it because now secrets can be stored in public repository due to base64-encoded asymmetrical encryption.  


## How it works
It looks for cluster wide public/private key pairs on startup. The key is persisted in a regular Secret in the same namespace as the controller. The public key portion of this (in the form of a self-signed certificate) should be made publicly available to anyone wanting to use SealedSecrets with this cluster.