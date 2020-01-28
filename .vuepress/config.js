module.exports = {
    title: 'Stakater Playbook',

    head: [
        ['link', { rel: 'icon', href: '/favicon.png' }]
    ],

    plugins: [
        [
            'vuepress-plugin-medium-zoom',
        ],
    ],

    themeConfig: {
        sidebar: [
            {
                title: 'Kubernetes',
                children: [
                    '/content/kubernetes/cluster-aws',
                    '/content/kubernetes/cluster-azure',
                ]
            },
            {
                title: 'Openshift',
                children: [
                    '/content/openshift/cluster-openshift-azure'
                ]
            },
            {
                title: 'Stakater Platform',
                children: [
                    '/content/stakaterplatform/stakaterplatform'
                ]
            },
            // {
            //     title: 'Stacks',
            //     children: [
            //         '/content/stacks/introduction',
            //         '/content/stacks/control',
            //         '/content/stacks/delivery',
            //         '/content/stacks/logging',
            //         '/content/stacks/monitoring',
            //         '/content/stacks/security',
            //         '/content/stacks/alerting',
            //         '/content/stacks/tracing'
            //     ]
            // },
            {
                title: 'Stack: Control',
                children: [
                    '/content/stacks/control/introduction',
                    '/content/stacks/control/external-dns',
                    '/content/stacks/control/nginx-ingress',
                    '/content/stacks/control/descheduler',
                    '/content/stacks/control/forecastle',
                    '/content/stacks/control/reloader',
                    '/content/stacks/control/kubernetesdashboard',
                    '/content/stacks/control/gitwebhookproxy',
                    '/content/stacks/control/ingressmonitorcontroller',
                    '/content/stacks/control/xposer'
                ]
            },
            {
                title: 'Stack: Delivery',
                children: [
                    '/content/stacks/delivery/introduction',
                    '/content/stacks/delivery/jenkins',
                    '/content/stacks/delivery/sonatype-nexus'
                ]
            },
            {
                title: 'Stack: Logging',
                children: [
                    '/content/stacks/logging/introduction',
                    '/content/stacks/logging/log-generation',
                    '/content/stacks/logging/logging-flow',
                    '/content/stacks/logging/configure-kibana',
                ]
            },
            {
                title: 'Stack: Monitoring',
                children: [
                    '/content/stacks/monitoring/introduction',
                    '/content/stacks/monitoring/prometheus-operator-in-openshift',
                    '/content/stacks/monitoring/prometheus-in-openshift',
                    '/content/stacks/monitoring/alert-manager-in-openshift',
                    '/content/stacks/monitoring/grafana-in-openshift',
                    '/content/stacks/monitoring/monitoring-buisness-apps',
                    '/content/stacks/monitoring/creating-hooks-slack'
                ]
            },
            {
                title: 'Stack: Security',
                children: [
                    '/content/stacks/security/introduction',
                    '/content/stacks/security/keycloak',
                    '/content/stacks/security/sealed-secrets',
                    '/content/stacks/security/proxy-injector',
                    '/content/stacks/security/micro-segmentation',
                    '/content/stacks/security/ip-whitelisting',
                    '/content/stacks/security/secrets-management',
                    '/content/stacks/security/rbac',
                    '/content/stacks/security/keycloak-gatekeeper'
                ]
            },
            {
                title: 'Stack: Alerting',
                children: [
                    '/content/stacks/alerting/introduction',
                    // '/content/stacks/alerting/chowkidar',
                    '/content/stacks/alerting/prometheus',
                    '/content/stacks/alerting/uptime-checkers',
                    '/content/stacks/alerting/slack-notifications-for-teams'
                ]
            },
            {
                title: 'Stack: Tracing',
                children: [
                    '/content/stacks/tracing/introduction',
                ]
            },
            {
                title: 'Application: Nordmart',
                children: [
                    '/content/nordmart/nordmart-intro'
                ]
            },
            {
                title: 'Processes: Bootstrapping',
                children: [
                    '/content/processes/bootstrapping/github-organization',
                    '/content/processes/bootstrapping/maven-apps',
                    '/content/processes/bootstrapping/gitlab-project-via-terraform',
                    // Documents given below have been disabled because now individual stack
                    // has become part of StakaterPlatform.
                    // '/content/processes/bootstrapping/deploying-stakater-stacks',
                    // '/content/processes/bootstrapping/stack-global',
                    // '/content/processes/bootstrapping/stack-release',
                    // '/content/processes/bootstrapping/stack-logging',
                    // '/content/processes/bootstrapping/stack-monitoring',
                    // '/content/processes/bootstrapping/stack-tracing',
                    '/content/processes/bootstrapping/gitlab-pipeline-configuration',
                    'content/processes/bootstrapping/github-integration-with-gitlab-pipeline'
                ]
            },
            {
                title: 'Processes: Versioning',
                children: [
                    '/content/processes/versioning/introduction',
                    '/content/processes/versioning/branching',
                    '/content/processes/versioning/versioning',
                    '/content/processes/versioning/github-configuration',
                    '/content/processes/versioning/repository-structure'
                ]
            },
            {
                title: 'Processes: Exposing apps',
                children: [
                    '/content/processes/exposing/introduction',
                    '/content/processes/exposing/services',
                    '/content/processes/exposing/service-types',
                    '/content/processes/exposing/ingress',
                    '/content/processes/exposing/dns',
                    '/content/processes/exposing/securing-connection',
                    '/content/processes/exposing/xposer',
                    '/content/processes/exposing/birds-eye-view',
                    '/content/processes/exposing/tls-using-cert-manager',
                    '/content/processes/exposing/azure-cluster-with-aws-subdomain',
                    '/content/processes/exposing/create-use-tls-custom-cert'
                ]
            },
            {
                title: 'Processes: GitOps',
                children: [
                    '/content/processes/gitops/introduction',
                    '/content/processes/gitops/principles',
                    '/content/processes/gitops/birds-eye-view-jenkins',
                    '/content/processes/gitops/gitops-with-jenkins',
                    '/content/processes/gitops/birds-eye-view-flux',
                    '/content/processes/gitops/gitops-with-flux'
                ]
            },
            {
                title: 'Processes: Deployment',
                children: [
                    '/content/processes/deployment/introduction',
                    '/content/processes/deployment/forecastle',
                    '/content/processes/deployment/Helm-operator',
                    '/content/processes/deployment/resources-cleanup',
                    '/content/processes/deployment/aks-azure'
                ]
            },
            {
                title: 'Workshop: Setting Up',
                children: [
                    '/content/workshop/cluster-deployment',
                    //'/content/stacks/deploy',
                    '/content/workshop/aad-in-openshift',
                    '/content/workshop/application-deployment'
                ]
            },
            {
                title: 'Workshop: Konfigurator',
                children: [
                    '/content/workshop/konfigurator/introduction',
                    '/content/workshop/konfigurator/scenario',
                    '/content/workshop/konfigurator/use-cases'
                    
                ]
            },
            {
                title: 'Workshop: Nordmart',
                children: [
                    '/content/workshop/nordmart/nordmart-ci-cd',
                    '/content/workshop/nordmart/nordmart-scenario',
                    '/content/workshop/nordmart/routes',
                    '/content/workshop/nordmart/add-new-service.md'
                ]
            },
            {
                title: 'Workshop: Sealed Secrets',
                children: [
                    '/content/workshop/sealed-secrets/introduction',
                    '/content/workshop/sealed-secrets/workshop',
                    '/content/workshop/sealed-secrets/management',
                    '/content/workshop/sealed-secrets/caveats'

                ]
            }
        ],
        repo: 'stakater/playbook'
    }
}
