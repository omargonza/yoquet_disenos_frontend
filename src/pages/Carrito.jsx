import { useCarrito } from "../context/CarritoContext";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Carrito() {
  const {
    carrito,
    agregarAlCarrito,
    eliminarDelCarrito,
    quitarProducto,
    vaciarCarrito,
    totalItems,
    totalPrecio,
  } = useCarrito();

  const navigate = useNavigate();

  // ✨ Estado vacío
  if (carrito.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#faf8f3] via-[#f5efe5] to-[#efe7db] text-[#3f3524] font-serif"
      >
        <h2 className="text-3xl font-semibold text-[#b08c4e] mb-4 tracking-tight">
          Tu carrito está vacío 🛍️
        </h2>
        <p className="text-[#7a6a4f] mb-6 italic">Explorá nuestras piezas únicas y elegí la tuya ✨</p>
        <button
          onClick={() => navigate("/productos")}
          className="px-8 py-3 bg-gradient-to-r from-[#d4b978] via-[#e8d29a] to-[#b9994b] text-[#3f2e13] font-semibold rounded-full shadow-[0_4px_20px_rgba(176,140,78,0.3)] hover:shadow-[0_4px_30px_rgba(176,140,78,0.5)] transition-all duration-300"
        >
          Ver catálogo
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="min-h-screen bg-gradient-to-br from-[#fdfbf6] via-[#f7f2ea] to-[#f3ebde] text-[#3f3524] p-10"
    >
      <h2 className="text-4xl font-extrabold text-center text-[#b08c4e] mb-12 tracking-tight drop-shadow-sm">
        🛒 Tu carrito
      </h2>

      <div className="max-w-6xl mx-auto bg-white/70 backdrop-blur-lg border border-[#e7dcc5]/70 rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.08)] overflow-hidden">
        {/* Encabezado */}
        <div className="grid grid-cols-6 text-[#7a6a4f] text-sm font-semibold px-8 py-4 border-b border-[#e7dcc5]/70 uppercase tracking-wide bg-gradient-to-r from-[#fffdfa] to-[#faf5ec]">
          <div className="col-span-3">Producto</div>
          <div className="text-center">Cantidad</div>
          <div className="text-center">Precio</div>
          <div className="text-right pr-2">Subtotal</div>
        </div>

        {/* Lista de productos */}
        <AnimatePresence>
          {carrito.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-6 items-center px-8 py-5 border-b border-[#e7dcc5]/50 hover:bg-[#fffaf3]/70 transition-all duration-300"
            >
              {/* Imagen + nombre */}
              <div className="col-span-3 flex items-center gap-5">
                <div className="relative">
                  <img
                    src={item.imagen}
                    alt={item.nombre}
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-[#e7dcc5] shadow-sm"
                  />
                  <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_50%_60%,rgba(255,232,180,0.15),transparent_60%)] blur-md"></div>
                </div>
                <div>
                  <p className="font-semibold text-[#4b3f2f]">{item.nombre}</p>
                  <button
                    onClick={() => quitarProducto(item.id)}
                    className="text-xs text-[#a15234] hover:text-[#b42f1e] transition"
                  >
                    Eliminar
                  </button>
                </div>
              </div>

              {/* Controles cantidad */}
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => eliminarDelCarrito(item.id)}
                  className="w-7 h-7 flex items-center justify-center rounded-full border border-[#b08c4e] text-[#b08c4e] font-bold hover:bg-[#f8f3e8] transition"
                >
                  −
                </button>
                <span className="text-sm font-semibold">{item.cantidad}</span>
                <button
                  onClick={() => agregarAlCarrito(item)}
                  className="w-7 h-7 flex items-center justify-center rounded-full border border-[#b08c4e] text-[#b08c4e] font-bold hover:bg-[#f8f3e8] transition"
                >
                  +
                </button>
              </div>

              {/* Precio */}
              <div className="text-center text-[#7a6a4f] font-medium">
                ${item.precio}
              </div>

              {/* Subtotal */}
              <div className="text-right text-[#b08c4e] font-bold text-lg pr-2">
                ${(item.precio * item.cantidad).toFixed(2)}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Footer totales */}
        <div className="px-8 py-8 flex flex-col sm:flex-row justify-between items-center gap-6 bg-gradient-to-r from-[#fffdfa] to-[#faf5ec]">
          <button
            onClick={vaciarCarrito}
            className="text-sm text-[#b08c4e] hover:underline hover:text-[#9c7e43] transition-all"
          >
            Vaciar carrito
          </button>

          <div className="text-right">
            <p className="text-sm text-[#7a6a4f]">
              Total de artículos:{" "}
              <span className="font-semibold text-[#4b3f2f]">
                {totalItems}
              </span>
            </p>
            <p className="text-2xl font-extrabold text-[#b08c4e] tracking-tight mt-1">
              Total: ${totalPrecio.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Botones acción */}
      <div className="max-w-6xl mx-auto text-center mt-12 flex flex-col sm:flex-row gap-6 justify-center">
        <motion.button
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate("/productos")}
          className="px-10 py-3 bg-gradient-to-r from-[#d4b978] via-[#e8d29a] to-[#b9994b] text-[#3f2e13] rounded-full shadow-[0_4px_20px_rgba(176,140,78,0.3)] hover:shadow-[0_4px_30px_rgba(176,140,78,0.5)] font-semibold tracking-wide transition-all"
        >
          Seguir comprando ✨
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate("/checkout")}
          className="px-10 py-3 border-2 border-[#b08c4e] text-[#b08c4e] rounded-full font-semibold hover:bg-[#fff8e2] hover:text-[#3f2e13] shadow-sm transition-all"
        >
          Finalizar compra 💳
        </motion.button>
      </div>
    </motion.div>
  );
}

