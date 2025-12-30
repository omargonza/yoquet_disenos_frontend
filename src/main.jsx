import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import "./index.css";

import { ToastProvider } from "./context/ToastContext";
import { CarritoProvider } from "./context/CarritoContext";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import { AuthProvider } from "./context/AuthContext";

import { registerSW } from "virtual:pwa-register";


const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter basename="/">
    <AuthProvider>
      <AdminAuthProvider>
        <CarritoProvider>
          <ToastProvider>
            <Suspense fallback={<div className="p-10">Cargando…</div>}>
              <App />
            </Suspense>
          </ToastProvider>
        </CarritoProvider>
      </AdminAuthProvider>
    </AuthProvider>
  </BrowserRouter>
);

//registerSW({
  //immediate: true,
//});



