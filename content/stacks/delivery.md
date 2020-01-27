# Delivery Stack

![Delivery](./image/delivery.png)

## Overview

Delivery Stack is responsible for CI/CD and respective saving artifacts of the pipelines.

## Tools Matrix

|       Tool        | Chart Repository                                                     | Cherry Pickable | SSO | Pre-Requisites |
| :---------------: | :------------------------------------------------------------------: | :--------------:| :--:| :-------------:|
| [Jenkins](https://github.com/jenkinsci/jenkins) | [Public](https://github.com/helm/charts/tree/master/stable/jenkins)            |       Yes       | Yes |     KeyCloak   |
| [Sonatype-Nexus](https://github.com/sonatype/nexus-public)   | [Public](https://github.com/helm/charts/tree/master/stable/sonatype-nexus)     |       Yes       | No  |      None      |
| RDLM    | [Stakater](https://github.com/stakater-charts/restful-distributed-lock-manager)|       Yes       | N/A |      None      |

## Default Configurations

Following are the default configurations that are used by StakaterPlatform for `Delivery` stack. These configurations can be found under `configs/` directory in the StakaterPlatform Github [repository](https://github.com/stakater/StakaterPlatform)

### Jenkins

Jenkins provide automation pipelines for CI/CD workflow. 

#### Maven Configs

Following variables should be configured in `variables.config` for Caching maven artifacts and speeding up maven builds.

| Variables | Description | Default |  
|:---|:---|---|
| JENKINS_DOCKER_MAVEN_USERNAME | Maven repository used by Jenkins to store maven artifiacts |`admin` |
| JENKINS_DOCKER_MAVEN_PASSWORD | Maven repository used by Jenkins to store maven artifiacts |`xJuAWjG4GzrCkPJU` |
| JENKINS_LOCAL_NEXUS_USERNAME | Local repository used by Jenkins to store artifiacts |`admin` |
| JENKINS_LOCAL_NEXUS_PASSWORD | Local repository used by Jenkins to store artifiacts | `LXwEkC4jZzQj3DHY` |
| JENKINS_NEXUS_USERNAME | Nexus Username. Used by docker command in Jenkins Pipeline | `admin` |
| JENKINS_NEXUS_PASSWORD | Nexus Password. Used by docker command in Jenkins Pipeline | `CN3B6uY998kpBFDd` |

`configs/jenkins-maven-config.xml:`
```
<settings>
    <!-- sets the local maven repository outside of the ~/.m2 folder for easier mounting of secrets and repo -->
    <localRepository>${user.home}/.mvnrepository</localRepository>
    <mirrors>
        <mirror>
            <id>nexus</id>
            <mirrorOf>external:*</mirrorOf>
            <url>http://nexus.release/repository/public/</url>
        </mirror>
    </mirrors>

    <!-- lets disable the download progress indicator that fills up logs -->
    <interactiveMode>false</interactiveMode>

    <servers>
        <server>
            <id>docker-delivery.DOMAIN:443</id>
            <username>JENKINS_DOCKER_MAVEN_USERNAME</username>
            <password>JENKINS_DOCKER_MAVEN_PASSWORD</password>
        </server>
        <server>
            <id>local-nexus</id>
            <username>JENKINS_LOCAL_NEXUS_USERNAME</username>
            <password>JENKINS_LOCAL_NEXUS_PASSWORD</password>
        </server>
        <server>
            <id>nexus</id>
            <username>JENKINS_NEXUS_USERNAME</username>
            <password>JENKINS_NEXUS_PASSWORD</password>
        </server>
        <server>
            <id>oss-sonatype-staging</id>
            <username></username>
            <password></password>
        </server>
    </servers>

    <profiles>
        <profile>
            <id>nexus</id>
            <properties>
                <altDeploymentRepository>local-nexus::default::http://nexus.release/repository/maven-releases/</altDeploymentRepository>
                <altReleaseDeploymentRepository>local-nexus::default::http://nexus.release/repository/maven-releases/</altReleaseDeploymentRepository>
                <altSnapshotDeploymentRepository>local-nexus::default::http://nexus.release/repository/maven-snapshots/</altSnapshotDeploymentRepository>
            </properties>
            <repositories>
                <repository>
                    <id>central</id>
                    <url>http://central</url>
                    <releases><enabled>true</enabled></releases>
                    <snapshots><enabled>true</enabled></snapshots>
                </repository>
            </repositories>
            <pluginRepositories>
                <pluginRepository>
                    <id>central</id>
                    <url>http://central</url>
                    <releases><enabled>true</enabled></releases>
                    <snapshots><enabled>true</enabled></snapshots>
                </pluginRepository>
            </pluginRepositories>
        </profile>
        <profile>
            <id>release</id>
            <properties>
                <gpg.executable>gpg</gpg.executable>
                <gpg.passphrase>mysecretpassphrase</gpg.passphrase>
            </properties>
        </profile>
    </profiles>
    <activeProfiles>
        <!--make the profile active all the time -->
        <activeProfile>nexus</activeProfile>
    </activeProfiles>
</settings>
```

#### Jenkins docker cfg

Jenkins use docker to build images for CI/CD pipleline. To push and pull images from image registry ( Nexus in `StakaterPlatform`) docker configuration file needs to be provided. This configuration file corresponds to `$HOME/.docker/config.json`. Configure following varaibles in `variables.config` to allow pull/push from nexus repository in Jenkins

| Variables | Description | Default |  
|:---|:---|---|
| JENKINS_NEXUS_USERNAME | Nexus Username. Used by docker command in Jenkins Pipeline | `admin` |
| JENKINS_NEXUS_PASSWORD | Nexus Password. Used by docker command in Jenkins Pipeline | `CN3B6uY998kpBFDd` |

`JENKINS_NEXUS_AUTH` is replaced by encoding above variables in base64 in this format: `NEXUS_ADMIN_ACCOUNT_USER:NEXUS_ADMIN_ACCOUNT_PASSWORD`

`configs/jenkins.json:`
```
{
  "auths": {
    "docker-delivery.DOMAIN:443": {
      "auth": "JENKINS_NEXUS_AUTH"
    }
  }
}
```

### Nexus

Nexus is used as a private image repository to push/pull images and artifacts. Configure following varaibles in `variables.config` to configure nexus registry.

| Variables | Description | Default |  
|:---|:---|---|
| NEXUS_ADMIN_ACCOUNT_USER | Username for admin account |`nexus-admin` |
| NEXUS_ADMIN_ACCOUNT_PASSWORD | Password for admin account |`L8TcnrwMytCFpAFe` |
| NEXUS_CLUSTER_ACCOUNT_USER | Username for cluster admin account |`nexus-cluster-admin` |
| NEXUS_CLUSTER_ACCOUNT_PASSWORD | Password for cluster admin account |`mrzUGWrD9buDYhMF` |

`configs/nexus-admin-account.json:`
```
{"name": "NEXUS_ADMIN_ACCOUNT_USER","type": "groovy","content": "security.addUser('NEXUS_ADMIN_ACCOUNT_USER', 'Stakater', 'Admin', 'user@gmail.com', true, 'NEXUS_ADMIN_ACCOUNT_PASSWORD', ['nx-admin'])"}
```

`configs/nexus-cluster-account.json:`
```
{"name": "NEXUS_CLUSTER_ACCOUNT_USER","type": "groovy","content": "security.addRole('cluster', 'cluster', 'User with privileges to allow read access to repo content and healtcheck', ['nx-healthcheck-read','nx-repository-view-docker-stakater-docker-browse','nx-repository-view-docker-stakater-docker-read','nx-search-read'],  ['nx-anonymous']); security.addUser('NEXUS_CLUSTER_ACCOUNT_USER', 'Cluster', 'Cluster', 'user@gmail.com', true, 'NEXUS_CLUSTER_ACCOUNT_PASSWORD', ['cluster'])"}
```

[Stakater Pipeline Library](https://github.com/stakater/stakater-pipeline-library)

## Storage Details

|          Tool         |                            PVC                                     | Recommended Space |
| :-------------------: | :------------------------------------------------------------------------------: | :--------------:| :--:| :-------------:|
| [Jenkins](https://github.com/jenkinsci/jenkins)          | [stakater-delivery-jenkins](https://github.com/helm/charts/tree/master/stable/jenkins#persistence)                                 |     8Gi |
| [Sonatype-Nexus](https://github.com/sonatype/nexus-public)           | [stakater-delivery-sonatype-nexus-data-big](https://github.com/helm/charts/tree/master/stable/sonatype-nexus#persistence)                             |     80Gi |

