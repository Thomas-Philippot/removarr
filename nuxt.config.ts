// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  app: {
    head: {
      meta: [
        {
          name: "theme-color",
          content: "#181926",
          media: "(prefers-color-scheme: dark)",
        },
        {
          name: "theme-color",
          content: "#dce0e8",
          media: "(prefers-color-scheme: light)",
        },
      ],
    },
  },
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
  modules: [
    "@cssninja/nuxt-toaster",
    "@sidebase/nuxt-auth",
    "@nuxt/eslint",
    "@vite-pwa/nuxt",
  ],
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
  pwa: {
    manifest: {
      name: "Removarr",
      short_name: "removarr",
      theme_color: "#dce0e8",
      icons: [
        {
          src: "pwa-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "pwa-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
        {
          src: "pwa-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any maskable",
        },
      ],
    },
    workbox: {
      globPatterns: ["**/*.{js,css,html,png,svg,ico}"],
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/image\.tmdb\.org\/.*/i,
          handler: "CacheFirst",
          options: {
            cacheName: "tmdb",
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
        {
          urlPattern: /^https:\/\/artworks\.thetvdb\.com\/.*/i,
          handler: "CacheFirst",
          options: {
            cacheName: "thetvdb",
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
      ],
    },
    injectManifest: {
      globPatterns: ["**/*.{js,css,html,png,svg,ico}"],
    },
    client: {
      installPrompt: true,
      // you don't need to include this: only for testing purposes
      // if enabling periodic sync for update use 1 hour or so (periodicSyncForUpdates: 3600)
      periodicSyncForUpdates: 20,
    },
    devOptions: {
      enabled: false,
      suppressWarnings: true,
      navigateFallback: "/",
      navigateFallbackAllowlist: [/^\/$/],
      type: "module",
    },
  },
  css: ["~/assets/app.css"],
});
