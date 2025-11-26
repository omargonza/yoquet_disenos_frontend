import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

import { ToastProvider } from "./context/ToastContext";
import { CarritoProvider } from "./context/CarritoContext";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import { AuthProvider } from "./context/AuthContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter basename="/">
    <AuthProvider>
      <AdminAuthProvider>
        <CarritoProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </CarritoProvider>
      </AdminAuthProvider>
    </AuthProvider>
  </BrowserRouter>
);
