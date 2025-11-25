import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("access_token");
  const location = useLocation();

  // Si NO hay token → mandar al login y guardar a dónde quería ir
  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  // Si hay token → permitir acceso
  return children;
}
