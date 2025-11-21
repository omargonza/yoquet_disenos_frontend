import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// Detecta modo actual
const mode = process.env.NODE_ENV || "development";
const isProd = mode === "production";

export default defineConfig({
  plugins: [
    react(),

    // ⭐ PWA súper liviana
    VitePWA({
      registerType: "autoUpdate",

      includeAssets: [
        "icon_192.png",
        "icon_512.png",
        "logo_Yoquet.png"
      ],

      manifest: {
        name: "Yoquet Diseños",
        short_name: "Yoquet",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#ffffff",
        icons: [
          {
            src: "icon_192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "icon_512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      }
    })
  ],

  // Render usa rutas relativas
  base: isProd ? "./" : "/",

  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
        secure: false,
      },
    },
  },

  build: {
    sourcemap: true,
  },
});
