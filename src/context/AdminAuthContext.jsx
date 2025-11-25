import { createContext, useContext, useEffect, useState } from "react";
import api from "../../src/utils/api";

const AdminAuthContext = createContext();

export function AdminAuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const loadUser = async () => {
  const token = localStorage.getItem("admin_token");
  if (!token) {
    setUser(null);
    setLoading(false);
    return; // ← evita el 401 si no hay token
  }

  try {
    const res = await api.get("/api/auth/me/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUser(res.data);
  } catch (err) {
    // si falla, simplemente desloguea silenciosamente
    setUser(null);
  }

  setLoading(false);
};


  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AdminAuthContext.Provider value={{ user, loading }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}
