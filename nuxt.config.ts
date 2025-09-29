// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  ssr: false,
  typescript: { strict: true },
  css: ['vuetify/styles', '@/assets/main.css'],
  build: {
    transpile: ['vuetify']
  },
  modules: [],
  vite: {
    define: { 'process.env.DEBUG': false }
  }
})