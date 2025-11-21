import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useCarrito } from "../context/CarritoContext";
import { ShoppingBag } from "lucide-react";

export default function CartButton() {
  const { totalItems } = useCarrito();
  const navigate = useNavigate();

  return (
    <motion.button
      onClick={() => navigate("/carrito")}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Ir al carrito"
      className="fixed top-6 right-6 z-[999] cursor-pointer 
                 focus:outline-none group"
    >
      {/* 🔮 Botón minimal glam */}
      <div
        className="relative flex items-center justify-center w-14 h-14 rounded-full
        bg-gradient-to-br from-[#ff66b3] via-[#ffd85a] to-[#42e2b8]
        shadow-lg transition-all duration-300 border border-white/20
        group-hover:shadow-[0_0_22px_rgba(255,216,90,0.45)]"
      >
        <ShoppingBag size={26} className="text-[#1c1c1c]" />

        {/* 🔔 Badge elegante, animación optimizada */}
        {totalItems > 0 && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 180, damping: 14 }}
            className="absolute -top-1.5 -right-1.5 flex items-center justify-center
            w-5 h-5 rounded-full bg-gradient-to-br from-[#ff1d8e] to-[#ff6fb1]
            text-white text-[11px] font-bold shadow-md border border-white/20"
          >
            {totalItems}
          </motion.span>
        )}
      </div>

      {/* ✨ Halo suave (no animado → rendimiento perfecto) */}
      <div className="absolute inset-0 rounded-full bg-[#ffd85a]/25 blur-xl pointer-events-none" />
    </motion.button>
  );
}
