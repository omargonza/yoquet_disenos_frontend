import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useCarrito } from "../context/CarritoContext";
import { useToast } from "../context/ToastContext";

export default function Checkout() {
  const { carrito, totalPrecio, vaciarCarrito } = useCarrito();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    direccion: "",
    metodoPago: "tarjeta",
  });
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (carrito.length === 0) navigate("/productos");
  }, [carrito, navigate]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setProcessing(true);

    setTimeout(() => {
      showToast("✨ Compra realizada con éxito. ¡Gracias por confiar en nosotros!", "success");
      vaciarCarrito();
      navigate("/empaquetando"); // 🚀 Nueva ruta de transición
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="relative min-h-screen flex items-center justify-center text-[#f8f8f8] py-16 px-6 font-serif overflow-hidden bg-gradient-to-br from-[#3b3d45] via-[#5c5f6a] to-[#7d808c]"
    >
      {/* 🌌 Fondo con reflejos metálicos y luces suaves */}
      <style>
        {`
          @keyframes metalLux {
            0% { background-position: 0% 50%; opacity: 0.55; }
            50% { background-position: 100% 50%; opacity: 0.85; }
            100% { background-position: 0% 50%; opacity: 0.55; }
          }
          @keyframes aurora {
            0% { transform: translate(0,0) scale(1); opacity: 0.25; }
            50% { transform: translate(20px,-15px) scale(1.2); opacity: 0.35; }
            100% { transform: translate(0,0) scale(1); opacity: 0.25; }
          }
          @media (max-width: 768px) {
            .metal-lux-overlay { opacity: 0.45 !important; }
          }
        `}
      </style>

      {/* ✨ Reflejo metálico global */}
      <div
        className="absolute inset-0 pointer-events-none mix-blend-overlay animate-[metalLux_22s_ease-in-out_infinite] metal-lux-overlay"
        style={{
          backgroundImage: `
            linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(212,185,120,0.08) 40%, rgba(255,255,255,0.1) 70%, transparent 100%),
            radial-gradient(circle at 35% 25%, rgba(255,255,255,0.18) 0%, transparent 60%),
            radial-gradient(circle at 80% 70%, rgba(255,255,255,0.1) 0%, transparent 70%)
          `,
          backgroundSize: "250% 250%",
          filter: "blur(2px)",
          zIndex: 1,
        }}
      />

      {/* 🌈 Auras de color premium */}
      <div className="absolute inset-0 overflow-hidden z-[2] pointer-events-none">
        <div className="absolute w-[45vw] h-[45vw] top-[10%] left-[15%] rounded-full bg-[radial-gradient(circle,rgba(255,102,179,0.25)_0%,transparent_70%)] animate-[aurora_22s_ease-in-out_infinite]" />
        <div className="absolute w-[55vw] h-[55vw] bottom-[15%] right-[10%] rounded-full bg-[radial-gradient(circle,rgba(255,216,90,0.2)_0%,transparent_70%)] animate-[aurora_26s_ease-in-out_infinite_reverse]" />
        <div className="absolute w-[40vw] h-[40vw] bottom-[25%] left-[40%] rounded-full bg-[radial-gradient(circle,rgba(66,226,184,0.25)_0%,transparent_70%)] animate-[aurora_28s_ease-in-out_infinite]" />
      </div>

      {/* 📦 Contenedor principal */}
      <motion.div
        layout
        className="relative max-w-5xl w-full bg-white/70 backdrop-blur-2xl border border-[#e7dcc5]/60 rounded-[2rem] shadow-[0_10px_50px_rgba(0,0,0,0.1)] p-10 md:p-14 z-10"
      >
        <h1 className="text-4xl font-extrabold text-center mb-10 bg-gradient-to-r from-[#ff66b3] via-[#ffd85a] to-[#42e2b8] text-transparent bg-clip-text drop-shadow-md">
          ✨ Finalizá tu compra
        </h1>

        {/* 🛍️ Resumen del pedido */}
        <div className="mb-10 bg-[#fffdf8]/80 border border-[#e7dcc5]/50 rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-[#4b3f2f] mb-3">
            Resumen del pedido
          </h2>
          <ul className="divide-y divide-[#e7dcc5]/50 mb-4">
            {carrito.map((item) => (
              <li key={item.id} className="py-3 flex justify-between text-sm">
                <span className="text-[#7a6a4f]">
                  {item.nombre} × {item.cantidad}
                </span>
                <span className="text-[#b08c4e] font-semibold">
                  ${(item.precio * item.cantidad).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between font-bold text-lg text-[#b08c4e]">
            <span>Total</span>
            <span>${totalPrecio.toFixed(2)}</span>
          </div>
        </div>

        {/* 🧾 Formulario */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {["nombre", "email", "direccion"].map((field, i) => (
            <div key={field} className={field === "direccion" ? "md:col-span-2" : ""}>
              <label className="text-sm font-medium text-[#7a6a4f] mb-2 block">
                {field === "nombre"
                  ? "Nombre completo"
                  : field === "email"
                  ? "Correo electrónico"
                  : "Dirección de envío"}
              </label>
              <input
                type={field === "email" ? "email" : "text"}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-[#e7dcc5] bg-[#fffdfa]/80 focus:ring-2 focus:ring-[#ffd85a] outline-none text-[#3f3524] placeholder-[#b3a88d]"
                placeholder={
                  field === "nombre"
                    ? "Ej: Lucía Fernández"
                    : field === "email"
                    ? "Ej: lucia@ejemplo.com"
                    : "Calle, número, ciudad"
                }
              />
            </div>
          ))}

          {/* 💳 Método de pago */}
          <div className="flex flex-col md:col-span-2 mt-2">
            <label className="text-sm font-medium text-[#7a6a4f] mb-2">
              Método de pago
            </label>
            <select
              name="metodoPago"
              value={formData.metodoPago}
              onChange={handleChange}
              className="px-4 py-3 rounded-xl border border-[#e7dcc5] bg-[#fffdfa]/80 focus:ring-2 focus:ring-[#ffd85a] outline-none text-[#3f3524]"
            >
              <option value="tarjeta">💳 Tarjeta de crédito / débito</option>
              <option value="transferencia">🏦 Transferencia bancaria</option>
              <option value="efectivo">💵 Pago en efectivo</option>
            </select>
          </div>

          {/* ✨ Botón confirmar */}
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.96 }}
            disabled={processing}
            type="submit"
            className={`md:col-span-2 mt-6 w-full py-4 rounded-full font-semibold text-[#1b1b1b] transition-all duration-300 ${
              processing
                ? "bg-[#ffd85a]/40 cursor-not-allowed"
                : "btn-festivo shadow-[0_4px_20px_rgba(176,140,78,0.3)] hover:shadow-[0_4px_30px_rgba(176,140,78,0.5)]"
            }`}
          >
            {processing ? "Procesando..." : "Confirmar compra ✨"}
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
}
