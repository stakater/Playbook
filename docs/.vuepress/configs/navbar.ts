import type { NavbarConfig } from "@vuepress/theme-default";

export const navbarEn: NavbarConfig = [
  {
    text: "Playbook Home",
    link: "/content/kubernetes/aws",
  },

  {
    text: "Stakater Home",
    link: "https://www.stakater.com/",
  },
  {
    text: "Offerings",
    children: [
      {
        text: "SAAP",
        link: "https://www.stakater.com/saap-kubernetes-openshift",
      },
      {
        text: "Consultancy",
        link: "https://www.stakater.com/kubernetes-consultancy",
      },
    ],
  },
  {
    text: "Learnings",
    children: [
      {
        text: "Events",
        link: "https://www.stakater.com/events",
      },
    ],
  },
  {
    text: "Platform Assessment",
    link: "https://www.stakater.com/kubernetes-platform-assessment",
  },
  {
    text: "More",
    children: [
      {
        text: "Careers",
        link: "https://www.stakater.com/careers",
      },
      {
        text: "FAQs",
        link: "https://www.stakater.com/faqs",
      },
    ],
  },
];
