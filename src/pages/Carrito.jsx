import { useEffect, useRef } from "react";
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
  const canvasRef = useRef(null);

  /* 🌌 Fondo metalizado dinámico con partículas suaves */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const colors = [
      "rgba(255,216,90,0.25)",
      "rgba(66,226,184,0.25)",
      "rgba(163,161,255,0.25)",
      "rgba(255,102,179,0.25)",
    ];
    let particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = Array.from({ length: 40 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 0.5,
        dx: (Math.random() - 0.5) * 0.5,
        dy: (Math.random() - 0.5) * 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
      });
      requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
    exit: { opacity: 0, y: -15, transition: { duration: 0.4 } },
  };

  // 🛍️ Carrito vacío
  if (carrito.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative min-h-screen flex flex-col items-center justify-center text-[#f2f2f2] overflow-hidden bg-gradient-to-br from-[#3b3d45] via-[#5c5f6a] to-[#7d808c]"
      >
        <canvas ref={canvasRef} className="absolute inset-0 -z-10" />
        <h2 className="text-4xl font-bold bg-gradient-to-r from-[#d4b978] via-[#ffd85a] to-[#a3a1ff] text-transparent bg-clip-text drop-shadow-lg mb-4">
          Tu carrito está vacío 🛍️
        </h2>
        <p className="text-[#e6e4de] mb-6 text-sm opacity-80">
          Explorá nuestras piezas únicas y elegí la tuya ✨
        </p>
        <button
          onClick={() => navigate("/productos")}
          className="btn-festivo text-[#1b1b1d]"
        >
          Ver catálogo
        </button>
      </motion.div>
    );
  }

  /* 🛒 Carrito lleno */
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#3b3d45] via-[#5c5f6a] to-[#7d808c] text-[#f5f4f2] px-6 py-12"
    >
      <canvas ref={canvasRef} className="absolute inset-0 -z-10" />

      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        className="text-5xl font-extrabold text-center mb-14 bg-gradient-to-r from-[#ffd85a] via-[#f0e4c3] to-[#a3a1ff] text-transparent bg-clip-text drop-shadow-[0_0_25px_rgba(255,216,90,0.3)]"
      >
        🛒 Tu carrito
      </motion.h2>

      {/* 🧾 Tabla de productos */}
      <div className="relative max-w-6xl mx-auto backdrop-blur-2xl bg-white/10 border border-[#ffd85a]/40 rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.25)] overflow-hidden">
        <div className="grid grid-cols-6 text-[#f8f7f5]/70 text-sm font-semibold px-8 py-4 border-b border-[#ffd85a]/30 uppercase tracking-wide bg-gradient-to-r from-[#2f3034] to-[#3f4148]">
          <div className="col-span-3">Producto</div>
          <div className="text-center">Cantidad</div>
          <div className="text-center">Precio</div>
          <div className="text-right pr-2">Subtotal</div>
        </div>

        <AnimatePresence>
          {carrito.map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              className="grid grid-cols-6 items-center px-8 py-5 border-b border-[#ffd85a]/20 hover:bg-white/10 transition-all duration-300"
            >
              <div className="col-span-3 flex items-center gap-5">
                <div className="relative">
                  <img
                    src={item.imagen}
                    alt={item.nombre}
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-[#ffd85a]/60 shadow-[0_0_15px_rgba(255,216,90,0.3)]"
                  />
                  <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_50%_60%,rgba(255,232,180,0.2),transparent_60%)] blur-md"></div>
                </div>
                <div>
                  <p className="font-semibold text-[#fefefe]">{item.nombre}</p>
                  <button
                    onClick={() => quitarProducto(item.id)}
                    className="text-xs text-[#ff8a7b] hover:text-[#ffc1af] transition"
                  >
                    Eliminar
                  </button>
                </div>
              </div>

              {/* Cantidad */}
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => eliminarDelCarrito(item.id)}
                  className="w-7 h-7 flex items-center justify-center rounded-full border border-[#ffd85a] text-[#ffd85a] font-bold hover:bg-[#fff9ec]/10 transition"
                >
                  −
                </button>
                <span className="text-sm font-semibold">{item.cantidad}</span>
                <button
                  onClick={() => agregarAlCarrito(item)}
                  className="w-7 h-7 flex items-center justify-center rounded-full border border-[#ffd85a] text-[#ffd85a] font-bold hover:bg-[#fff9ec]/10 transition"
                >
                  +
                </button>
              </div>

              <div className="text-center text-[#ffd85a] font-medium">
                ${item.precio}
              </div>

              <div className="text-right text-[#f0e4c3] font-bold text-lg pr-2">
                ${(item.precio * item.cantidad).toFixed(2)}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Totales */}
        <motion.div
          key={totalPrecio}
          initial={{ opacity: 0.8, scale: 0.95 }}
          animate={{ opacity: 1, scale: [1, 1.05, 1] }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="px-8 py-8 flex flex-col sm:flex-row justify-between items-center gap-6 bg-gradient-to-r from-[#2f3034] to-[#3f4148] border-t border-[#ffd85a]/30"
        >
          <button
            onClick={vaciarCarrito}
            className="text-sm text-[#ffd85a] hover:underline hover:text-[#f0e4c3] transition-all"
          >
            Vaciar carrito
          </button>

          <div className="text-right">
            <p className="text-sm text-[#f6f6f6]/80">
              Total de artículos:{" "}
              <span className="font-semibold text-[#ffd85a]">{totalItems}</span>
            </p>
            <p className="text-3xl font-extrabold bg-gradient-to-r from-[#ffd85a] via-[#f0e4c3] to-[#a3a1ff] text-transparent bg-clip-text tracking-tight mt-1 drop-shadow-md">
              Total: ${totalPrecio.toFixed(2)}
            </p>
          </div>
        </motion.div>
      </div>

      {/* ⚡ Botones inferiores */}
      <motion.div
        key={totalPrecio}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative max-w-6xl mx-auto text-center mt-12 flex flex-col sm:flex-row gap-6 justify-center items-center"
      >
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate("/productos")}
          className="btn-festivo text-[#1b1b1d]"
        >
          Seguir comprando ✨
        </motion.button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.9, scale: [1, 1.05, 1] }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
          className="relative w-[100px] h-[2px] bg-gradient-to-r from-transparent via-[#ffd85a] to-transparent rounded-full overflow-hidden hidden sm:block"
        >
          <div className="absolute inset-0 animate-lightflow bg-gradient-to-r from-transparent via-[#fff7d1] to-transparent" />
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate("/checkout")}
          className="px-10 py-3 border-2 border-[#ffd85a] text-[#ffd85a] rounded-full font-semibold hover:bg-[#fff9ec]/10 shadow-sm transition-all duration-300"
        >
          Finalizar compra 💳
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
