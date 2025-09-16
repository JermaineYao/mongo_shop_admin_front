import fs from 'node:fs'
import path from 'node:path'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['normalize.css', '@/assets/scss/main.scss'],
  vite: {
    // optimizeDeps: { include: ['naive-ui', 'vueuc'] },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use "@/assets/scss/_variables.scss" as *;
            @use "@/assets/scss/_mixins.scss" as *;
          `
        }
      }
    }
  },
  modules: ['@nuxt/eslint', '@nuxt/fonts', '@nuxt/icon', '@nuxt/image', 'nuxtjs-naive-ui'],
  build: {
    transpile: ['naive-ui', 'vueuc']
  },
  // dev 開啟 HTTPS
  devServer: {
    host: 'https://127.0.0.1',
    port: 3000,
    https: {
      key: fs.readFileSync(path.resolve('cert/localhost-key.pem'), 'utf8'),
      cert: fs.readFileSync(path.resolve('cert/localhost.pem'), 'utf8')
      // ca: fs.readFileSync(path.resolve('cert/rootCA.pem'), 'utf8'),
    }
  }
})
