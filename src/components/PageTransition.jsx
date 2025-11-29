import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import logo_Yoquet from "../assets_opt/logo_Yoquet.png";

export default function PageTransition({ children }) {
  const location = useLocation();
  const [showOverlay, setShowOverlay] = useState(false);

  // Cortina de transición rápida
  useEffect(() => {
    setShowOverlay(true);
    const timer = setTimeout(() => setShowOverlay(false), 650);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const metallicBackground =
    "linear-gradient(135deg, #2b2d33, #4a4c55, #7d808c)";

  return (
    <>
      <AnimatePresence>
        {showOverlay && (
          <motion.div
            key={`overlay-${location.pathname}`}
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.7, 0, 0.2, 1] }}
            className="fixed inset-0 z-[9999] flex items-center justify-center"
            style={{
              backgroundImage: metallicBackground,
              backgroundSize: "cover",
            }}
          >
            {/* LOGO */}
            <motion.img
              src={logo_Yoquet}
              alt="Yoquet Diseños"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 0.9, scale: 1 }}
              transition={{ duration: 0.35 }}
              className="w-28 sm:w-32 opacity-90"
            />

            {/* Reflejo */}
            <motion.div
              initial={{ x: "-120%", opacity: 0 }}
              animate={{ x: "120%", opacity: 0.3 }}
              transition={{ duration: 0.6, ease: "easeInOut", delay: 0.1 }}
              className="absolute inset-0 bg-gradient-to-r 
                from-transparent via-white/25 to-transparent"
              style={{
                transform: "skewX(-20deg)",
                pointerEvents: "none",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transición entre páginas */}
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="relative"
      >
        {children}
      </motion.div>
    </>
  );
}
