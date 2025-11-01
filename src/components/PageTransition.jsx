import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAmbient } from "../context/AmbientContext";

export default function PageTransition({ children }) {
  const location = useLocation();
  const { theme } = useAmbient();
  const [showOverlay, setShowOverlay] = useState(false);

  // 🌀 Activar cortina al cambiar de ruta
  useEffect(() => {
    setShowOverlay(true);
    const timer = setTimeout(() => setShowOverlay(false), 1100);
    return () => clearTimeout(timer);
  }, [location.pathname, theme]);

  // 🎨 Fondo metálico con reflejos topo + colores Yoquet
  const metallicGradient = `
    linear-gradient(135deg, #2b2d33 0%, #4a4c55 35%, #7d808c 70%, #b1b3be 100%)
  `;
  const accentOverlays = `
    radial-gradient(circle at 30% 30%, rgba(255,102,179,0.25), transparent 70%),
    radial-gradient(circle at 70% 70%, rgba(255,216,90,0.25), transparent 70%),
    radial-gradient(circle at 50% 90%, rgba(66,226,184,0.2), transparent 70%)
  `;

  const background = `${accentOverlays}, ${metallicGradient}`;

  return (
    <>
      <style>{`
        @keyframes shineSweep {
          0% { transform: translateX(-120%) skewX(-20deg); opacity: 0; }
          30% { opacity: 0.7; }
          100% { transform: translateX(120%) skewX(-20deg); opacity: 0; }
        }
        @keyframes floatingStars {
          0% { opacity: 0.4; transform: translateY(0px) scale(1); }
          50% { opacity: 0.9; transform: translateY(-15px) scale(1.05); }
          100% { opacity: 0.4; transform: translateY(0px) scale(1); }
        }
      `}</style>

      {/* ✨ CORTINA CINEMÁTICA */}
      <AnimatePresence>
        {showOverlay && (
          <motion.div
            key={`overlay-${location.pathname}`}
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 1, ease: [0.77, 0, 0.175, 1] }}
            className="fixed inset-0 z-[9999] overflow-hidden"
            style={{
              backgroundImage: background,
              backgroundBlendMode: "overlay, soft-light, normal",
              backgroundSize: "cover",
              filter: "brightness(1.05) contrast(1.2)",
              boxShadow: "inset 0 0 120px rgba(0,0,0,0.45)",
            }}
          >
            {/* 💫 Reflejo brillante desplazante */}
            <motion.div
              initial={{ x: "-60%", opacity: 0 }}
              animate={{ x: "160%", opacity: [0.05, 0.8, 0] }}
              transition={{ duration: 1.4, ease: "easeInOut", delay: 0.15 }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/35 to-transparent"
              style={{
                mixBlendMode: "soft-light",
                transform: "skewX(-25deg)",
              }}
            />

            {/* 🌌 Brillos flotantes metálicos */}
            {[...Array(14)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-white/70 shadow-[0_0_8px_rgba(255,255,255,0.7)]"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animation: `floatingStars ${4 + Math.random() * 3}s ease-in-out infinite ${
                    i * 0.4
                  }s`,
                }}
              />
            ))}

            {/* 🎭 Logo sutil flotante */}
            <motion.img
              src="https://res.cloudinary.com/dfkyxmjnx/image/upload/v1730060034/yoquet/logo-yoquet-metalico.svg"
              alt="Yoquet Diseños"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.8, scale: [1, 1.05, 1] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
              className="absolute top-1/2 left-1/2 w-40 h-auto -translate-x-1/2 -translate-y-1/2 opacity-80"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ⚡ Suavizado de entrada/salida de páginas */}
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 40, scale: 0.98, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -20, scale: 0.98, filter: "blur(6px)" }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="relative z-0"
      >
        {children}
      </motion.div>
    </>
  );
}
