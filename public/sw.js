const CACHE_NAME = "yoquet-cache-v3";

const CORE_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json"
];

// Instalación
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll(CORE_ASSETS).catch(() => {})
    )
  );
  self.skipWaiting();
});

// Activación
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch PRO
self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = req.url;

  // No interceptar API del backend
  if (url.includes("/api/")) return;

  // No interceptar JS/CSS del build de Vite
  if (req.destination === "script" || req.destination === "style") {
    return fetch(req);
  }

  // Cache first + fallback para la SPA
  event.respondWith(
    caches.match(req).then((cached) => {
      return (
        cached ||
        fetch(req).catch(() => {
          // Safari iOS no usa mode:"navigate", mejor usar destination: "document"
          if (req.destination === "document") {
            return caches.match("/index.html");
          }
        })
      );
    })
  );
});
