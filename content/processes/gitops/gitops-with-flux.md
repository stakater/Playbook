# GitOps with Flux

Flux is a tool that automatically ensures that the state of a cluster matches the config in git. It uses an operator in the cluster to trigger deployments inside Kubernetes, which means you don't need a separate CD tool. It monitors all relevant image repositories, detects new images, triggers deployments and updates the desired running configuration based on that (and a configurable policy).

## Get started with Flux & Helm

We will be installing helm and flux to deploy our apps in demo namespace. 

### Helm with Limited RBAC

As we want flux & helm to have restrictive access so we will be giving tiller access to only `demo`, `flux` and `kube-system` namespace. 

#### Installing Helm

If you dont have helm installed in your cluster, first install it by applying the following manifest

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: tiller
  namespace: kube-system
---
# Role & Rolebinding for flux namespace to deploy flux
kind: RoleBinding
apiVersion: rbac.authorization.k8s.io/v1beta1
metadata:
  name: tiller-flux-binding
  namespace: flux
subjects:
- kind: ServiceAccount
  name: tiller
  namespace: kube-system
roleRef:
  kind: Role
  name: tiller-flux-role
  apiGroup: rbac.authorization.k8s.io
---
kind: Role
apiVersion: rbac.authorization.k8s.io/v1beta1
metadata:
  name: tiller-flux-role
  namespace: flux
rules:
- apiGroups: ["*"]
  resources: ["*"]
  verbs: ["*"]
---
# Role & Rolebinding for demo namespace where it will be deploying applications
kind: RoleBinding
apiVersion: rbac.authorization.k8s.io/v1beta1
metadata:
  name: tiller-demo-binding
  namespace: demo
subjects:
- kind: ServiceAccount
  name: tiller
  namespace: kube-system
roleRef:
  kind: Role
  name: tiller-demo-role
  apiGroup: rbac.authorization.k8s.io
---
kind: Role
apiVersion: rbac.authorization.k8s.io/v1beta1
metadata:
  name: tiller-demo-role
  namespace: demo
rules:
- apiGroups: ["*"]
  resources: ["*"]
  verbs: ["*"]
---
kind: RoleBinding
apiVersion: rbac.authorization.k8s.io/v1beta1
metadata:
  name: tiller-system-binding
  namespace: kube-system
subjects:
- kind: ServiceAccount
  name: tiller
  namespace: kube-system
roleRef:
  kind: Role
  name: tiller-system-role
  apiGroup: rbac.authorization.k8s.io
---
kind: Role
apiVersion: rbac.authorization.k8s.io/v1beta1
metadata:
  name: tiller-system-role
  namespace: kube-system
rules:
- apiGroups: ["*"]
  resources: ["*"]
  verbs: ["*"]
```

This can be deployed through following commands:

```sh
kubectl apply -f tiller.yaml            # above file
helm init --service-account tiller      # by default namespace is kube-system, you can specify it by passing a flag --tiller-namespace
```

The above commands will install helm with limited access.

#### Installing Flux

The default chart of flux requires cluster-admin clusterrole, and we want limited access so we are not using the rbac provided by the chart but will be deploying the rbac separately.

As our helm also has limited access, so we cannot create CRDs from helm chart as well, we will be needing them to be created manually first. Deploy following manifests.

```yaml
apiVersion: apiextensions.k8s.io/v1beta1
kind: CustomResourceDefinition
metadata:
  name: helmreleases.flux.weave.works
  labels:
    app: flux
    chart: flux-0.6.3
    release: flux
    heritage: Tiller
  annotations:
    "helm.sh/resource-policy": keep
spec:
  group: flux.weave.works
  names:
    kind: HelmRelease
    listKind: HelmReleaseList
    plural: helmreleases
    shortNames:
    - hr
  scope: Namespaced
  version: v1beta1
  versions:
    - name: v1beta1
      served: true
      storage: true
  validation:
    openAPIV3Schema:
      properties:
        spec:
          required: ['values', 'chart']
          properties:
            releaseName:
              type: string
              pattern: "^[a-z0-9]([-a-z0-9]*[a-z0-9])?$"
            timeout:
              type: integer
              format: int64
            resetValues:
              type: boolean
            skipDepUpdate:
              type: boolean
            forceUpgrade:
              type: boolean
            valueFileSecrets:
              type: array
              properties:
                items:
                  type: object
                  required: ['name']
                  properties:
                    name:
                      type: string
            values:
              type: object
            chart:
              oneOf:
              - required: ['git', 'path']
                properties:
                  git:
                    type: string
                    format: git # not defined by OAS
                  path:
                    type: string
                  ref:
                    type: string
              - required: ['repository', 'name', 'version']
                properties:
                  repository:
                    type: string
                    format: url # not defined by OAS
                  name:
                    type: string
                  version:
                    type: string
                    format: semver # not defined by OAS
                  chartPullSecret:
                    properties:
                      name:
                        type: string
---
apiVersion: apiextensions.k8s.io/v1beta1
kind: CustomResourceDefinition
metadata:
  name: fluxhelmreleases.helm.integrations.flux.weave.works
  labels:
    app: flux
    chart: flux-0.6.3
    release: flux
    heritage: Tiller
  annotations:
    "helm.sh/resource-policy": keep
spec:
  group: helm.integrations.flux.weave.works
  names:
    kind: FluxHelmRelease
    listKind: FluxHelmReleaseList
    plural: fluxhelmreleases
    shortNames:
    - fhr
  scope: Namespaced
  version: v1alpha2
  versions:
    - name: v1alpha2
      served: true
      storage: true
  validation:
    openAPIV3Schema:
      properties:
        spec:
          required:
            - chartGitPath
            - values
          properties:
            releaseName:
              type: string
              pattern: "^[a-z0-9]([-a-z0-9]*[a-z0-9])?$"
            chartGitPath:
              type: string
            values:
              type: object
            valueFileSecrets:
              type: array
              items:
                type: object
                properties:
                  name:
                    type: string
---
```

The above manifest will create 2 crds

- helmreleases.flux.weave.works
- fluxhelmreleases.helm.integrations.flux.weave.works

which check for helm releases and deploy them automatically.

Now, we will deploy the rbac required for flux instance.

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: flux
  namespace: flux
---
# Role & Rolebinding for flux namespace
kind: RoleBinding
apiVersion: rbac.authorization.k8s.io/v1beta1
metadata:
  name: flux-binding
  namespace: flux
subjects:
- kind: ServiceAccount
  name: flux
  namespace: flux
roleRef:
  kind: Role
  name: flux-role
  apiGroup: rbac.authorization.k8s.io
---
kind: Role
apiVersion: rbac.authorization.k8s.io/v1beta1
metadata:
  name: flux-role
  namespace: flux
rules:
- apiGroups: ["*"]
  resources: ["*"]
  verbs: ["*"]
---
# Role & Rolebinding for demo namespace where helm operator will deploy HelmReleases
kind: RoleBinding
apiVersion: rbac.authorization.k8s.io/v1beta1
metadata:
  name: flux-demo-binding
  namespace: demo
subjects:
- kind: ServiceAccount
  name: flux
  namespace: flux
roleRef:
  kind: Role
  name: flux-demo-role
  apiGroup: rbac.authorization.k8s.io
---
kind: Role
apiVersion: rbac.authorization.k8s.io/v1beta1
metadata:
  name: flux-demo-role
  namespace: demo
rules:
- apiGroups: ["*"]
  resources: ["*"]
  verbs: ["*"]
- apiGroups: ["*"]
  resources: ["fluxhelmreleases","helmreleases"]
  verbs: ["*"]
---
# Role & RoleBinding for kube-system namespace so helm operator can talk to tiller.
kind: RoleBinding
apiVersion: rbac.authorization.k8s.io/v1beta1
metadata:
  name: flux-system-binding
  namespace: kube-system
subjects:
- kind: ServiceAccount
  name: flux
  namespace: flux
roleRef:
  kind: Role
  name: flux-system-role
  apiGroup: rbac.authorization.k8s.io
---
kind: Role
apiVersion: rbac.authorization.k8s.io/v1beta1
metadata:
  name: flux-system-role
  namespace: kube-system
rules:
- apiGroups: ["*"]
  resources: ["services"]
  verbs: ["get","list","watch"]

---
# ClusterRoles required to flux as it looks for namespaces and helm operator needs to look into helmReleases at the cluster level
kind: ClusterRoleBinding
apiVersion: rbac.authorization.k8s.io/v1beta1
metadata:
  name: flux-clusterrolebinding
subjects:
- kind: ServiceAccount
  name: flux
  namespace: flux
roleRef:
  kind: ClusterRole
  name: flux-clusterrole
  apiGroup: rbac.authorization.k8s.io
---
kind: ClusterRole
apiVersion: rbac.authorization.k8s.io/v1beta1
metadata:
  name: flux-clusterrole
rules:
- apiGroups: ["*"]
  resources: ["namespaces"]
  verbs: ["get","list","watch"]
- apiGroups: ["*"]
  resources: ["fluxhelmreleases","helmreleases"]
  verbs: ["*"]
```

The above manifest will create a service account named flux and will give it complete permission over the `demo` and `flux` namespaces. 

Now to deploy flux using helm, run the following command: 

```sh
helm install --name flux \
--set rbac.create=false \
--set serviceAccount.create=false \
--set serviceAccount.name=flux \
--set helmOperator.create=true \
--set helmOperator.createCRD=false \
--set helmOperator.updateChartDeps=false \
--set git.url=ssh://git@github.com/stakater/flux-helm-test \
--set git.pollInterval=5s \
--set registry.pollInterval=200m \
--set registry.excludeImage=* \
--namespace flux \
weaveworks/flux
```

The above command will deploy flux which will be looking into `stakater/flux-helm-test` 
repo, you can change that to your repo.

After this command, run `kubectl -n flux logs deployment/flux | grep identity.pub | cut -d '"' -f2` to get the ssh key and add that in the repo's deploy keys by going to Settings -> Deploy Keys -> Add Deploy Key. Give Write access to the key. Now flux will be able to read and write to your git repo.

Deploying above flux instance will deploy chart present in `stakater/flux-helm-test`, currently it has a umbrella chart that deploys Xposer(a utility developed to create/update/delete Ingresses directly from Services). So xposer will be deployed in demo namespace.