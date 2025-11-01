import { motion } from "framer-motion";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Empaquetando() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate("/despedida"), 2000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="relative flex flex-col items-center justify-center min-h-screen text-center overflow-hidden text-white bg-gradient-to-br from-[#3b3d45] via-[#5c5f6a] to-[#7d808c] font-[Poppins]"
    >
      {/* ✨ Reflejo */}
      <motion.div
        className="absolute inset-0 pointer-events-none mix-blend-overlay"
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%"],
          opacity: [0.3, 0.8, 0.3],
        }}
        transition={{ duration: 10, repeat: Infinity }}
        style={{
          backgroundImage:
            "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(212,185,120,0.1), rgba(255,255,255,0.05))",
          backgroundSize: "250% 250%",
        }}
      />

      {/* 🎁 Logo animado */}
      <motion.img
        src="https://res.cloudinary.com/dfkyxmjnx/image/upload/v1730060034/yoquet/logo-yoquet-metalico.svg"
        alt="Yoquet Diseños"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: [1, 1.05, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
        className="w-28 sm:w-40 mb-8 drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]"
      />

      <motion.h1
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[#ff66b3] via-[#ffd85a] to-[#42e2b8] bg-clip-text text-transparent mb-6"
      >
        Empaquetando tu pedido 🎀
      </motion.h1>

      <motion.div
        className="w-56 h-2 bg-white/10 rounded-full overflow-hidden"
        animate={{
          background: [
            "linear-gradient(90deg, transparent 0%, rgba(255,216,90,0.8) 50%, transparent 100%)",
            "linear-gradient(90deg, transparent 100%, rgba(255,216,90,0.8) 150%, transparent 200%)",
          ],
        }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-sm text-[#f0e4c3]/80 mt-6"
      >
        Cuidando cada detalle... 💛
      </motion.p>
    </motion.div>
  );
}
