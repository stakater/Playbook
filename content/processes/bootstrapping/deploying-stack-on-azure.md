# Deploying Stackater Stacks on Azure

To deploy Stakater Stacks on Azure, Create pipeline for each stack with following values:

- Select checkbox `GitHub Project` and enter link to stack repo in the field below.
- Select the checkbox `This project is parameterized` and add the following parameters

  | NAME           | TYPE   | Description                                               |
  |----------------|--------|-----------------------------------------------------------|
  | REPO_URL       | String | link to stack repo                                        |
  | BRANCH         | String | name of branch to deploy                                  |
  | CREDENTIALS_ID | String | Id of Jenkins credentials to use to clone above git repo  |
  | PROVIDER       | Choice | Allow either aws or azure                                 |
  | MAKE_TARGET    | Choice | Allow targets available in Stack's Makefile               |
  | NAMESPACE      | String | Specify the name of namespace that should be forwarded to MakeFile |
  | KUBE_CONFIG    | Multi line String | Kube Config of Kubernetes stack in which it should deploy the stack |

- Add the following Jenkinsfile to the Pipeline Script
  
  ```groovy
  #!/usr/bin/env groovy
  @Library('github.com/stakater/stakater-pipeline-library@v2.15.0') _

  String repoURL = ""
  try {
      repoURL = REPO_URL
  } catch (Throwable ignored) {
      repoURL = ""
  }

  if (repoURL == "") {
      error("REPO_URL must be specified")
  }

  String branch = ""
  try {
      branch = BRANCH
  } catch (Throwable ignored) {
      branch = ""
  }

  if (branch == "") {
      error("BRANCH must be specified")
  }

  String credentialsID = ""
  try {
      credentialsID = CREDENTIALS_ID
  } catch (Throwable ignored) {
      credentialsID = ""
  }

  if (credentialsID == "") {
      error("CREDENTIALS_ID must be specified")
  }

  String provider = ""
  try {
      provider = PROVIDER
  } catch (Throwable ignored) {
      provider = ""
  }

  if (provider == "") {
      error("PROVIDER must be specified")
  }

  String makeTarget = ""
  try {
      makeTarget = MAKE_TARGET
  } catch (Throwable ignored) {
      makeTarget = ""
  }

  if (makeTarget == "") {
      error("MAKE_TARGET must be specified")
  }

  String namespace = ""
  try {
      namespace = NAMESPACE
  } catch (Throwable ignored) {
      namespace = ""
  }

  if (namespace == "") {
      error("NAMESPACE must be specified")
  }

  String kubeConfig = ""
  try {
      kubeConfig = KUBE_CONFIG
  } catch (Throwable ignored) {
      kubeConfig = ""
  }

  if (kubeConfig == "") {
      error("KUBE_CONFIG must be specified otherwise default cluster is used")
  }


  def utils = new io.fabric8.Utils()
  def flow = new io.stakater.StakaterCommands()

  timeout(time: 20, unit: 'MINUTES') {
      timestamps {
          stakaterNode() {
              container(name: 'tools') {
                  stage('checkout') {
                      git branch: branch , url: repoURL, credentialsId: credentialsID
                  }

                  stage('configure') {
                      writeFile file: '/home/jenkins/.kube/config', text: kubeConfig
                  }

                  stage('apply') {
                      executeMakeTargets {
                          target = makeTarget
                          NAMESPACE = namespace
                          PROVIDER_NAME = provider
                      }
                  }
              }
          }
      }
  }
  ```

Run the pipelines in the following order:

- [Global](https://github.com/stakater/StakaterKubeHelmGlobal)
- [Logging](https://github.com/stakater/StakaterKubeHelmLogging)
- [Monitoring](https://github.com/stakater/StakaterKubeHelmMonitoring)
- [Release](https://github.com/stakater/StakaterKubeHelmRelease)
- [Tracing](https://github.com/stakater/StakaterKubeHelmTracing)
