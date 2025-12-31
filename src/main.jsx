import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import "./index.css";

import { ToastProvider } from "./context/ToastContext";
import { CarritoProvider } from "./context/CarritoContext";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import { AuthProvider } from "./context/AuthContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

// 🔒 Render SIEMPRE usa raíz
const BASENAME = "/";

root.render(
  <BrowserRouter basename={BASENAME}>
    <AuthProvider>
      <AdminAuthProvider>
        <CarritoProvider>
          <ToastProvider>
            <Suspense fallback={<div className="p-10">Cargando…</div>}>
              <App />
            </Suspense>
          </ToastProvider>
        </CarritoProvider>
      </AdminAuthProvider>
    </AuthProvider>
  </BrowserRouter>
);

/**
 * PWA / Service Worker
 * DEV: sin SW, limpia restos
 * PROD (Render): registra SW
 */
async function setupSW() {
  // DEV → NO SW
  if (import.meta.env.DEV) {
    if ("serviceWorker" in navigator) {
      try {
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map((r) => r.unregister()));
      } catch {}
    }

    if ("caches" in window) {
      try {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      } catch {}
    }
    return;
  }

  // PROD → registrar SW
  window.addEventListener("load", async () => {
    try {
      const { registerSW } = await import("virtual:pwa-register");
      registerSW({ immediate: true });
    } catch {}
  });
}

setupSW();
