import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => {
  const isProd = mode === "production";
  const BACKEND_ORIGIN = "https://yoquet-disenos-backend.onrender.com";

  return {
    base: isProd ? "/online/" : "/",

    plugins: [
      react(),
      VitePWA({
        registerType: "autoUpdate",

        // Blindaje total
        injectRegister: null,
        devOptions: { enabled: false },

        includeAssets: ["favicon.ico", "robots.txt", "apple-touch-icon.png"],

        manifest: {
          id: "/online/",
          name: "Yoquet Diseños — Tienda & Gestión",
          short_name: "Yoquet",
          description: "Catálogo, tienda, carrito y gestión móvil.",
          start_url: "/online/",
          scope: "/online/",
          display: "standalone",
          orientation: "portrait",
          background_color: "#fffaf6",
          theme_color: "#ff66b3",
          lang: "es-AR",
          icons: [
            { src: "/online/icons/icon-72x72.png", sizes: "72x72", type: "image/png" },
            { src: "/online/icons/icon-96x96.png", sizes: "96x96", type: "image/png" },
            { src: "/online/icons/icon-128x128.png", sizes: "128x128", type: "image/png" },
            { src: "/online/icons/icon-144x144.png", sizes: "144x144", type: "image/png" },
            { src: "/online/icons/icon-152x152.png", sizes: "152x152", type: "image/png" },
            { src: "/online/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
            { src: "/online/icons/icon-384x384.png", sizes: "384x384", type: "image/png" },
            { src: "/online/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
          ],
        },

        workbox: {
          navigateFallback: "/online/index.html",

          runtimeCaching: [
            // API catálogo
            {
              urlPattern: ({ url, request }) =>
                request.method === "GET" &&
                url.origin === BACKEND_ORIGIN &&
                (url.pathname.startsWith("/api/productos/") ||
                  url.pathname.startsWith("/api/categorias/")),
              handler: "NetworkFirst",
              options: {
                cacheName: "yoquet-catalogo",
                cacheableResponse: { statuses: [0, 200] },
                expiration: { maxEntries: 80, maxAgeSeconds: 3600 },
              },
            },

            // Auth / pedidos → nunca cachear
            {
              urlPattern: ({ url }) =>
                url.origin === BACKEND_ORIGIN &&
                (url.pathname.startsWith("/api/auth/") ||
                  url.pathname.startsWith("/api/pedido/")),
              handler: "NetworkOnly",
            },

            // Imágenes
            {
              urlPattern: ({ request }) => request.destination === "image",
              handler: "CacheFirst",
              options: {
                cacheName: "yoquet-images",
                expiration: { maxEntries: 150, maxAgeSeconds: 2592000 },
              },
            },

            // JS / CSS
            {
              urlPattern: ({ request }) =>
                ["script", "style"].includes(request.destination),
              handler: "StaleWhileRevalidate",
              options: { cacheName: "yoquet-static" },
            },
          ],
        },
      }),
    ],

    server: { port: 5173 },
    build: { sourcemap: true },
  };
});
