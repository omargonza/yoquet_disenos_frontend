import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function AdminRoute() {
  const { user, loading } = useAuth();

  // Esperar mientras consulta /auth/me
  if (loading) return <div>Cargando...</div>;

  // Si no está logueado -> enviar a login y volver al admin
  if (!user)
    return <Navigate to="/login?next=/admin" replace />;

  // Si está logueado pero NO es staff -> lo echamos a la tienda
  if (!user.is_staff)
    return <Navigate to="/" replace />;

  // Autorizado: cargar panel admin
  return <Outlet />;
}
