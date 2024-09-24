import type { LocaleObject } from '@nuxtjs/i18n/dist/runtime/composables'
import locales from './maintenance/locales.json'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  spaLoadingTemplate: 'spa-loading-template.html',
  app: {
    baseURL: '/yunohost/sso',
    buildAssetsDir: '/assets/',
    head: {
      link: [
        { rel: 'stylesheet', href: '/yunohost/sso/customassets/custom.css' },
      ],
    },
  },
  modules: [
    '@nuxtjs/color-mode',
    '@nuxtjs/i18n',
    '@nuxtjs/tailwindcss',
    'nuxt-icons',
    '@nuxtjs/google-fonts',
  ],
  vite: {
    server: {
      fs: {
        // For `./ynh-dev use-git yunohost-portal` to work
        allow: ['/var/cache/ynh-dev/yunohost-portal/'],
      },
    },
  },
  devtools: { enabled: true },
  googleFonts: {
    families: {
      'Source+Sans+3': [500, 900],
    },
  },
  runtimeConfig: {
    public: {
      apiIp: '', // overridden by NUXT_PUBLIC_API_IP environment variable
    },
  },
  i18n: {
    strategy: 'no_prefix',
    lazy: true,
    langDir: 'locales',
    locales: locales as LocaleObject[],
    detectBrowserLanguage: {
      useCookie: false,
    },
  },
  colorMode: {
    preference: 'system',
    dataValue: 'theme',
    classSuffix: '',
  },
  compatibilityDate: '2024-09-24',
})
