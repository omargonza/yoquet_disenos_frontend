// src/config.js

// Detecta si estás en producción (deploy) o en desarrollo (localhost)
const isProd = import.meta.env.MODE === 'production';

// URL base del backend según entorno
export const API_BASE_URL = isProd
  ? "https://yoquet-disenos-backend.onrender.com"  // 🌐 Render
  : "http://127.0.0.1:8000";                        // 💻 Local
