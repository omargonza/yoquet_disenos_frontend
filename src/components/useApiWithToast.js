import axios from "axios";
import { useToast } from "../context/ToastContext";

// ⏳ Timeout global para evitar "requests colgados"
const TIMEOUT = 12000; // 12s

// 🛡 Anti-spam (rate-limit por hook)
let lastCall = 0;

export function useApiWithToast() {
  const { showToast } = useToast();

  const backendURL =
    import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000";

  // 🧽 Sanitiza strings (evita XSS en parámetros)
  const sanitize = (value) => {
    if (typeof value !== "string") return value;
    return value
      .replace(/<script.*?>.*?<\/script>/gi, "")
      .replace(/javascript:/gi, "")
      .trim();
  };

  const sanitizeData = (data) => {
    if (!data || typeof data !== "object") return data;
    const clean = {};
    for (const k in data) clean[k] = sanitize(data[k]);
    return clean;
  };

  // 🔁 Refresh Token seguro
  const refreshToken = async () => {
    try {
      const refresh = localStorage.getItem("refresh_token");
      if (!refresh) return null;

      const res = await axios.post(`${backendURL}/api/token/refresh/`, {
        refresh,
      });

      localStorage.setItem("access_token", res.data.access);
      return res.data.access;
    } catch {
      return null;
    }
  };

  // 🚀 Request principal + capa de seguridad
  const request = async (
    method,
    endpoint,
    data = null,
    successMsg = "",
    errorMsg = ""
  ) => {
    // 🛡 Anti-rate-limit: evita spam de requests en mobile
    const now = Date.now();
    if (now - lastCall < 450) {
      showToast("Espera un momento… ⚠️", "error");
      throw new Error("Rate-limited");
    }
    lastCall = now;

    // 🔐 Token seguro
    let token = localStorage.getItem("access_token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    // 🧽 Sanitizo el body para evitar XSS
    const cleanData = sanitizeData(data);

    // 🎯 Validación fuerte de inputs del hook
    if (typeof method !== "string")
      throw new Error("El método HTTP debe ser string");
    if (!endpoint.startsWith("/"))
      throw new Error("El endpoint debe comenzar con /");

    try {
      const res = await axios({
        method,
        url: `${backendURL}${endpoint}`,
        data: cleanData,
        headers,
        timeout: TIMEOUT,
      });

      if (successMsg) showToast(successMsg, "success");
      return res.data;
    } catch (error) {
      // 🔄 401 = token expiró → intento refresh AUTOMÁTICO
      if (error?.response?.status === 401) {
        const newToken = await refreshToken();
        if (newToken) {
          // Reintenta request UNA vez
          try {
            const retryRes = await axios({
              method,
              url: `${backendURL}${endpoint}`,
              data: cleanData,
              headers: { Authorization: `Bearer ${newToken}` },
              timeout: TIMEOUT,
            });

            if (successMsg) showToast(successMsg, "success");
            return retryRes.data;
          } catch {
            /* cae al manejo normal */
          }
        }

        // 🔐 Si refresh falla → logout seguro
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        showToast("Sesión expirada 🔒. Iniciá sesión nuevamente.", "error");
      }

      // ⚠️ Mensaje de error amigable y no revelador
      const msg =
        error.response?.data?.detail ||
        errorMsg ||
        "Algo salió mal. Intentá nuevamente ⚠️";

      showToast(msg, "error");

      throw error;
    }
  };

  return { request };
}
