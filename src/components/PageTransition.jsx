import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAmbient } from "../context/AmbientContext";

export default function PageTransition({ children }) {
  const location = useLocation();
  const { theme } = useAmbient();
  const [showOverlay, setShowOverlay] = useState(false);

  // 🔄 Cortina al cambiar de ruta
  useEffect(() => {
    setShowOverlay(true);
    const timer = setTimeout(() => setShowOverlay(false), 1100);
    return () => clearTimeout(timer);
  }, [location.pathname, theme]);

  // 🎨 Fondo festivo oscuro con confites
  const gradient =
    "linear-gradient(135deg, #ff66b3 0%, #ffd85a 25%, #42e2b8 60%, #8b5cf6 100%)";
  const texture = `
    radial-gradient(circle at 30% 30%, rgba(255,102,179,0.25), transparent 70%),
    radial-gradient(circle at 70% 70%, rgba(255,216,90,0.25), transparent 70%),
    radial-gradient(circle at 50% 90%, rgba(66,226,184,0.2), transparent 70%),
    ${gradient}
  `;

  // 🧩 URLs de payasitos en Cloudinary (podés reemplazar por tus URLs)
  const clownImages = [
    "https://res.cloudinary.com/dfkyxmjnx/image/upload/v1730060034/yoquet/clown2.svg_epbhtb",
    "https://res.cloudinary.com/dfkyxmjnx/image/upload/v1730060034/yoquet/clown2.svg_epbhtb",
    "https://res.cloudinary.com/dfkyxmjnx/image/upload/v1730060034/yoquet/clown2.svg_epbhtb",
  ];

  return (
    <>
      {/* 🎭 Cortina brillante con reflejo */}
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
              backgroundImage: texture,
              backgroundBlendMode: "overlay, soft-light, normal",
              backgroundSize: "cover",
              filter: "brightness(1.1) contrast(1.25) saturate(1.3)",
              boxShadow: "inset 0 0 120px rgba(0,0,0,0.45)",
              backgroundColor: "#050505",
            }}
          >
            {/* ✨ Reflejo dorado */}
            <motion.div
              initial={{ x: "-60%", opacity: 0 }}
              animate={{ x: "160%", opacity: [0.05, 0.7, 0] }}
              transition={{ duration: 1.2, ease: "easeInOut", delay: 0.2 }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-[#ffd85a]/60 to-transparent"
              style={{
                mixBlendMode: "soft-light",
                transform: "skewX(-25deg)",
              }}
            />

            {/* 🤡 Payasitos flotando SVG */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              {[...Array(8)].map((_, i) => {
                const randomClown =
                  clownImages[Math.floor(Math.random() * clownImages.length)];
                return (
                  <motion.img
                    key={i}
                    src={randomClown}
                    alt="Payasito Yoquet Diseños"
                    className="absolute w-10 h-10 opacity-90 drop-shadow-[0_0_6px_rgba(255,255,255,0.3)]"
                    initial={{
                      x: Math.random() * window.innerWidth,
                      y: "120%",
                      rotate: 0,
                      scale: 0.6 + Math.random() * 0.6,
                    }}
                    animate={{
                      y: ["120%", "-10%"],
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 4 + Math.random() * 2,
                      delay: i * 0.3,
                      repeat: Infinity,
                      repeatType: "loop",
                      ease: "easeInOut",
                    }}
                  />
                );
              })}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🌈 Transición del contenido */}
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
