import type { SidebarConfig } from "@vuepress/theme-default";

export const sidebarEn: SidebarConfig = [
  {
    text: "Kubernetes",
    collapsible: true,
    children: [
      '/content/kubernetes/aws',
      '/content/kubernetes/azure',
    ],
  },
  {
    text: "Openshift",
    collapsible: true,
    children: [
      '/content/openshift/cluster-openshift-azure'
    ],
  },
  {
    text: "Stakater Platform",
    collapsible: true,
    children: [
      '/content/stakaterplatform/stakaterplatform'
    ],
  },
  {
    text: "Application Nordmart",
    collapsible: true,
    children: [
      '/content/nordmart/nordmart-intro'
    ],
  },
  {
    text: "Processes: Bootstrapping",
    collapsible: true,
    children: [
      '/content/processes/bootstrapping/github-organization',
      '/content/processes/bootstrapping/maven-apps',
      '/content/processes/bootstrapping/gitlab-project-via-terraform',
      '/content/processes/bootstrapping/gitlab-pipeline-configuration',
      'content/processes/bootstrapping/github-integration-with-gitlab-pipeline'
    ],
  },
  {
    text: "Processes: Versioning",
    collapsible: true,
    children: [
      '/content/processes/versioning/introduction',
      '/content/processes/versioning/branching',
      '/content/processes/versioning/versioning',
      '/content/processes/versioning/github-configuration',
      '/content/processes/versioning/repository-structure'
    ],
  },
  {
    text: "Processes: Exposing",
    collapsible: true,
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
    ],
  },
  {
    text: "Processes: GitOps",
    collapsible: true,
    children: [
      '/content/processes/gitops/introduction',
      '/content/processes/gitops/principles',
      '/content/processes/gitops/birds-eye-view-jenkins',
      '/content/processes/gitops/gitops-with-jenkins',
      '/content/processes/gitops/birds-eye-view-flux',
      '/content/processes/gitops/gitops-with-flux'
    ],
  },
  {
    text: "Processes: Deployment",
    collapsible: true,
    children: [
      '/content/processes/deployment/introduction',
      '/content/processes/deployment/forecastle',
      '/content/processes/deployment/Helm-operator',
      '/content/processes/deployment/resources-cleanup',
      '/content/processes/deployment/aks-azure'
    ],
  },

  {
    text: "Workshop: Setting Up",
    collapsible: true,
    children: [
      '/content/workshop/cluster-deployment',
      '/content/workshop/aad-in-openshift',
      '/content/workshop/application-deployment'
    ],
  },
  {
    text: "Workshop: Konfigurator",
    collapsible: true,
    children: [
      '/content/workshop/konfigurator/introduction',
      '/content/workshop/konfigurator/scenario',
      '/content/workshop/konfigurator/use-cases'
    ],
  },
  {
    text: "Workshop: Nordmart",
    collapsible: true,
    children: [
      '/content/workshop/nordmart/nordmart-ci-cd',
      '/content/workshop/nordmart/nordmart-scenario',
      '/content/workshop/nordmart/routes',
      '/content/workshop/nordmart/add-new-service.md'
    ],
  },
  {
    text: "Workshop: Sealed Secrets",
    collapsible: true,
    children: [
      '/content/workshop/sealed-secrets/introduction',
      '/content/workshop/sealed-secrets/workshop',
      '/content/workshop/sealed-secrets/management',
      '/content/workshop/sealed-secrets/caveats'
    ],
  },
];
