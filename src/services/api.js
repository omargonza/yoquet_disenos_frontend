/*  
// ===== Interceptor de token (DESACTIVADO) =====

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access_token");  // <-- correcto
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);
*/
