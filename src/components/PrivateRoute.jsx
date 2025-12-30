import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function isTokenValid(token) {
  try {
    if (!token) return false;
    const decoded = jwtDecode(token);
    // exp en segundos
    if (!decoded?.exp) return false;
    return decoded.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export default function PrivateRoute({ children }) {
  const location = useLocation();

  const token = localStorage.getItem("access_token");
  const valid = isTokenValid(token);

  if (valid) return children;

  // Limpieza defensiva: evita estados raros
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");

  return <Navigate to="/login" replace state={{ from: location.pathname }} />;
}
