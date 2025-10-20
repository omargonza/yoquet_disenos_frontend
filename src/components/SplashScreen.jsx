import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useAmbient } from "../context/AmbientContext";

export default function SplashScreen({ onFinish }) {
  const { theme, palette } = useAmbient();
  const [show, setShow] = useState(true);
  const backendURL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000";

  useEffect(() => {
   // startAmbientSound();
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onFinish, 800);
    }, 3200);
    return () => clearTimeout(timer);
  }, []);

  // ✨ Generar partículas
  const particles = Array.from({ length: 35 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    delay: Math.random() * 3,
  }));

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="fixed inset-0 flex items-center justify-center z-[9999] overflow-hidden"
          style={{
            background: `linear-gradient(to bottom right, ${palette[theme].from}, ${palette[theme].via}, ${palette[theme].to})`,
          }}
        >
          {/* 💫 Partículas flotantes */}
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 0 }}
              animate={{
                opacity: [0, 1, 0],
                y: [0, -20, 0],
                x: [0, Math.random() * 20 - 10, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                delay: p.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute rounded-full bg-[#e8d29a]"
              style={{
                width: `${p.size}px`,
                height: `${p.size}px`,
                top: `${p.y}%`,
                left: `${p.x}%`,
                opacity: 0.8,
                filter: "blur(1px)",
              }}
            />
          ))}

          {/* ✨ Luz ambiental */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 0.3, scale: 1 }}
            transition={{ duration: 2 }}
            className="absolute inset-0 blur-3xl"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${palette[theme].to}A0, transparent 70%)`,
            }}
          />

          {/* 🌟 Logo central */}
          <motion.img
            src={`${backendURL}/media/productos/souvenir/catalogo-diego-1-1.webp`}
            alt="Yoquet Diseños"
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="w-28 h-28 rounded-2xl object-cover shadow-lg ring-2 ring-[#d4b978]/60 relative z-10"
          />

          {/* 💫 Halo brillante */}
          <motion.div
            initial={{ scale: 0, opacity: 0.4 }}
            animate={{ scale: 2.4, opacity: 0 }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "easeOut",
            }}
            className="absolute w-28 h-28 rounded-full bg-gradient-to-r from-[#e8d29a]/70 to-transparent blur-xl"
          />

          {/* 🌟 Brillo que cruza */}
          <motion.div
            initial={{ left: "-200%" }}
            animate={{ left: "200%" }}
            transition={{
              duration: 2,
              ease: "easeInOut",
              repeat: 1,
              delay: 0.6,
            }}
            className="absolute w-1/3 h-32 bg-gradient-to-r from-transparent via-white/80 to-transparent skew-x-12 rounded-full"
          />

          {/* 🪶 Nombre */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="absolute bottom-16 text-3xl sm:text-4xl font-semibold text-[#4b3f2f]"
          >
            <span className="text-[#b08c4e] font-bold">Yoquet Diseños</span>
          </motion.h1>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
