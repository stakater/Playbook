import { defineUserConfig } from '@vuepress/cli' 
import { defaultTheme } from '@vuepress/theme-default'
import { head, navbarEn, sidebarEn } from './configs'

export default defineUserConfig({
  // set site base to default value
  base: '/',

    // extra tags in `<head>`
    head,

  shouldPrefetch: false,
  
  // site-level locales config
  locales: {
    '/': {
      lang: 'en-US',
      title: 'Stakater Playbook',
      // Added empty string to override the default value
      description: ' ',
    },
  },

  // configure default theme
  theme: defaultTheme({
    logo: '/favicon.svg',
    docsDir: 'docs',

    repo: "stakater/Playbook",
    editLink: true,
    editLinkText: "Help us improve this page!",

    lastUpdated: false,
    contributors: false,
    colorModeSwitch: true,
    colorMode: "auto",

    // theme-level locales config
    locales: {
        '/': {
          // navbar
          navbar: navbarEn,
          // sidebar
          sidebar: sidebarEn,
        },
      },

    themePlugins: {
      git: false,
      mediumZoom: false,
      activeHeaderLinks: true,
      backToTop: true,
    },
  }),

})
