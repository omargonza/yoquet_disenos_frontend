self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("v1").then((cache) =>
      cache.addAll([
        "/",
        "/index.html",
        "/manifest.json",
        "/icon_192.png",
        "/icon_512.png",
        "/splash.png",
      ])
    )
  );
  console.log("SW instalado ✔");
});

self.addEventListener("fetch", (event) => {
  const url = event.request.url;

  // ❌ Nunca interceptar API del backend
  if (url.includes("/api/")) {
    return; // dejar pasar normal
  }

  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
