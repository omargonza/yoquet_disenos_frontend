import axios from "axios";
import { useToast } from "../context/ToastContext";

export function useApiWithToast() {
  const { showToast } = useToast();
  const backendURL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000";

  const request = async (method, endpoint, data = null, successMsg = "", errorMsg = "") => {
    try {
      const token = localStorage.getItem("access_token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios({
        method,
        url: `${backendURL}${endpoint}`,
        data,
        headers,
      });

      if (successMsg) showToast(successMsg, "success");
      return res.data;
    } catch (error) {
      console.error(error);
      showToast(errorMsg || "Ocurrió un error inesperado", "error");
      throw error;
    }
  };

  return { request };
}
