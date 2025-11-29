import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),

    VitePWA({
      registerType: "autoUpdate",
      devOptions: { enabled: true },

      includeAssets: [
        "favicon.ico",
        "robots.txt",
        "apple-touch-icon.png",
      ],

      manifest: {
        id: "/",
        name: "Yoquet Diseños — Tienda & Gestión",
        short_name: "Yoquet",
        description: "Catálogo, tienda, carrito y gestión móvil.",
        start_url: "/",
        scope: "/",
        display: "standalone",
        orientation: "portrait",
        background_color: "#fffaf6",
        theme_color: "#ff66b3",
        lang: "es-AR",

        icons: [
          { src: "/icons/icon-72x72.png", sizes: "72x72", type: "image/png" },
          { src: "/icons/icon-96x96.png", sizes: "96x96", type: "image/png" },
          { src: "/icons/icon-128x128.png", sizes: "128x128", type: "image/png" },
          { src: "/icons/icon-144x144.png", sizes: "144x144", type: "image/png" },
          { src: "/icons/icon-152x152.png", sizes: "152x152", type: "image/png" },
          { src: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "/icons/icon-384x384.png", sizes: "384x384", type: "image/png" },
          { src: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" }
        ],
      },

      workbox: {
        navigateFallback: "/index.html",

        runtimeCaching: [
          // API – NetworkFirst
          {
            urlPattern: ({ url }) => url.pathname.startsWith("/api/"),
            handler: "NetworkFirst",
            options: {
              cacheName: "yoquet-api",
              cacheableResponse: { statuses: [0, 200] },
              expiration: { maxEntries: 50, maxAgeSeconds: 3600 },
            },
          },

          // Images – CacheFirst
          {
            urlPattern: ({ request }) => request.destination === "image",
            handler: "CacheFirst",
            options: {
              cacheName: "yoquet-images",
              expiration: {
                maxEntries: 150,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
            },
          },

          // Static assets – StaleWhileRevalidate
          {
            urlPattern: ({ request }) =>
              ["script", "style"].includes(request.destination),
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "yoquet-static",
            },
          },
        ],
      },
    }),
  ],

  base: "./",

  server: {
    port: 5173,
  },

  build: {
    sourcemap: true,
  },
});
