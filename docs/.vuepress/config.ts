import { defineUserConfig } from '@vuepress/cli' 
import { defaultTheme } from '@vuepress/theme-default'
import { head, navbarEn, sidebarEn } from './configs'
import { searchPlugin } from '@vuepress/plugin-search';
import { googleAnalyticsPlugin } from '@vuepress/plugin-google-analytics'
import { pwaPlugin } from '@vuepress/plugin-pwa';
import { pwaPopupPlugin } from '@vuepress/plugin-pwa-popup';

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

  plugins: [
    searchPlugin({
      maxSuggestions: 10,
    }),
    googleAnalyticsPlugin({
      id: 'G-TTH1YYW5TX',
    }),
    pwaPlugin({
      skipWaiting: false,
      cleanupOutdatedCaches: true,
      offlineGoogleAnalytics: true,
    }),
    pwaPopupPlugin({
      locales: {
        '/': {
          message: 'New content is available.',
          buttonText: 'Refresh',
        },
      }
    }),
  ],
})
