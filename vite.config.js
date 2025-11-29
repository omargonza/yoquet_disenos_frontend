import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

const mode = process.env.NODE_ENV || "development";
const isProd = mode === "production";

export default defineConfig({
  plugins: [
    react(),

    VitePWA({
      registerType: "autoUpdate",
      devOptions: { enabled: true },

      includeAssets: ["logo_Yoquet.png"],

      manifest: {
        id: "/",
        name: "Yoquet Diseños — Tienda & Gestión",
        short_name: "Yoquet",
        description: "Catálogo, tienda, carrito y gestión completa — versión optimizada para móviles.",
        start_url: "/",
        scope: "/",
        display: "standalone",
        display_override: ["standalone", "browser"],
        orientation: "portrait",
        background_color: "#fffaf6",
        theme_color: "#ff66b3",
        dir: "ltr",
        lang: "es-AR",
        prefer_related_applications: false,

        icons: [
          { src: "/icons/icon-72x72.png", sizes: "72x72", type: "image/png" },
          { src: "/icons/icon-96x96.png", sizes: "96x96", type: "image/png" },
          { src: "/icons/icon-128x128.png", sizes: "128x128", type: "image/png" },
          { src: "/icons/icon-144x144.png", sizes: "144x144", type: "image/png" },
          { src: "/icons/icon-152x152.png", sizes: "152x152", type: "image/png" },
          { src: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "/icons/icon-384x384.png", sizes: "384x384", type: "image/png" },
          { src: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" }
        ]
      },

      workbox: {
        navigateFallback: "/index.html",

        runtimeCaching: [
          // 📌 API — NetworkFirst
          {
            urlPattern: ({ url }) => url.pathname.startsWith("/api/"),
            handler: "NetworkFirst",
            options: {
              cacheName: "yoquet-api",
              networkTimeoutSeconds: 4,
              cacheableResponse: { statuses: [0, 200] },
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 }
            }
          },

          // 📌 Imágenes — CacheFirst
          {
            urlPattern: ({ request }) => request.destination === "image",
            handler: "CacheFirst",
            options: {
              cacheName: "yoquet-images",
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24 * 30
              }
            }
          },

          // 📌 Páginas — NetworkFirst
          {
            urlPattern: ({ request }) => request.mode === "navigate",
            handler: "NetworkFirst",
            options: {
              cacheName: "yoquet-pages",
              networkTimeoutSeconds: 3,
              cacheableResponse: { statuses: [0, 200] }
            }
          },

          // 📌 JS/CSS — StaleWhileRevalidate
          {
            urlPattern: ({ request }) =>
              ["script", "style"].includes(request.destination),
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "yoquet-static-assets"
            }
          }
        ]
      }
    })
  ],

  base: isProd ? "./" : "/",

  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
        secure: false
      }
    }
  },

  build: {
    sourcemap: true
  }
});
