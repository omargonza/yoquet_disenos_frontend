import axios from "axios";
import { useToast } from "../context/ToastContext";

/**
 * 🎨 Hook universal para peticiones con feedback visual (toasts)
 * Incluye manejo automático de tokens JWT y mensajes animados.
 *
 * Ejemplo:
 *   const { request } = useApiWithToast();
 *   await request("post", "/api/productos/", data, "Producto creado 🎉", "Error al crear");
 */
export function useApiWithToast() {
  const { showToast } = useToast();

  // 🌐 URL base configurable desde entorno o fallback local
  const backendURL =
    import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000";

  /**
   * 🧩 Función principal de request
   * @param {string} method - HTTP method: get, post, put, delete, etc.
   * @param {string} endpoint - Ruta relativa, ej: "/api/productos/"
   * @param {object|null} data - Cuerpo de la petición
   * @param {string} successMsg - Mensaje de éxito para mostrar en Toast
   * @param {string} errorMsg - Mensaje de error opcional
   */
  const request = async (
    method,
    endpoint,
    data = null,
    successMsg = "",
    errorMsg = ""
  ) => {
    try {
      // 🔐 Incluye token JWT si existe
      const token = localStorage.getItem("access_token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      // 🚀 Petición con Axios
      const res = await axios({
        method,
        url: `${backendURL}${endpoint}`,
        data,
        headers,
      });

      // ✅ Éxito visual con mensaje festivo
      if (successMsg)
        showToast(successMsg, "celebration"); // estilo más alegre del ToastContext

      return res.data;
    } catch (error) {
      console.error("❌ Error en request:", error);

      // ⚠️ Mensaje visual coherente con estilo global
      const msg =
        error.response?.data?.detail ||
        errorMsg ||
        "Ocurrió un error inesperado 💥";

      showToast(msg, "error");

      throw error;
    }
  };

  return { request };
}
