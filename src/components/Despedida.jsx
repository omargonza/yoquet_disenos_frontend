import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";

export default function Despedida() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [countdown, setCountdown] = useState(6);
  const backendURL =
    import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000";

  useEffect(() => {
    showToast("Gracias por elegir Yoquet Diseños 💛", "celebration");

    const timer = setInterval(
      () => setCountdown((prev) => (prev > 0 ? prev - 1 : 0)),
      1000
    );
    const redirect = setTimeout(() => navigate("/"), 6000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirect);
    };
  }, [navigate]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      className="relative min-h-screen flex flex-col items-center justify-center text-center bg-gradient-to-br from-[#fbf9f4] via-[#f6f1e8] to-[#f1e8da] text-[#3f3524] font-serif overflow-hidden"
    >
      {/* 🌸 Capas visuales suaves */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.45 }}
        transition={{ duration: 2 }}
        className="pointer-events-none -z-10 absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(212,185,120,0.25),transparent_70%),radial-gradient(circle_at_70%_70%,rgba(185,153,75,0.25),transparent_70%)] blur-[120px]"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ duration: 3 }}
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2),transparent_70%)] blur-3xl"
      />

      {/* ✨ Logo flotante con aura */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative mb-8"
      >
        <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(circle_at_center,rgba(240,210,160,0.3),transparent_70%)] blur-xl" />
        <img
          src={`${backendURL}/media/productos/souvenir/catalogo-diego-1-1.webp`}
          alt="Yoquet Diseños"
          className="w-28 h-28 rounded-3xl object-cover shadow-[0_0_40px_rgba(176,140,78,0.4)] ring-4 ring-[#e2c78c]/50 relative z-10"
        />
      </motion.div>

      {/* 🕊️ Mensaje central */}
      <motion.h1
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        className="text-4xl md:text-5xl font-bold text-[#b08c4e] mb-4 tracking-tight drop-shadow-sm"
      >
        ¡Gracias por tu visita!
      </motion.h1>

      <motion.p
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 1 }}
        className="text-[#6f6249] text-lg max-w-lg mb-10 leading-relaxed"
      >
        En cada pieza hay un gesto, una historia, una emoción.  
        <span className="block mt-2 text-[#b08c4e] font-medium italic">
          Gracias por formar parte de este arte cotidiano 🌿
        </span>
      </motion.p>

      {/* ✨ Botón */}
      <motion.button
        whileHover={{
          scale: 1.07,
          boxShadow: "0 0 25px rgba(212,185,120,0.45)",
          backgroundPosition: "100%",
        }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/")}
        className="px-10 py-3 bg-gradient-to-r from-[#d4b978] via-[#e8d29a] to-[#b9994b] bg-[length:200%_auto] text-[#3f2e13] font-semibold rounded-full shadow-[0_4px_20px_rgba(176,140,78,0.3)] hover:shadow-[0_4px_30px_rgba(176,140,78,0.5)] transition-all duration-500"
      >
        Volver al inicio 🕊️
      </motion.button>

      {/* 🌅 Cuenta regresiva */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-sm text-[#a4977b] mt-8 italic"
      >
        Serás redirigido en{" "}
        <span className="text-[#b08c4e] font-semibold">{countdown}</span>{" "}
        segundos...
      </motion.p>

      {/* 🌈 Transición final dorada */}
      <motion.div
        initial={{ opacity: 0 }}
        exit={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 bg-gradient-to-t from-[#f9f4e9]/40 via-transparent to-transparent pointer-events-none"
      />
    </motion.div>
  );
}
