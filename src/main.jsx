import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

import { ToastProvider } from "./context/ToastContext";
import { CarritoProvider } from "./context/CarritoContext";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import { AuthProvider } from "./context/AuthContext";

import { registerServiceWorker } from "./registerSW";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter basename="/">
    <AuthProvider>               {/* PRIMERO: estado global de login */}
      <AdminAuthProvider>        {/* administración */}
        <CarritoProvider>        {/* carrito */}
          <ToastProvider>        {/* avisos */}
            <App />              {/* app final */}
          </ToastProvider>
        </CarritoProvider>
      </AdminAuthProvider>
    </AuthProvider>
  </BrowserRouter>
);

// 💡 Registramos el SW al final
registerServiceWorker();
