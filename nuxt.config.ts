// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  css: ['@/assets/css/tailwind.css'],
  // modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt", "@pinia-plugin-persistedstate/nuxt", "@nuxtjs/i18n"],
  modules: ["@nuxtjs/tailwindcss"],

  runtimeConfig: {
    public: {
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_KEY: process.env.SUPABASE_KEY,
    },
  },
  devtools: { enabled: true }
})
