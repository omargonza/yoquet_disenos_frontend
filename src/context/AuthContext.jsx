import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../utils/api";

const AuthContext = createContext(null);

function isAccessValid(token) {
  try {
    if (!token) return false;
    const decoded = jwtDecode(token);
    if (!decoded?.exp) return false;
    return decoded.exp * 1000 > Date.now() + 5000; // margen 5s
  } catch {
    return false;
  }
}

export function AuthProvider({ children }) {
  const [access, setAccess] = useState(() => localStorage.getItem("access_token"));
  const [refreshing, setRefreshing] = useState(false);

  // Sin polling: solo sincroniza entre pestañas con Storage Event
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "access_token") setAccess(e.newValue);
      if (e.key === "refresh_token" && !e.newValue) setAccess(null);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const isAuthed = useMemo(() => isAccessValid(access), [access]);

  const login = (newAccess, newRefresh) => {
    localStorage.setItem("access_token", newAccess);
    localStorage.setItem("refresh_token", newRefresh);
    setAccess(newAccess);
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setAccess(null);
  };

  const refreshAccess = async () => {
    const refresh = localStorage.getItem("refresh_token");
    if (!refresh) return false;

    // Evitar múltiples refresh simultáneos
    if (refreshing) return isAccessValid(localStorage.getItem("access_token"));

    setRefreshing(true);
    try {
      const res = await api.post("/api/auth/refresh/", { refresh }, { timeout: 20000 });
      const newAccess = res.data?.access;
      if (!newAccess) return false;

      localStorage.setItem("access_token", newAccess);
      setAccess(newAccess);
      return true;
    } catch {
      // refresh inválido → limpiar
      logout();
      return false;
    } finally {
      setRefreshing(false);
    }
  };

  const value = {
    token: access,
    isAuthed,
    refreshing,
    login,
    logout,
    refreshAccess,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
