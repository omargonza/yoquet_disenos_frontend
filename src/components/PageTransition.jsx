import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAmbient } from "../context/AmbientContext";

export default function PageTransition({ children }) {
  const location = useLocation();
  const { theme } = useAmbient();
  const [showOverlay, setShowOverlay] = useState(false);

  // 🔄 Controla la cortina en cada cambio de ruta
  useEffect(() => {
    setShowOverlay(true);
    const timer = setTimeout(() => setShowOverlay(false), 950);
    return () => clearTimeout(timer);
  }, [location.pathname, theme]);

  // 🎨 Gradiente según el ambiente
  const gradient = {
    morning: "linear-gradient(to bottom, #fff4cc, #f6e29a, #e0c267)",
    afternoon: "linear-gradient(to bottom, #f6d19b, #e9b36e, #d29443)",
    night: "linear-gradient(to bottom, #c0a45c, #8b7531, #5d4c20)",
  }[theme] || "linear-gradient(to bottom, #d4b978, #e8d29a, #b9994b)";

  // 🌟 Textura + luz difusa
  const texture = `
    repeating-linear-gradient(45deg, rgba(255,255,255,0.12) 0 2px, transparent 2px 4px),
    radial-gradient(circle at 30% 20%, rgba(255,255,255,0.25), transparent 60%),
    ${gradient}
  `;

  return (
    <>
      {/* 🪄 Cortina metalizada con reflejo dinámico */}
      <AnimatePresence>
        {showOverlay && (
          <motion.div
            key={`overlay-${location.pathname}`}
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.9, ease: [0.77, 0, 0.175, 1] }}
            className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden shadow-[inset_0_0_80px_rgba(0,0,0,0.25)]"
            style={{
              backgroundImage: texture,
              backgroundBlendMode: "overlay, soft-light, normal",
              backgroundSize: "cover",
              filter: "brightness(1.05) contrast(1.15) saturate(1.1)",
            }}
          >
            {/* ✨ Reflejo dorado en movimiento */}
            <motion.div
              initial={{ x: "-60%", opacity: 0 }}
              animate={{ x: "160%", opacity: [0.05, 0.5, 0] }}
              transition={{ duration: 0.9, ease: "easeInOut", delay: 0.2 }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
              style={{
                mixBlendMode: "soft-light",
                transform: "skewX(-25deg)",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🌸 Transición del contenido */}
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 40, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -20, filter: "blur(6px)" }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
        className="relative z-0"
      >
        {children}
      </motion.div>
    </>
  );
}
