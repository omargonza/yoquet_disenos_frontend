import axios from "axios";
import { API_BASE_URL } from "../config";

// Instancia global
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor único y correcto
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token"); // TOKEN ÚNICO
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
