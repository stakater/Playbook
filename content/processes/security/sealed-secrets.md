# Sealed Secrets

[Sealed secrets](https://github.com/bitnami-labs/sealed-secrets) controller solves the problem of storing kubernetes secret data securely by encrypting the configurations. It can only be decrypted by sealed secret controller running in cluster which means now configurations can be stored anywhere.


## Working

Kubernetes also provides a way to manage configurations securely using [secrets](https://playbook.stakater.com/content/processes/security/secrets-management.html) but the downside of using k8s secrets is that it only encodes the data in base64 which can be decoded easily. 

Above issue can be resolved by using `Sealed Secrets` controller, kubeseal (cli tool to convert k8s secrets into sealed secrets) it encyptes and uploads the data on kubernetes cluster. The controller will decrypt data and finally stores it as a k8s secret in the cluster. 


## Installation Guidelines


### Client-side tool installation

```bash
$ release=$(curl --silent "https://api.github.com/repos/bitnami-labs/sealed-secrets/releases/latest" | sed -n 's/.*"tag_name": *"\([^"]*\)".*/\1/p')

$ GOOS=$(go env GOOS)

$ GOARCH=$(go env GOARCH)

$ wget https://github.com/bitnami-labs/sealed-secrets/releases/download/$release/kubeseal-$GOOS-$GOARCH

$ sudo install -m 755 kubeseal-$GOOS-$GOARCH /usr/local/bin/kubeseal
```

### Server Side Controller installation
Commands given below will create a `CRD` and install its controller in the `kube-system` namespace.


```bash
$ kubectl apply -f https://github.com/bitnami-labs/sealed-secrets/releases/download/$release/sealedsecret-crd.yaml

$ kubectl apply -f https://github.com/bitnami-labs/sealed-secrets/releases/download/$release/controller.yaml
```

It will generate key pair (public and private). To check whether it is working properly check its logs. The key is persisted in a regular Secret in the same namespace as the controller. The public key portion of this (in the form of a self-signed certificate) should be made publicly available to anyone wanting to use SealedSecrets with this cluster. Public key is used to encrypt the secrets and needs to available wherever `kubeseal` will be used.

Kubeseal will fetch the certificate from the controller at runtime (requires secure access to the Kubernetes API server). The recommended automation workflow is to store the certificate to local disk with `kubeseal --fetch-cert > mycert.pem` command, and use it offline with `kubeseal --cert mycert.pem` command.

### Kubeseal installation
Kubeseal can be installed using the command given below:

```bash
$ go get github.com/bitnami-labs/sealed-secrets/cmd/kubeseal
```

## Usage Guidelines

```bash
# Create a json/yaml-encoded Secret
$ kubectl create secret generic mysecret --dry-run --from-literal=foo=bar -o json > mysecret.json

$ kubeseal <mysecret.json> mysealedsecret.json

$ kubectl create -f mysealedsecret.json

$ kubectl get secret mysecret
```

## Problem

SealedSecrets Controller generate a public/private key pair that it uses to encrypt/decrypt data. This key pair is generated once when the SealedSecrets Controller is deployed. The secrets sealed by one controller cannot be decrypted by another controller because the key pair is different for every deployed controller.

## Solution

SealedSecrets Controller stores key pair as a secret. To Reuse the key pair, store the key pair secret locally (never check keypair on git) and apply the key pair secret when you want to reuse the key pair with a different controller.

Use the following command to get the key pair secret

```
oc get secret sealed-secrets-key -n <namespace>
```