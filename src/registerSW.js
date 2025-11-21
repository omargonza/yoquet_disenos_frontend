export function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then(() => console.log("SW instalado ✔"))
        .catch((err) => console.error("SW error:", err));
    });
  }
}
