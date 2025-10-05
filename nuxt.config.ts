// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['normalize.css', '@/assets/scss/main.scss'],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use "@/assets/scss/_variables.scss" as *;
            @use "@/assets/scss/_mixins.scss" as *;
          `
        }
      }
    },
    optimizeDeps: {
      include: ['naive-ui', 'vueuc', 'lodash-es', 'date-fns'] // 冷啟動更快
    }
  },
  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/image',
    'nuxtjs-naive-ui',
    [
      '@pinia/nuxt',
      {
        autoImports: ['defineStore', ['defineStore', 'definePiniaStore']]
      }
    ]
  ],
  build: {
    transpile: ['naive-ui', 'vueuc']
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api/v1'
    }
  },
  nitro: {
    routeRules: {
      '/api/v1/**': {
        // 開發時轉到本機；上線可用環境變數覆蓋（見下方備註）
        proxy: process.env.API_PROXY ?? 'http://127.0.0.1:1000/api/v1/**'
      },
      '/shop/user': { ssr: false },
      '/shop/user/cart': { ssr: false },
      '/shop/user/order': { ssr: false },
      '/shop/user/order/**': { ssr: false },
      '/shop/user/login': { ssr: false },
      '/shop/register': { ssr: false },
      '/shop/forgot/email': { ssr: false },
      '/shop/forgot/set_pwd/**': { ssr: false }
    }
  }
})
