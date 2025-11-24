import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";


export default function RequireAdmin() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div>Cargando...</div>;

  // Si no está logueado → mandar a login
  if (!user)
    return <Navigate to={`/login?next=${location.pathname}`} replace />;

  // Si está logueado pero NO es admin → lo echamos a la tienda
  if (!user.is_staff)
    return <Navigate to="/" replace />;

  return <Outlet />;
}
