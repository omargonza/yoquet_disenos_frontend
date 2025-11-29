import { Routes, Route } from "react-router-dom";
import React, { lazy } from "react";

// Animaciones (si querés las podés sacar después)
import { AnimatePresence } from "framer-motion";

// Componentes globales
import CartButton from "./components/CartButton";
import ProtectedRoute from "./components/ProtectedRoute";
import PageTransition from "./components/PageTransition";
import SplashScreen from "./components/SplashScreen";
import LogoutButton from "./components/LogoutButton";

// Contexto
import { useAuth } from "./context/AuthContext";

// ------------------------
// LAZY LOADING (CLIENTE)
// ------------------------
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
const ResetPasswordConfirm = lazy(() =>
  import("./pages/ResetPasswordConfirm")
);
const ResetPasswordRequest = lazy(() =>
  import("./pages/ResetPasswordRequest")
);
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetSuccess = lazy(() => import("./pages/ResetSuccess"));
const GestionPanel = lazy(() => import("./pages/GestionPanel"));

// ------------------------
// LAZY LOADING (ADMIN)
// ------------------------
const AdminLayout = lazy(() => import("./admin/layout/AdminLayout"));
const AdminDashboard = lazy(() =>
  import("./admin/pages/AdminDashboard")
);
const ProductosAdmin = lazy(() =>
  import("./admin/pages/ProductosAdmin")
);
const CategoriasAdmin = lazy(() =>
  import("./admin/pages/CategoriasAdmin")
);
const PedidosAdmin = lazy(() =>
  import("./admin/pages/PedidosAdmin")
);
const ProductoEditarAdmin = lazy(() =>
  import("./admin/pages/ProductoEditarAdmin")
);
const RequireAdmin = lazy(() =>
  import("./admin/components/RequireAdmin")
);

export default function App() {
  const { loadingAuth } = useAuth();

  // SPLASH SCREEN
  const [showSplash, setShowSplash] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 900);
    return () => clearTimeout(timer);
  }, []);

  if (loadingAuth) return null;

  return (
    <>
      <AnimatePresence mode="wait">
        {showSplash ? (
          <SplashScreen onFinish={() => setShowSplash(false)} />
        ) : (
          <>
            <PageTransition>
              <Routes>
                {/* Home */}
                <Route path="/" element={<Home />} />

                {/* Auth */}
                <Route path="/login" element={<Login />} />
                <Route path="/logout" element={<LogoutButton />} />
                <Route path="/register" element={<Register />} />

                {/* Reset password */}
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset" element={<ResetPasswordRequest />} />
                <Route path="/reset/success" element={<ResetSuccess />} />
                <Route
                  path="/reset/confirm/:uid/:token"
                  element={<ResetPasswordConfirm />}
                />

                {/* Catálogo */}
                <Route path="/productos" element={<Productos />} />
                <Route
                  path="/productos/:id"
                  element={<ProductoDetalle />}
                />
                <Route path="/carrito" element={<Carrito />} />

                {/* Checkout */}
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

                {/* Gestión */}
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
                  <Route
                    path="producto/:id"
                    element={<ProductoEditarAdmin />}
                  />
                </Route>

              </Routes>
            </PageTransition>

            {/* Carrito flotante */}
            <CartButton />
          </>
        )}
      </AnimatePresence>
    </>
  );
}
