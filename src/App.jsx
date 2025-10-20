import { Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Despedida from "./components/Despedida";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Productos from "./pages/Productos";
import ProductoDetalle from "./pages/ProductoDetalle";
import Carrito from "./pages/Carrito";
import CartButton from "./components/CartButton"; // 
import Checkout from "./pages/Checkout";
import Confirmacion from "./pages/Confirmacion";


import SplashScreen from "./components/SplashScreen";
import PageTransition from "./components/PageTransition";
import { useAmbient } from "./context/AmbientContext";
import { useState, useEffect } from "react";

export default function App() {
  const { theme, switchTheme, autoMode, setAutoMode } = useAmbient();
  const [showSplash, setShowSplash] = useState(true);

  const icon = {
    morning: "☀️",
    afternoon: "🌇",
    night: "🌙",
  };

  // ⏳ Oculta el splash automáticamente después de 3 segundos
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {showSplash ? (
        <SplashScreen onFinish={() => setShowSplash(false)} />
      ) : (
        <>
          {/* 🔮 Transición envolviendo las rutas */}
          <PageTransition>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/productos" element={<Productos />} />
              <Route path="/productos/:id" element={<ProductoDetalle />} />
              <Route path="/carrito" element={<Carrito />} />
              <Route path="/despedida" element={<Despedida />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/confirmacion" element={<Confirmacion />} />
            </Routes>
          </PageTransition>

          <CartButton /> {/* 🛍️ Carrito flotante dorado */}

          {/* 🌈 Switch flotante de ambiente */}
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-white/60 backdrop-blur-md border border-[#e7dcc5] shadow-lg rounded-full px-3 py-2">
            <button
              onClick={() => setAutoMode(!autoMode)}
              className="text-xs font-semibold text-[#6a5a3d] hover:text-[#b08c4e]"
            >
              {autoMode ? "Auto" : "Manual"}
            </button>
            <div className="flex gap-2">
              {Object.keys(icon).map((t) => (
                <button
                  key={t}
                  onClick={() => switchTheme(t)}
                  className={`text-xl transition-transform ${
                    theme === t
                      ? "scale-125 text-[#b08c4e]"
                      : "opacity-70 hover:opacity-100"
                  }`}
                >
                  {icon[t]}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
