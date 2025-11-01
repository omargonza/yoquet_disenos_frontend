import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useCarrito } from "../context/CarritoContext";
import { ShoppingBag } from "lucide-react";

export default function CartButton() {
  const { totalItems } = useCarrito();
  const navigate = useNavigate();

  return (
    <motion.div
      onClick={() => navigate("/carrito")}
      whileHover={{ scale: 1.12, rotate: 2 }}
      whileTap={{ scale: 0.95 }}
      className="fixed top-6 right-6 z-[999] cursor-pointer group"
    >
      {/* 🌈 Contenedor principal — efecto metálico vivo */}
      <div
        className="relative flex items-center justify-center w-14 h-14 rounded-full 
        bg-gradient-to-br from-[#ff66b3] via-[#ffd85a] to-[#42e2b8]
        shadow-[0_0_20px_rgba(255,216,90,0.4)]
        border border-white/20
        backdrop-blur-md transition-all duration-500 
        group-hover:shadow-[0_0_30px_rgba(255,216,90,0.6)]"
      >
        <ShoppingBag
          size={26}
          className="text-[#1c1c1c] drop-shadow-[0_0_4px_rgba(255,255,255,0.3)]"
        />

        {/* 🔔 Badge con animación premium */}
        {totalItems > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 14 }}
            className="absolute -top-1.5 -right-1.5 flex items-center justify-center 
            w-5 h-5 rounded-full text-[11px] font-bold text-white shadow-md
            bg-gradient-to-br from-[#ff1d8e] to-[#ff6fb1]
            border border-[#fff]/30 ring-2 ring-[#ffd85a]/40"
          >
            {totalItems}
          </motion.span>
        )}
      </div>

      {/* ✨ Halo animado detrás */}
      <motion.div
        initial={{ opacity: 0.3, scale: 0.8 }}
        animate={{
          opacity: [0.3, 0.7, 0.3],
          scale: [0.8, 1.15, 0.8],
        }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 rounded-full bg-[#ffd85a]/30 blur-2xl"
      />

      {/* 💫 Efecto de brillo rápido al hover */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 0.5, scale: 1.3 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/40 to-transparent blur-xl"
      />
    </motion.div>
  );
}
