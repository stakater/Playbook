module.exports = {
    title: 'Stakater Playbook',

    head: [
        ['link', { rel: 'icon', href: '/favicon.png' }]
    ],

    themeConfig: {
        sidebar: [
            '/',
            {
                title: 'Versioning',
                children: [
                    '/content/versioning/introduction',
                    '/content/versioning/branching',
                    '/content/versioning/versioning',
                    '/content/versioning/github-configuration',
                    '/content/versioning/repository-structure'
                ]
            }, 
            {
                title: 'Global Stack',
                children: [
                    '/stacks/global/external-dns/developer-documentation',
                    '/stacks/global/external-dns/installation',
                    '/stacks/global/gitwebhookproxy/developer-documentation',
                    '/stacks/global/gitwebhookproxy/installation',
                    '/stacks/global/keycloak/developer-documentation',
                    '/stacks/global/keycloak/installation',
                    '/stacks/global/kubernetes-dashboard/developer-documentation',
                    '/stacks/global/kubernetes-dashboard/installation',
                    '/stacks/global/nginx-ingress/developer-documentation',
                    '/stacks/global/nginx-ingress/external/installation',
                    '/stacks/global/nginx-ingress/internal/installation'
                ]
            },
            {
                title: 'Logging Stack',
                children: [
                    '/stacks/logging/cerebro/developer-documentation',
                    '/stacks/logging/cerebro/installation',
                    '/stacks/logging/elasticsearch/developer-documentation',
                    '/stacks/logging/elasticsearch/installation',
                    '/stacks/logging/elasticsearch-curator/developer-documentation',
                    '/stacks/logging/elasticsearch-curator/installation',
                    '/stacks/logging/elasticsearch-operator/developer-documentation',
                    '/stacks/logging/elasticsearch-operator/installation',
                    '/stacks/logging/fluentd/developer-documentation',
                    '/stacks/logging/fluentd/installation',
                    '/stacks/logging/kibana/developer-documentation',
                    '/stacks/logging/kibana/installation',
                    '/stacks/logging/konfigurator/developer-documentation',
                    '/stacks/logging/konfigurator/installation',
                    '/stacks/logging/logrotate/developer-documentation',
                    '/stacks/logging/logrotate/installation'
                ]
            },
            {
                title: 'Release Stack',
                children: [
                    '/stacks/release/chartmuseum/developer-documentation',
                    '/stacks/release/chartmuseum/installation',
                    '/stacks/release/jenkins/developer-documentation',
                    '/stacks/release/jenkins/installation',
                    '/stacks/release/nexus/developer-documentation',
                    '/stacks/release/nexus/installation',
                    '/stacks/release/restful-distributed-lock-manager/developer-documentation',
                    '/stacks/release/restful-distributed-lock-manager/installation',
                    '/stacks/release/sonarqube/developer-documentation',
                    '/stacks/release/sonarqube/installation'
                ]
            }
        ],
        repo: 'stakater/playbook'
    }
}
