# Scenario

## Overview
In this document, we will follow a scenario in which we want to deploy a MySQL instance for the Nordmart Catalog microservice.


## Scenario Guidelines

1. There are two ways to install the SealedSecret server side controller:
    
    1. Using Kubernetes manifest:
    ```bash

    kubectl apply -f https://github.com/bitnami-labs/sealed-secrets/releases/download/v0.9.5/controller.yaml
    ```
    It will create a CRD and install the SealedSecret controller in the `kube-system` namespace.
 
    2. Using helm manifest:

    ```yaml
    apiVersion: helm.fluxcd.io/v1
    kind: HelmRelease
    metadata:
    name: stakater-sealed-secret
    namespace: sealed-secret-namespace
    spec:
    releaseName: stakater-sealed-secret
    chart:
        repository: https://kubernetes-charts.storage.googleapis.com
        name: sealed-secrets
        version: 1.6.0
    values:

        image:
        repository: quay.io/bitnami/sealed-secrets-controller
        tag: v0.9.5
        pullPolicy: IfNotPresent

        controller:
        create: true

        crd:
        create: false

        rbac:
        create: true

        secretName: "sealed-secrets-key"

        serviceAccount:
        create: true
        name: "stakater-sealed-secret-sa"
    ```

2. Install the Sealed Secret Client side tools using the steps given below:

```bash
$ release=$(curl --silent "https://api.github.com/repos/bitnami-labs/sealed-secrets/releases/latest" | sed -n 's/.*"tag_name": *"\([^"]*\)".*/\1/p')

$ GOOS=$(go env GOOS)

$ GOARCH=$(go env GOARCH)

$ wget https://github.com/bitnami-labs/sealed-secrets/releases/download/$release/kubeseal-$GOOS-$GOARCH

$ sudo install -m 755 kubeseal-$GOOS-$GOARCH /usr/local/bin/kubeseal
```

3. Now get the SealedSecret controller public key using the command given below:

```bash
$ sudo kubeseal --fetch-cert --controller-name=<sealed-sealed-secrets> --controller-namespace=<sealed-secret-namespace>
```

Store the key return by above command in a file.

4. Create a secret that will be used in the MySQL manifest:

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

5. Use the command given below to sealed the above secret:
```bash
$ sudo kubeseal --cert <name-of-file-created-in-step-3> < <above-secret-filename>.yaml -o yaml > <sealed-secret-filename>.yaml
```
It will generate a manifest like this:

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

6. Use the command given below to create a sealed secret in the cluster:

```
$ sudo kubectl apply -f <sealed-secret-filename>.yaml -n <namespace-name>
```

7. Once the sealed secret resource is created the controller will perform following operations:

    1. It will detect the sealed secret resource.
    2. It will unseal it using its private key.
    3. It will store the unsealed secret in the namespace specific in the manifest.

8. Check the namespace in which sealed secret was created, whether the sealed secret was unsealed or not. If the secret exists move to the next step otherwise check the logs of the controller.

9. Delpy the MySQL using the manifest given below:

```yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    app: mysql
  name: mysql-svc
  namespace: nordmart-dev-apps
spec:
  ports:
  - name: "mysql-port"
    port: 3306
    targetPort: 3306
  selector:
    app: mysql
---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: mysql
  namespace: nordmart-dev-apps
spec:
  serviceName: "mysql"
  selector:
    matchLabels:
      app: mysql
  replicas: 1
  updateStrategy:
    type: RollingUpdate
  template:
    metadata:
      labels:
        app: mysql
    spec:   

      initContainers:
      - image: busybox
        name: mysql-volume-cleaner
        args: [/bin/sh, -c, 'rm -rf /var/lib/mysql/lost+found || true']
        volumeMounts:
        - mountPath: /var/lib/mysql
          name: mysql-pvc

      containers:
      - image: mysql:5.7
        name: mysql
        env:
        - name: MYSQL_ROOT_PASSWORD
          valueFrom:
            secretKeyRef:
              name: mysql-secret
              key: mysql_password
        ports:
        - containerPort: 3306
          name: tcp
        volumeMounts:
        - mountPath: /var/lib/mysql
          name: mysql-pvc
        resources: {}          
  volumeClaimTemplates:
  - metadata:
      name: mysql-pvc
    spec:
      accessModes: [ "ReadWriteOnce" ]
      storageClassName: hdd
      resources:
        requests:
          storage: 5Gi
```

10. Check whether the MySQL has been deployed correctly or not by using mysql shell:

```bash
# enter the mysql pod

$ sudo kubectl -n <namespace-name> exec -it <pod-name> /bin/bash

# use the mysql shell
$ mysql -u root -p
```

11. If the `mysql-secret` is updated we will use [Reloader](https://github.com/stakater/Reloader#secret) tool to update MySQL deployment. It requires following annotations to be added in MySQL statefulset manifest:

```yaml
kind: Deployment
metadata:
  annotations:
    secret.reloader.stakater.com/reload: "mysql-secret"
spec:
  template: metadata:
```

## How it works in Jenkins or GitOps strategy:

SealedSecret can be stored anywhere. The user just need to use the command given below to apply the changes:

```bash
$ sudo kubectl apply -f <sealed-secret>.yaml -n <namespace>
```
