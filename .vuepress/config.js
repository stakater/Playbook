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
                title: 'Getting Started - Creating Cluster',
                children: [
                    '/content/createcluster/cluster-aws',
                    '/content/createcluster/cluster-azure',
                    '/content/createcluster/cluster-openshift-azure'
                ]
            },
            {
                title: 'Stakater Platform',
                children: [
                    '/content/stakaterplatform/stakaterplatform'
                ]
            },
            {
                title: 'Stacks',
                children: [
                    '/content/stacks/control',
                    '/content/stacks/delivery',
                    '/content/stacks/logging',
                    '/content/stacks/monitoring',
                    '/content/stacks/security',
                    '/content/stacks/alerting',
                    '/content/stacks/tracing'
                ]
            },
            {
                title: 'Nordmart',
                children: [
                    '/content/nordmart/nordmart-intro',
                    '/content/nordmart/routes',
                    '/content/nordmart/nordmart-ci-cd',
                    '/content/nordmart/nordmart-scenario',
                    '/content/nordmart/add-new-service.md'
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
                title: 'Processes: Logging',
                children: [
                    '/content/processes/logging/introduction',
                    '/content/processes/logging/log-generation',
                    '/content/processes/logging/logging-flow',
                    '/content/processes/logging/configure-kibana',
                    '/content/processes/logging/birds-eye-view',
                ]
            },
            {
                title: 'Processes: Alerting',
                children: [
                    '/content/processes/alerting/introduction',
                    '/content/processes/alerting/chowkidar',
                    '/content/processes/alerting/prometheus',
                    '/content/processes/alerting/uptime-checkers',
                    '/content/processes/alerting/slack-notifications-for-teams'
                ]
            },
            {
                title: 'Processes: Security',
                children: [
                    '/content/processes/security/introduction',
                    '/content/processes/security/micro-segmentation',
                    '/content/processes/security/ip-whitelisting',
                    '/content/processes/security/secrets-management',
                    '/content/processes/security/sealed-secrets',
                    '/content/processes/security/rbac',
                    '/content/processes/security/keycloak',
                    '/content/processes/security/keycloak-gatekeeper',
                    '/content/processes/security/proxy-injector'
                ]
            },
            {
                title: 'Processes: GitOps',
                children: [
                    '/content/processes/gitops/introduction',
                    '/content/processes/gitops/principles',
                    '/content/processes/gitops/gitops-with-jenkins',
                    '/content/processes/gitops/gitops-with-flux',
                    '/content/processes/gitops/birds-eye-view-jenkins',
                    '/content/processes/gitops/birds-eye-view-flux'
                ]
            },
            {
                title: 'Processes: Bootstrapping',
                children: [
                    '/content/processes/bootstrapping/maven-apps',
                    '/content/processes/bootstrapping/gitlab-project-via-terraform',
                    '/content/processes/bootstrapping/deploying-stakater-stacks',
                    '/content/processes/bootstrapping/stack-global',
                    '/content/processes/bootstrapping/stack-release',
                    '/content/processes/bootstrapping/stack-logging',
                    '/content/processes/bootstrapping/stack-monitoring',
                    '/content/processes/bootstrapping/stack-tracing',
                    '/content/processes/bootstrapping/gitlab-pipeline-configuration',
                    'content/processes/bootstrapping/github-integration-with-gitlab-pipeline'
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
                title: 'Processes: Monitoring',
                children: [
                    '/content/processes/monitoring/prometheus-operator-in-openshift',
                    '/content/processes/monitoring/prometheus-in-openshift',
                    '/content/processes/monitoring/alert-manager-in-openshift',
                    '/content/processes/monitoring/grafana-in-openshift',
                    '/content/processes/monitoring/monitoring-buisness-apps',
                    '/content/processes/monitoring/creating-hooks-slack'
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
