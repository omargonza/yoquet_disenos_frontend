import { motion } from "framer-motion";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logoYoquet from "../assets/logo_Yoquet.png"; // ✔️ Seguro y local

export default function Empaquetando() {
  const navigate = useNavigate();

  // Redirección simple y segura
  useEffect(() => {
    const timer = setTimeout(() => navigate("/despedida"), 2000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center justify-center min-h-screen text-center bg-[#2f3034] text-white px-6"
    >
      {/* LOGO */}
      <motion.img
        src={logoYoquet}
        alt="Yoquet Diseños"
        className="w-28 sm:w-40 mb-8"
        initial={{ opacity: 0.8, scale: 0.9 }}
        animate={{ opacity: [0.8, 1, 0.8], scale: [0.9, 1, 0.9] }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* TITULO */}
      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="text-3xl sm:text-4xl font-bold bg-gradient-to-r 
                   from-[#ff66b3] via-[#ffd85a] to-[#42e2b8]
                   bg-clip-text text-transparent mb-6"
      >
        Empaquetando tu pedido 🎀
      </motion.h1>

      {/* BARRA SIMPLE */}
      <div className="w-56 h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-[#ffd85a]"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.6, ease: "easeInOut" }}
        />
      </div>

      {/* TEXTO */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.2, 1, 0.2] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-sm text-[#f0e4c3]/80 mt-6"
      >
        Cuidando cada detalle... 💛
      </motion.p>
    </motion.div>
  );
}
