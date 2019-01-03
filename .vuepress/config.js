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
            }
        ],
        repo: 'stakater/playbook'
    }
}
