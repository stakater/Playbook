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
                    '/content/processes/versioning/introduction',
                    '/content/processes/versioning/branching',
                    '/content/processes/versioning/versioning',
                    '/content/processes/versioning/github-configuration',
                    '/content/processes/versioning/repository-structure'
                ]
            },
            {
                title: 'Tools',
                children: [
                    '/content/tools/konfigurator/fluentd'
            }, 
            {
                title: 'Global Stack',
                children: [
                    '/stacks/global/external-dns/developer-documentation',
                    '/stacks/global/gitwebhookproxy/developer-documentation',
                    '/stacks/global/keycloak/developer-documentation',
                    '/stacks/global/kubernetes-dashboard/developer-documentation',
                    '/stacks/global/nginx-ingress/developer-documentation',
                    '/stacks/global/configmap/developer-documentation',
                    '/stacks/global/secrets/developer-documentation',
                    '/stacks/global/storage/developer-documentation',
                    '/stacks/global/rbac/developer-documentation'
                ]
            },
            {
                title: 'Logging Stack',
                children: [
                    '/stacks/logging/cerebro/developer-documentation',
                    '/stacks/logging/elasticsearch/developer-documentation',
                    '/stacks/logging/elasticsearch-curator/developer-documentation',
                    '/stacks/logging/elasticsearch-operator/developer-documentation',
                    '/stacks/logging/fluentd/developer-documentation',
                    '/stacks/logging/kibana/developer-documentation',
                    '/stacks/logging/konfigurator/developer-documentation',
                    '/stacks/logging/logrotate/developer-documentation'
                ]
            },
            {
                title: 'Release Stack',
                children: [
                    '/stacks/release/chartmuseum/developer-documentation',
                    '/stacks/release/jenkins/developer-documentation',
                    '/stacks/release/nexus/developer-documentation',
                    '/stacks/release/restful-distributed-lock-manager/developer-documentation',
                    '/stacks/release/sonarqube/developer-documentation'
                ]
            }

        ],
        repo: 'stakater/playbook'
    }
}
