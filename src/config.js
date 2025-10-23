const isProd = import.meta.env.MODE === 'production';
export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (isProd
    ? 'https://yoquet-disenos-backend.onrender.com'
    : 'http://127.0.0.1:8000');
