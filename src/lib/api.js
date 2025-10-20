import axios from 'axios'
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/', timeout: 10000 })
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('access'); if(token){ cfg.headers.Authorization = `Bearer ${token}` }
  return cfg
})
export default api
