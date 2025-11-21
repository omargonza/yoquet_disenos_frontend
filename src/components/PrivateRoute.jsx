import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function PrivateRoute({ children }) {
  const [isValid, setIsValid] = useState(null);

  useEffect(() => {
    const validateToken = () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) return setIsValid(false);

        // Decodifica sin riesgo
        const decoded = jwtDecode(token);

        // Verifica expiración
        if (decoded.exp * 1000 < Date.now()) {
          return setIsValid(false);
        }

        return setIsValid(true);
      } catch {
        return setIsValid(false);
      }
    };

    validateToken();
  }, []);

  if (isValid === null) return null; // evita parpadeo

  return isValid ? children : <Navigate to="/login" replace />;
}
