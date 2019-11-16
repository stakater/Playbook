module.exports = {
    title: 'Stakater Playbook',

    head: [
        ['link', { rel: 'icon', href: '/favicon.png' }]
    ],

    themeConfig: {
        sidebar: [
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
                    '/content/processes/exposing/using-tls-custom-cert'
                ]
            },
            {
                title: 'Processes: Logging',
                children: [
                    '/content/processes/logging/introduction',
                    '/content/processes/logging/log-generation',
                    '/content/processes/logging/logging-flow',
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
                    '/content/processes/bootstrapping/cluster-aws',  
                    '/content/processes/bootstrapping/cluster-azure',
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
                title: 'Stack: Control',
                children: [
                    '/content/tools/control/external-dns/developer-documentation',
                    '/content/tools/control/gitwebhookproxy/developer-documentation',
                    '/content/tools/control/kubernetes-dashboard/developer-documentation',
                    '/content/tools/control/nginx-ingress/developer-documentation',
                    '/content/tools/control/configmap/developer-documentation',
                    '/content/tools/control/secrets/developer-documentation',
                    '/content/tools/control/storage/developer-documentation',
                    '/content/tools/control/rbac/developer-documentation',
                    '/content/tools/control/forecastle/developer-documentation',
                ]
            },
            {
                title: 'Stack: Delivery',
                children: [
                    '/content/tools/delivery/jenkins/developer-documentation',
                    '/content/tools/delivery/nexus/developer-documentation',
                    '/content/tools/delivery/restful-distributed-lock-manager/developer-documentation',
                ]
            },
            {
                title: 'Stack: Security',
                children: [
                    '/content/tools/control/keycloak/developer-documentation',
                    '/content/tools/control/proxyinjector/developer-documentation',
                ]
            },            
            {
                title: 'Stack: Logging ',
                children: [
                    '/content/tools/logging/cerebro/developer-documentation',
                    '/content/tools/logging/elasticsearch/developer-documentation',
                    '/content/tools/logging/elasticsearch-curator/developer-documentation',
                    '/content/tools/logging/elasticsearch-operator/developer-documentation',
                    '/content/tools/logging/fluentd/developer-documentation',
                    '/content/tools/logging/kibana/developer-documentation',
                    '/content/tools/logging/konfigurator/developer-documentation',
                    ['/content/tools/logging/konfigurator/fluentd','Konfigurator with Fluentd'],
                    '/content/tools/logging/logrotate/developer-documentation'
                ]
            },
            {
                title: 'Stack: Monitoring',
                children: [
                    '/content/tools/monitoring/prometheus-operator/developer-documentation',
                    '/content/tools/monitoring/prometheus/developer-documentation',
                    '/content/tools/monitoring/grafana/developer-documentation',
                    '/content/tools/monitoring/kube-state-metrics/developer-documentation',
                    '/content/tools/monitoring/node-exporter/developer-documentation',
                    '/content/tools/monitoring/alert-manager/developer-documentation'
                ]
            },
            {
                title: 'Stack: Tracing',
                children: [
                    '/content/tools/tracing/istio/developer-documentation',
                    '/content/tools/tracing/envoy/developer-documentation',
                    '/content/tools/tracing/pilot/developer-documentation',
                    '/content/tools/tracing/mixer/developer-documentation',
                    '/content/tools/tracing/citadel/developer-documentation',
                    '/content/tools/tracing/jaeger/developer-documentation'
                ]
            },
            {
                title: 'Workshop: Openshift',
                children: [
                    '/content/workshop/cluster-deployment',
                    '/content/workshop/add-new-service.md',
                    '/content/workshop/aad-in-openshift',
                    '/content/workshop/stacks-deployment',
                    '/content/workshop/application-deployment',
                    '/content/workshop/openshift',
                    '/content/workshop/reuse-sealedsecret'
                ]
            }
        ],
        repo: 'stakater/playbook'
    }
}
