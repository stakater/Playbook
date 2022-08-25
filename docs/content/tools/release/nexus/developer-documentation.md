# Nexus

## Introduction

[Nexus](https://www.sonatype.com/nexus-repository-sonatype) is a repository manager that can store and manage components, build artifacts, and release candidates in one central location. At stakater, we use nexus to store docker images of our prod application like stakaterfrontend and emailservice etc.

### Chart

We use public helm charts to deploy nexus on our cluster. [Here](https://github.com/helm/charts/tree/master/stable/sonatype-nexus) is the public chart that we use and `1.12.1` is the public chart version that is used in our cluster. We use umbrella charts to deploy nexus on our cluster. Currently we are using [this](https://github.com/stakater/stakaterkubehelmrelease) repository for nexus deployment.

### Image

Currently we are using this `quay.io/travelaudience/docker-nexus:3.13.0_alpine_3.8.1` public image for nexus in stakater.

### Cherry Pickable

Yes

### Single Sign-on

No, currently nexus does not support SSO with keycloak.

## Installation

### Installation Steps

1. Nexus can be deployed using pipeline of [this](https://github.com/stakater/stakaterkubehelmrelease) repository. We can also deploy this manually (not recommended) via console. To deploy it manually
    1. Download the chart
    ```bash
    helm repo add stable https://kubernetes-charts.storage.googleapis.com
    helm repo update
    helm fetch stable/sonatype-nexus --version 1.12.1
    ```
    2. Unzip the chart and go the the unzipped chart directory.
    3. Update the values.yaml file. See the hard coded values [here](#Hard-coded-values)
    4. Run below command
    ```bash
    helm install --name <release name> . --namespace <namespace name>
    ```

### Post Installation Configuration

No manual configuration is needed. All configurations are handled in post start configuration script. This script disables the default user admin and instead creates a new user with following credentials

```yaml
username: stackator-admin
password: testpwd
```

You can manually pull and push the images using below command.

```bash
docker login -u stackator-admin -p @qwerty786 docker.release.stakater.com:443

docker pull docker.release.stakater.com:443/stakater/stakaterfrontend:1.0.2
docker push docker.release.stakater.com:443/stakater/stakaterfrontend:1.0.2
```

### Web UI Access

You can access the nexus UI using this url: https://nexus.release.stakater.com/

### Dependencies

Nexus does not depend on other charts

### Hard-coded-values

Below are hard coded values for nexus.
**NOTE** All credentials used here are not real. Please get the latest credentials before using these hard coded values.

dockerPort, nexusPort, serviceType and annotations are hard coded

```yaml
sonatype-nexus:
  nexus:
    dockerPort: 5003
    nexusPort: 8081
    serviceType: ClusterIP
    annotations:
      config.xposer.stakater.com/Domain: stakater.com
      config.xposer.stakater.com/IngressNameTemplate: '{{.Service}}-{{.Namespace}}'
      config.xposer.stakater.com/IngressURLTemplate: '{{.Service}}.{{.Namespace}}.{{.Domain}}'
      xposer.stakater.com/annotations: |-
        kubernetes.io/ingress.class: internal-ingress
        ingress.kubernetes.io/force-ssl-redirect: true
        ingress.kubernetes.io/proxy-body-size: 900m
        forecastle.stakater.com/expose: true
        forecastle.stakater.com/icon: https://github.com/stakater/ForecastleIcons/raw/master/nexus.png
        forecastle.stakater.com/appName: Nexus
```

Nexusproxy should be disabled. Service name, port, target port and labels are hard coded.

```yaml
sonatype-nexus:
  nexusProxy:
    enabled: false
    svcName: nexus
    port: 80
    targetPort: 8081
    labels:
      expose: "true"
```

Docker service name, portname, servicetype, labels, annotations, targetport and port are hard coded.

```yaml
sonatype-nexus:
  service:
    enabled: true
    name: docker
    portName: docker
    serviceType: ClusterIP
    labels:
      expose: "true"
    annotations:
      config.xposer.stakater.com/Domain: stakater.com
      config.xposer.stakater.com/IngressNameTemplate: '{{.Service}}-{{.Namespace}}'
      config.xposer.stakater.com/IngressURLTemplate: '{{.Service}}.{{.Namespace}}.{{.Domain}}'
      xposer.stakater.com/annotations: |-
        kubernetes.io/ingress.class: internal-ingress
        ingress.kubernetes.io/force-ssl-redirect: true
        ingress.kubernetes.io/proxy-body-size: 900m
    targetPort: 5003
    port: 80
```

Accessmode, annotations, storageclass and storagesize are hard coded.

```yaml
sonatype-nexus:
  persistence:
    enabled: true
    accessMode: ReadWriteOnce
    annotations:
      helm.sh/resource-policy: keep
    storageClass: "efs"
    storageSize: 50Gi
```

Deployment has 2 init containers and a post start script.

```yaml
sonatype-nexus:
  deployment:
    initContainers:
    - name: fmp-volume-permission
      image: busybox
      imagePullPolicy: IfNotPresent
      command: ['chown','-R', '200', '/nexus-data']
      volumeMounts:
        - name: nexus-data
          mountPath: /nexus-data
    - name: fmp-volume-permission2
      image: busybox
      imagePullPolicy: IfNotPresent
      command: ['chmod','-R', '777', '/sonatype-nexus-conf']
      volumeMounts:
        - name: sonatype-nexus-conf
          mountPath: /sonatype-nexus-conf
    postStart:
      command: '["/bin/sh", "-c", "/sonatype-nexus-conf/postStart.sh"]'
```

Nexus also has an additional volume mount

```yaml
sonatype-nexus:
  secret:
    enabled: true
    mountPath: /etc/secret-volume
    readOnly: true
```

Secrets can be placed at secrets.yaml as encrypted format.

```yaml
sonatype-nexus:
    secret:
        data:
            .admin_account.json: base64 admin account
            .cluster_account.json: base64 cluster account
```

Nexus configmap contains the postStart configuration script.

```yaml
sonatype-nexus:
  config:
    enabled: true
    mountPath: /sonatype-nexus-conf
    data:
      postStart.sh: |
        #!/usr/bin/env bash
        HOST=localhost:8081

        # default user setup by Nexus. In the end of this script I will remove all roles from this account
        USERNAME=admin
        PASSWORD=admin123

        apk add --no-cache curl

        # Admin Account details specified in nexus secret .admin_account.json
        ADMIN_ACCOUNT_USERNAME=stackator-admin
        # Cluster Account details specified in nexus secret .cluster_account.json
        CLUSTER_ACCOUNT_USERNAME=stackator-cluster

        echo `pwd`
        cd /sonatype-nexus-conf/

        REPOS=($(ls | grep json | sed -e 's/\..*$//'))

        until $(curl --output /dev/null --silent --head --fail http://$HOST/); do
          echo $?
          printf '.'
          sleep 5
        done

        if [ ${#REPOS[@]} -lt 1 ]
        then
          echo "Not enough JSON files!"
          exit 1
        fi

        echo "uploading secret admin account script"
        STATUSCODE=$(curl --output /dev/stderr --silent -v -u $USERNAME:$PASSWORD --header "Content-Type: application/json" --write-out "%{http_code}" "http://$HOST/service/rest/v1/script/" -d @/etc/secret-volume/.admin_account.json)
        if [ $STATUSCODE -eq 403 ]
        then
          echo "Already initialized; as we remove rights of the admin user in the end of this script; when it runs first time. So, when container restarts it should work."
          exit 0
        elif [ $STATUSCODE -lt 200 ] || [ $STATUSCODE -gt 299 ]
        then
            echo "Could not upload secret"
            exit 1
        else
          echo $STATUSCODE
        fi

        echo "Executing secret admin account script"
        STATUSCODE=$(curl --output /dev/stderr --silent -v -X POST -u $USERNAME:$PASSWORD --header "Content-Type: text/plain" --write-out "%{http_code}" "http://$HOST/service/rest/v1/script/${ADMIN_ACCOUNT_USERNAME}/run")
        if [ $STATUSCODE -lt 200 ] || [ $STATUSCODE -gt 299 ]
        then
            echo "Could not execute secret"
            exit 1
        fi

        echo "Delete secret admin account script"
        STATUSCODE=$(curl -X "DELETE" --output /dev/stderr --silent -v -u $USERNAME:$PASSWORD  --write-out "%{http_code}" "http://$HOST/service/rest/v1/script/${ADMIN_ACCOUNT_USERNAME}")
        if [ $STATUSCODE -lt 200 ] || [ $STATUSCODE -gt 299 ]
        then
            echo "Could not delete secret"
            exit 1
        fi

        echo "Uploading secret cluster account script"
        STATUSCODE=$(curl --output /dev/stderr --silent -v -u $USERNAME:$PASSWORD --header "Content-Type: application/json" --write-out "%{http_code}" "http://$HOST/service/rest/v1/script/" -d @/etc/secret-volume/.cluster_account.json)
        if [ $STATUSCODE -lt 200 ] || [ $STATUSCODE -gt 299 ]
        then
            echo "Could not upload secret"
            exit 1
        fi

        echo "Executing secret cluster account script"
        STATUSCODE=$(curl --output /dev/stderr --silent -v -X POST -u $USERNAME:$PASSWORD --header "Content-Type: text/plain" --write-out "%{http_code}" "http://$HOST/service/rest/v1/script/${CLUSTER_ACCOUNT_USERNAME}/run")
        if [ $STATUSCODE -lt 200 ] || [ $STATUSCODE -gt 299 ]
        then
            echo "Could not execute secret"
            exit 1
        fi

        echo "Deleting secret cluster account script"
        STATUSCODE=$(curl -X "DELETE" --output /dev/stderr --silent -v -u $USERNAME:$PASSWORD  --write-out "%{http_code}" "http://$HOST/service/rest/v1/script/${CLUSTER_ACCOUNT_USERNAME}")
        if [ $STATUSCODE -lt 200 ] || [ $STATUSCODE -gt 299 ]
        then
            echo "Could not delete secret"
            exit 1
        fi

        for i in "${REPOS[@]}"
        do
          echo "creating $i repository"
          STATUSCODE=$(curl --output /dev/stderr --silent -v -u $USERNAME:$PASSWORD --header "Content-Type: application/json" --write-out "%{http_code}" "http://$HOST/service/rest/v1/script/" -d @$i.json)
          if [ $STATUSCODE -lt 200 ] || [ $STATUSCODE -gt 299 ]
          then
              echo "Could not upload $i"
              exit 1
          fi

          STATUSCODE=$(curl --output /dev/stderr --silent -v -X POST -u $USERNAME:$PASSWORD --header "Content-Type: text/plain" --write-out "%{http_code}" "http://$HOST/service/rest/v1/script/$i/run")
          if [ $STATUSCODE -lt 200 ] || [ $STATUSCODE -gt 299 ]
          then
              echo "Could not execute $i"
              exit 1
          fi
        done

        exit $?

      rutauth.json: |
        {
          "name": "rutauth",
          "type": "groovy",
          "content": "import groovy.json.JsonOutput; import org.sonatype.nexus.capability.CapabilityReference; import org.sonatype.nexus.capability.CapabilityType;  import org.sonatype.nexus.internal.capability.DefaultCapabilityReference;import org.sonatype.nexus.internal.capability.DefaultCapabilityRegistry; def capabilityRegistry = container.lookup(DefaultCapabilityRegistry.class.getName()); def capabilityType = CapabilityType.capabilityType('rutauth'); def capabilityProps = ['httpHeader': 'X-AUTH-STAKATER']; def capabilityNotes = 'configured through scripting api'; DefaultCapabilityReference existing = capabilityRegistry.all.find { CapabilityReference capabilityReference -> capabilityReference.context().descriptor().type() == capabilityType }; if (!existing) { capabilityRegistry.add(capabilityType, true, capabilityNotes, capabilityProps).toString(); JsonOutput.toJson([result : 'Successfully added Rut Auth!']) }"
        }

      eclipselink.json: |
        {
          "name": "eclipselink",
          "type": "groovy",
          "content": "repository.createMavenProxy('eclipselink', 'http://download.eclipse.org/rt/eclipselink/maven.repo/')"
        }

      fuse.json: |
        {
          "name": "fuse",
          "type": "groovy",
          "content": "repository.createMavenProxy('fuse', 'https://repository.jboss.org/nexus/content/repositories/fs-releases/')"
        }

      fuse-ea.json: |
        {
          "name": "fuse-ea",
          "type": "groovy",
          "content": "repository.createMavenProxy('fuse-ea', 'https://repo.fusesource.com/nexus/content/groups/ea/')"
        }

      jboss.json: |
        {
          "name": "jboss",
          "type": "groovy",
          "content": "repository.createMavenProxy('jboss', 'https://repository.jboss.org/nexus/content/groups/public/')"
        }

      jboss-http: |
        {
          "name": "jboss-http",
          "type": "groovy",
          "content": "repository.createMavenProxy('jboss-http', 'http://repository.jboss.org/nexus/content/groups/public/')"
        }

      jcenter.json: |
        {
          "name": "jcenter",
          "type": "groovy",
          "content": "repository.createMavenProxy('jcenter', 'http://jcenter.bintray.com/')"
        }

      jenkins-ci.json: |
        {
          "name": "jenkins-ci",
          "type": "groovy",
          "content": "repository.createMavenProxy('jenkins-ci', 'http://repo.jenkins-ci.org/public/')"
        }

      npm-internal.json: |
        {
          "name": "npm-internal",
          "type": "groovy",
          "content": "repository.createNpmHosted('npm-internal')"
        }

      npmjs.json: |
        {
          "name": "npmjs",
          "type": "groovy",
          "content": "repository.createNpmProxy('npmjs', 'https://registry.npmjs.org')"
        }

      servicemix.json: |
        {
          "name": "servicemix",
          "type": "groovy",
          "content": "repository.createMavenProxy('servicemix', 'http://svn.apache.org/repos/asf/servicemix/m2-repo/')"
        }

      sonatype-snapshots.json: |
        {
          "name": "sonatype-snapshots",
          "type": "groovy",
          "content": "repository.createMavenProxy('sonatype-snapshots', 'https://oss.sonatype.org/content/repositories/snapshots/')"
        }

      sonatype-staging.json: |
        {
          "name": "sonatype-staging",
          "type": "groovy",
          "content": "repository.createMavenProxy('sonatype-staging', 'https://oss.sonatype.org/content/repositories/staging/')"
        }

      spring-milestone.json: |
        {
          "name": "spring-milestone",
          "type": "groovy",
          "content": "repository.createMavenProxy('spring-milestone', 'http://repo.spring.io/milestone/')"
        }

      spring-release.json: |
        {
          "name": "spring-release",
          "type": "groovy",
          "content": "repository.createMavenProxy('spring-release', 'http://repo.spring.io/release/')"
        }

      zzz_npm-all.json: |
        {
          "name": "zzz_npm-all",
          "type": "groovy",
          "content": "repository.createNpmGroup('npm-all', ['npmjs','npm-internal'])"
        }

      zzz_public.json: |
        {
          "name": "zzz_public",
          "type": "groovy",
          "content": "repository.createMavenGroup('public', ['fuse','jboss','jenkins-ci','maven-central','maven-public','maven-releases','maven-snapshots','sonatype-snapshots','sonatype-staging'])"
        }
      stackator-docker.json: |
        {
          "name": "stackator-docker",
          "type": "groovy",
          "content": "repository.createDockerHosted('stackator-docker', 5003, null, 'default', false, true, org.sonatype.nexus.repository.storage.WritePolicy.ALLOW)"
        }
      remove-anonymous-configuration.json: |
        {
          "name": "remove-anonymous-configuration",
          "type": "groovy",
          "content": "security.setAnonymousAccess(false)"
        }
      zzzz-remove-default.json: |
        {
          "name": "zzzz-remove-default",
          "type": "groovy",
          "content": "security.setUserRoles('admin', [])"
        }
```