import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useCarrito } from "../context/CarritoContext";

export default function CartButton() {
  const { totalItems } = useCarrito();
  const navigate = useNavigate();

  return (
    <motion.div
      onClick={() => navigate("/carrito")}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed top-6 right-6 z-50 cursor-pointer"
    >
      {/* Contenedor principal con degradado dorado */}
      <div className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-[#d4b978] via-[#e8d29a] to-[#b9994b] shadow-lg hover:shadow-2xl transition-all duration-300 border border-[#e7dcc5] backdrop-blur-md">
        <span className="text-2xl text-[#3f2e13] drop-shadow-sm">🛍️</span>

        {/* 🔔 Badge contador */}
        {totalItems > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 250, damping: 15 }}
            className="absolute -top-1.5 -right-1.5 bg-[#b42f1e] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md"
          >
            {totalItems}
          </motion.span>
        )}
      </div>

      {/* ✨ Sombra dorada animada detrás */}
      <motion.div
        initial={{ opacity: 0.3, scale: 0.8 }}
        animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.8, 1.1, 0.8] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute inset-0 rounded-full bg-[#d4b978]/30 blur-2xl"
      />
    </motion.div>
  );
}
