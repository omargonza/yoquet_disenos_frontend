import { Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Productos from "./pages/Productos";
import ProductoDetalle from "./pages/ProductoDetalle";
import Carrito from "./pages/Carrito";
import CartButton from "./components/CartButton";
import ProtectedRoute from "./components/ProtectedRoute";
import Checkout from "./pages/Checkout";
import Confirmacion from "./pages/Confirmacion";
import Empaquetando from "./pages/Empaquetando";
import Despedida from "./components/Despedida";
import SplashScreen from "./components/SplashScreen";
import PageTransition from "./components/PageTransition";

import Register from "./pages/Register";
import ResetPasswordConfirm from "./pages/ResetPasswordConfirm";
import ResetPasswordRequest from "./pages/ResetPasswordRequest";
import ForgotPassword from "./pages/ForgotPassword";
import ResetSuccess from "./pages/ResetSuccess";
import GestionPanel from "./pages/GestionPanel";

// ADMIN
import AdminDashboard from "./admin/pages/AdminDashboard";
import ProductosAdmin from "./admin/pages/ProductosAdmin";
import CategoriasAdmin from "./admin/pages/CategoriasAdmin";
import PedidosAdmin from "./admin/pages/PedidosAdmin";
import AdminLayout from "./admin/layout/AdminLayout";
import ProductoEditarAdmin from "./admin/pages/ProductoEditarAdmin";
import RequireAdmin from "./admin/components/RequireAdmin";

import { useAuth } from "./context/AuthContext";
import LogoutButton from "./components/LogoutButton";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {showSplash ? (
        <SplashScreen />
      ) : (
        <>
          <PageTransition>
            <Routes>

              {/* =============================== */}
              {/*             PUBLICO             */}
              {/* =============================== */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/productos" element={<Productos />} />
              <Route path="/productos/:id" element={<ProductoDetalle />} />
              <Route path="/carrito" element={<Carrito />} />

              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                }
              />

              <Route path="/confirmacion" element={<Confirmacion />} />
              <Route path="/empaquetando" element={<Empaquetando />} />
              <Route path="/despedida" element={<Despedida />} />

              {/* AUTH */}
              <Route path="/register" element={<Register />} />
              <Route path="/reset" element={<ResetPasswordRequest />} />
              <Route
                path="/reset-password/:uid/:token"
                element={<ResetPasswordConfirm />}
              />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-success" element={<ResetSuccess />} />

              {/* PANEL TÉCNICO */}
              <Route path="/gestion" element={<GestionPanel />} />

              {/* =============================== */}
              {/*           PANEL ADMIN           */}
              {/* =============================== */}
              <Route path="/admin" element={<RequireAdmin />}>
                <Route element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="productos" element={<ProductosAdmin />} />
                  <Route path="productos/:id" element={<ProductoEditarAdmin />} />
                  <Route path="categorias" element={<CategoriasAdmin />} />
                  <Route path="pedidos" element={<PedidosAdmin />} />
                </Route>
              </Route>

            </Routes>
          </PageTransition>

          {/* =============================== */}
          {/*     BOTÓN LOGOUT + CARRITO      */}
          {/* =============================== */}

          {!window.location.pathname.startsWith("/admin") && (
            <>
              {/* LOGOUT IZQUIERDA */}
              {token && (
                <div className="fixed top-6 left-6 z-[999]">
                  <LogoutButton />
                </div>
              )}

              {/* CARRITO DERECHA */}
              <CartButton />
            </>
          )}

        </>
      )}
    </AnimatePresence>
  );
}
