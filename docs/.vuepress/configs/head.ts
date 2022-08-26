import type { HeadConfig } from '@vuepress/core'

export const head: HeadConfig[] = [
  ['link', { rel: 'icon', type: 'image/png', sizes: '16x16', href: `/favicon.svg` }],
  ['link', { rel: 'manifest', href: '/manifest.webmanifest' }],
]
