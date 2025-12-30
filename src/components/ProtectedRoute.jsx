import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const { isAuthed, refreshAccess } = useAuth();
  const [checked, setChecked] = useState(false);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function guard() {
      // 1) si ya está validado → ok
      if (isAuthed) {
        if (!mounted) return;
        setOk(true);
        setChecked(true);
        return;
      }

      // 2) si no, intenta refresh
      const refreshed = await refreshAccess();
      if (!mounted) return;
      setOk(Boolean(refreshed));
      setChecked(true);
    }

    guard();
    return () => {
      mounted = false;
    };
  }, [isAuthed, refreshAccess]);

  if (!checked) {
    // loader mínimo para evitar parpadeo
    return (
      <div className="min-h-[calc(100vh-72px)] flex items-center justify-center">
        <div className="card-yoquet p-4 text-sm font-extrabold" style={{ color: "var(--muted)" }}>
          Verificando sesión…
        </div>
      </div>
    );
  }

  if (!ok) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
