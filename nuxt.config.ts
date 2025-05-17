// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  eslint: {
    checker: true,
  },
  vite: {
    plugins: [tailwindcss()],
    server: {
      watch: {
        ignored: ["**/config/**"],
      },
    },
  },
  nitro: {
    routeRules: {
      "/radarr/**": {
        proxy: {
          to: "/api/proxy/radarr/**",
        },
      },
      "/sonarr/**": {
        proxy: {
          to: "/api/proxy/sonarr/**",
        },
      },
      "/overseerr/**": {
        proxy: {
          to: "/api/proxy/overseerr/**",
        },
      },
    },
  },
  modules: ["@cssninja/nuxt-toaster", "@sidebase/nuxt-auth", "@nuxt/eslint"],
  runtimeConfig: {
    baseURL: "/api/auth",
  },
  auth: {
    originEnvKey: "NUXT_BASE_URL",
    globalAppMiddleware: true,
    provider: {
      type: "local",
      token: {
        type: "",
        headerName: "X-Plex-Token",
        maxAgeInSeconds: 2592000,
      },
      refresh: {
        isEnabled: false,
      },
      endpoints: {
        signIn: { path: "/login", method: "post" },
        signOut: false,
        signUp: false,
        getSession: { path: "/user", method: "get" },
      },
      pages: {
        login: "/login",
      },
    },
  },
  css: ["~/assets/app.css"],
});
