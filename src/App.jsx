import { Routes, Route, useLocation } from "react-router-dom";
import React, { lazy, useEffect, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";

import ProtectedRoute from "./components/ProtectedRoute";
import PageTransition from "./components/PageTransition";
import SplashScreen from "./components/SplashScreen";
import CartButton from "./components/CartButton";
import Header from "./components/Header";

import api from "./utils/api";
import { useAuth } from "./context/AuthContext";

// CLIENTE
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Productos = lazy(() => import("./pages/Productos"));
const ProductoDetalle = lazy(() => import("./pages/ProductoDetalle"));
const Carrito = lazy(() => import("./pages/Carrito"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Confirmacion = lazy(() => import("./pages/Confirmacion"));
const Empaquetando = lazy(() => import("./pages/Empaquetando"));
const Despedida = lazy(() => import("./components/Despedida"));
const Register = lazy(() => import("./pages/Register"));
const Logout = lazy(() => import("./pages/Logout"));
const ResetPasswordConfirm = lazy(() => import("./pages/ResetPasswordConfirm"));
const ResetPasswordRequest = lazy(() => import("./pages/ResetPasswordRequest"));
const ResetSuccess = lazy(() => import("./pages/ResetSuccess"));
const GestionPanel = lazy(() => import("./pages/GestionPanel"));

// ADMIN
const AdminLayout = lazy(() => import("./admin/layout/AdminLayout"));
const AdminDashboard = lazy(() => import("./admin/pages/AdminDashboard"));
const ProductosAdmin = lazy(() => import("./admin/pages/ProductosAdmin"));
const CategoriasAdmin = lazy(() => import("./admin/pages/CategoriasAdmin"));
const PedidosAdmin = lazy(() => import("./admin/pages/PedidosAdmin"));
const ProductoEditarAdmin = lazy(() => import("./admin/pages/ProductoEditarAdmin"));
const RequireAdmin = lazy(() => import("./admin/components/RequireAdmin"));

export default function App() {
  const location = useLocation();
  const { loadingAuth } = useAuth();

  // Splash SOLO si tardó en montar (umbral), y máximo muy corto.
  const [showSplash, setShowSplash] = useState(false);
  const [ready, setReady] = useState(false);

  // Categorías para Header (chips). Cache simple.
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    const t = setTimeout(() => setShowSplash(true), 220);
    let done = false;

    const finish = () => {
      if (done) return;
      done = true;
      clearTimeout(t);
      setShowSplash(false);
      setReady(true);
    };

    if (!loadingAuth) {
      setTimeout(finish, 260);
    } else {
      const guard = setTimeout(finish, 1200);
      return () => clearTimeout(guard);
    }

    return () => clearTimeout(t);
  }, [loadingAuth]);

  useEffect(() => {
    let mounted = true;

    async function loadCats() {
      try {
        const cached = localStorage.getItem("cache_cat");
        if (cached) {
          const c = JSON.parse(cached);
          if (Array.isArray(c) && mounted) setCategorias(c);
        }

        const res = await api.get("/api/categorias/", { timeout: 20000 });
        const cat = res.data.results || res.data;

        if (mounted && Array.isArray(cat)) {
          setCategorias(cat);
          localStorage.setItem("cache_cat", JSON.stringify(cat));
        }
      } catch {
        // silencioso
      }
    }

    loadCats();
    return () => {
      mounted = false;
    };
  }, []);

  const isAdminRoute = useMemo(
    () => location.pathname.startsWith("/admin"),
    [location.pathname]
  );
  const hideHeaderRoutes = [
    "/login",
    "/register",
    "/reset",
    
  ];

  const hideHeader = hideHeaderRoutes.some((p) =>
    location.pathname.startsWith(p)
  );


  return (
    <>
      {/* Splash solo al inicio */}
      {showSplash && !ready && <SplashScreen />}

      {!isAdminRoute && ready && !hideHeader && (
        <Header categorias={categorias} />
      )}


      <React.Suspense
        fallback={
          <div className="container-yoquet py-10">
            <div className="card-yoquet p-5">
              <div className="skeleton h-6 w-44" />
              <div className="skeleton h-4 w-64 mt-3" />
              <div className="skeleton h-10 w-40 mt-6 rounded-full" />
            </div>
          </div>
        }
      >
        <AnimatePresence mode="wait">
          <PageTransition>
            <Routes>
              {/* HOME */}
              <Route path="/" element={<Home />} />

              {/* AUTH */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/logout" element={<Logout />} />

              {/* RESET */}
              <Route path="/reset" element={<ResetPasswordRequest />} />
              <Route path="/reset/success" element={<ResetSuccess />} />
              <Route
                path="/reset/confirm/:uid/:token"
                element={<ResetPasswordConfirm />}
              />

              {/* CATÁLOGO */}
              <Route path="/productos" element={<Productos />} />
              <Route path="/productos/:id" element={<ProductoDetalle />} />
              <Route path="/carrito" element={<Carrito />} />

              {/* CHECKOUT */}
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

              {/* GESTIÓN */}
              <Route
                path="/gestion"
                element={
                  <ProtectedRoute>
                    <GestionPanel />
                  </ProtectedRoute>
                }
              />

              {/* ADMIN */}
              <Route
                path="/admin"
                element={
                  <RequireAdmin>
                    <AdminLayout />
                  </RequireAdmin>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="productos" element={<ProductosAdmin />} />
                <Route path="categorias" element={<CategoriasAdmin />} />
                <Route path="pedidos" element={<PedidosAdmin />} />
                <Route path="producto/:id" element={<ProductoEditarAdmin />} />
              </Route>
            </Routes>
          </PageTransition>
        </AnimatePresence>
      </React.Suspense>

      {/* BOTÓN CARRITO — solo cliente */}
      {!isAdminRoute && ready && <CartButton />}
    </>
  );
}
