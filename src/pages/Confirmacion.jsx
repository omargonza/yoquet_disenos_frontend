import { motion } from "framer-motion";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Confirmacion() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirigir automáticamente después de unos segundos
    const timer = setTimeout(() => navigate("/despedida"), 4000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      className="relative min-h-screen flex flex-col items-center justify-center text-center bg-gradient-to-br from-[#fbf9f4] via-[#f6f1e8] to-[#f1e8da] text-[#3f3524] font-serif overflow-hidden"
    >
      {/* ✨ Fondo luminoso con reflejos dorados */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 2 }}
        className="pointer-events-none -z-10 absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(212,185,120,0.25),transparent_70%),radial-gradient(circle_at_70%_70%,rgba(185,153,75,0.25),transparent_70%)] blur-[100px]"
      />

      {/* 🌿 Círculo dorado animado */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.1, 1], opacity: [0, 1, 1] }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute w-48 h-48 rounded-full bg-gradient-to-br from-[#d4b978] via-[#e8d29a] to-[#b9994b] blur-[60px]"
      />

      {/* 💫 Icono de confirmación */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
        className="z-10 bg-white/70 backdrop-blur-md p-8 rounded-full border-4 border-[#e2c78c]/50 shadow-[0_0_30px_rgba(212,185,120,0.4)]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-20 h-20 text-[#b08c4e]"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2.5"
          stroke="currentColor"
        >
          <motion.path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 0.5, ease: "easeInOut" }}
          />
        </svg>
      </motion.div>

      {/* 🌸 Mensaje */}
      <motion.h1
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="text-4xl font-bold text-[#b08c4e] mt-8"
      >
        Pedido confirmado ✨
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="text-[#7a6a4f] mt-4 text-lg max-w-md leading-relaxed"
      >
        Gracias por tu compra.  
        Tu pedido está siendo preparado con el mismo cuidado con el que fue creado 💛  
      </motion.p>

      {/* 🌙 Línea dorada animada */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "120px" }}
        transition={{ delay: 1.8, duration: 1 }}
        className="mt-8 h-[2px] bg-gradient-to-r from-transparent via-[#b08c4e] to-transparent"
      />

      {/* ⏳ Texto inferior */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
        className="text-sm text-[#a4977b] mt-6 italic"
      >
        Redirigiendo a la despedida en unos segundos...
      </motion.p>
    </motion.div>
  );
}
