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
    markdown: {
        lineNumbers: true,
        anchor: { permalink: false },
        // options for markdown-it-toc
        toc: { includeLevel: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }
    },
    themeConfig: {
        sidebar: [
            {
                title: 'Kubernetes',
                children: [
                    '/content/kubernetes/aws',
                    '/content/kubernetes/azure',
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
