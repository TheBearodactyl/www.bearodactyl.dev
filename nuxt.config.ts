// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/image', '@nuxtjs/i18n', "@vueuse/nuxt"],
  i18n: {
    defaultLocale: 'en',
    locales: [
      { code: "en", name: "English", file: "en.json" },
      { code: "es", name: "Spanish", file: "sp.json" },
    ],
  }
})