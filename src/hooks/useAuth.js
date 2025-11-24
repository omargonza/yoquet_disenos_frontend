import { useEffect, useState } from "react";
import api from "../utils/api";   // IMPORT CORRECTO

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function check() {
      try {
        // ENDPOINT REAL DEL BACKEND (CORRECTO)
        const res = await api.get("/api/auth/me/");
        setUser(res.data);

      } catch (e) {
        setUser(null);
      }

      setLoading(false);
    }

    check();
  }, []);

  return { user, loading };
}
