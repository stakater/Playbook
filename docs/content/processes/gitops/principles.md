# GitOps Principles


GitOps is a methodology of Continuous Delivery, at the heart of which is the principle that Git be used as the source of truth for declarative infrastructure and applications.

## Declarative description of system

Any and all changes made to the application, environment, deployment and infrastructure should all be handled via git. This therefore means that we should declare all these as code and maintain in a git repository. Code for the whole system will include the following:

### Infrastructure
can be declared in the form of Terraform modules, Cloudformation script, or other. At Stakater, we also use Kops for AWS, which in addition to setting up the Kubernetes cluster, also creates the underlying AWS infrastructure prior. This is declared using a yaml file.

### Kubernetes configuration
includes details of deployments, replicas, services and container images to deploy etc. It can be declared at the least via vanilla yaml manifests. A better approach that we use at Stakater is to use the Helm package manager for Kubernetes. Helm encapsulates the configuration in the form of reusable Charts, which are groups of yaml and value files.

### Environment configuration
is also handled within the Kubernetes configuration, and handled via the Kubernetes API object, ConfigMap. The ConfigMap is also declared in yaml, and can be expressed inside a Helm chart as such for a particular deployment, or in an independant chart for itself as well.

### Application code
is of course traditionally maintained in git already, and needs to be packaged within docker image, which is declaratively expressed in the form of a Dockerfile. The Dockerfile should be included within the Application code repository.

## Changes through Pull Request

Since our system is declared as code and maintained in Git, the consequent principle to follow is that all changes that need to be made, must be done so through a pull request. Using trunk based development, a master git branch is used for reflecting the current state of the system. Any updates that may be needed can simply be done by opening a new pull request (PR) on the master branch. Once the PR is merged, the CD/GitOps pipeline is triggered, and deploys the required changes to the kubernetes cluster. In case any change needs to be rolled back, to a recent or even older state, that will also be performed by a pull request. We will explore this in more detail in a subsequent section.

## Self-healing

Since the git repository is the source of truth for the system, at any time we can see the intended state of the system by scanning the git repository. In case any application pod crashes, or the system is unintentionally modified manually, the GitOps pipeline will rectify to keep the system state in sync with the declaration in the repository. This principle is built into one of the purpose-built GitOps solutions, however in our case we will see this will not be implemented with Jenkins due to its complexity.