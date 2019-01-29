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
                    '/content/processes/exposing/birds-eye-view'
                ]
            },
            {
                title: 'Processes: Logging',
                children: [
                    '/content/processes/logging/introduction',
                    '/content/processes/logging/fluentd'
                ]
            },
            {
                title: 'Tools: Global Stack',
                children: [
                    '/content/tools/global/external-dns/developer-documentation',
                    '/content/tools/global/gitwebhookproxy/developer-documentation',
                    '/content/tools/global/keycloak/developer-documentation',
                    '/content/tools/global/kubernetes-dashboard/developer-documentation',
                    '/content/tools/global/nginx-ingress/developer-documentation',
                    '/content/tools/global/configmap/developer-documentation',
                    '/content/tools/global/secrets/developer-documentation',
                    '/content/tools/global/storage/developer-documentation',
                    '/content/tools/global/rbac/developer-documentation'
                ]
            },
            {
                title: 'Tools: Logging Stack',
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
                title: 'Tools: Release Stack',
                children: [
                    '/content/tools/release/chartmuseum/developer-documentation',
                    '/content/tools/release/jenkins/developer-documentation',
                    '/content/tools/release/nexus/developer-documentation',
                    '/content/tools/release/restful-distributed-lock-manager/developer-documentation',
                    '/content/tools/release/sonarqube/developer-documentation'
                ]
            }

        ],
        repo: 'stakater/playbook'
    }
}
