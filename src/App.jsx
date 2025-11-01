// ...existing imports...
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Productos from "./pages/Productos";
import ProductoDetalle from "./pages/ProductoDetalle";
import Carrito from "./pages/Carrito";
import CartButton from "./components/CartButton";
import Checkout from "./pages/Checkout";
import Confirmacion from "./pages/Confirmacion";
import Empaquetando from "./pages/Empaquetando";
import Despedida from "./components/Despedida";
import SplashScreen from "./components/SplashScreen";
import PageTransition from "./components/PageTransition";
import { useAmbient } from "./context/AmbientContext";
import { useState, useEffect } from "react";

const isProd = import.meta.env.MODE === "production";
const basename = isProd ? "/yoquet_disenos_frontend" : "/";

export default function App() {
  const { theme, switchTheme, autoMode, setAutoMode } = useAmbient();

  const [showSplash, setShowSplash] = useState(true);

  const icons = {
    morning: "☀️",
    afternoon: "🌇",
    night: "🌙",
    festival: "🎉",
  };

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
            <PageTransition>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/productos" element={<Productos />} />
                <Route path="/productos/:id" element={<ProductoDetalle />} />
                <Route path="/carrito" element={<Carrito />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/confirmacion" element={<Confirmacion />} />
                <Route path="/empaquetando" element={<Empaquetando />} />
                <Route path="/despedida" element={<Despedida />} />
              </Routes>
            </PageTransition>

            {/* 🛍️ Carrito flotante */}
            <CartButton />

            {/* 🌈 Selector flotante de ambiente premium */}
            <div
              className="fixed bottom-6 right-6 z-[999] flex items-center gap-3
                bg-white/20 backdrop-blur-md border border-white/30
                shadow-[0_4px_25px_rgba(255,216,90,0.3)]
                rounded-full px-3 py-2 transition-all duration-500"
            >
              {/* 🔘 Botón Auto/Manual */}
              <button
                onClick={() => setAutoMode(!autoMode)}
                className={`text-xs font-semibold px-2 py-1 rounded-full transition-all 
                  ${
                    autoMode
                      ? "bg-gradient-to-r from-[#ffd85a] to-[#42e2b8] text-[#1b1b1d] shadow-md"
                      : "bg-transparent text-[#fffaf2] border border-[#ffd85a]/40 hover:bg-[#ffd85a]/20"
                  }`}
              >
                {autoMode ? "Auto" : "Manual"}
              </button>

              {/* 🌤️ Íconos de ambiente */}
              <div className="flex gap-2">
                {Object.entries(icons).map(([key, icon]) => (
                  <button
                    key={key}
                    onClick={() => switchTheme(key)}
                    className={`text-xl transition-all transform 
                      ${
                        theme === key
                          ? "scale-125 text-[#ffd85a] drop-shadow-[0_0_8px_rgba(255,216,90,0.6)]"
                          : "opacity-70 hover:opacity-100 text-white"
                      }`}
                    title={key}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </AnimatePresence>
   
  );
}
