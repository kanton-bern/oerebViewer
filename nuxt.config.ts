import { defineNuxtConfig } from 'nuxt/config'
import getLocales, { preloadContext } from './config/locales'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const configContext = process.env.NUXT_ENV_CONFIG_CONTEXT || 'defaults'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Preload the context to make it available synchronously
preloadContext(configContext)

export default defineNuxtConfig({
  // disable server side rendering: https://nuxtjs.org/docs/2.x/configuration-glossary/configuration-ssr
  ssr: false,

  nitro: {
    output: {
      publicDir: join(__dirname, 'dist'),
    },
  },

  runtimeConfig: {
    public: {
      configContext: process.env.NUXT_ENV_CONFIG_CONTEXT,
    },
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  app: {
    head: {
      title: process.env.NUXT_ENV_TITLE || 'ÖREB-Viewer | Visualiseur RDPPF',
      htmlAttrs: {
        lang: 'de',
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: '' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css?family=Asap:400,700&display=swap',
        },
      ],
    },
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['~/assets/css/app.css'],

  router: {
    options: {
      hashMode: true,
    },
  },

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/i18nLoader.ts',
    '~/plugins/vueToastification.ts',
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxt/devtools',
    // https://go.nuxtjs.dev/eslint
    '@nuxt/eslint',
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
    // https://pinia.vuejs.org/cookbook/plugins.html
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    // https://i18n.nuxtjs.org/
    '@nuxtjs/i18n',
    '~/modules/setupModule',
  ],

  // i18n configuration: https://i18n.nuxtjs.org/options-reference
  i18n: {
    lazy: true,
    // Disable the new directory structure to maintain compatibility with your custom setup
    restructureDir: false,
    langDir: 'locales',
    locales: getLocales(configContext),
    defaultLocale: 'de',
    strategy: 'prefix_except_default',
    vueI18n: './i18n.config.ts',
  },

  logLevel: 'verbose',

  compatibilityDate: '2024-09-26',
})
