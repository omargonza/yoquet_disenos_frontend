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

  // 🕊️ Redirige si no hay productos
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
      navigate("/confirmacion");
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fbf9f4] via-[#f6f1e8] to-[#f1e8da] text-[#3f3524] py-16 px-6 font-serif overflow-hidden"
    >
      {/* ✨ Fondo visual suave */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.35 }}
        transition={{ duration: 2 }}
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(212,185,120,0.25),transparent_70%),radial-gradient(circle_at_70%_70%,rgba(185,153,75,0.25),transparent_70%)] blur-[120px]"
      />

      <motion.div
        layout
        className="relative max-w-5xl w-full bg-white/75 backdrop-blur-xl border border-[#e7dcc5]/60 rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.08)] p-10 md:p-14"
      >
        <h1 className="text-4xl font-extrabold text-[#b08c4e] mb-10 text-center tracking-tight">
          ✨ Finalizá tu compra
        </h1>

        {/* 🛍️ Resumen del pedido */}
        <div className="mb-10 bg-[#fffdf8]/60 border border-[#e7dcc5]/50 rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-[#4b3f2f] mb-4">Resumen del pedido</h2>
          <ul className="divide-y divide-[#e7dcc5]/50 mb-4">
            {carrito.map((item) => (
              <li key={item.id} className="py-3 flex justify-between text-sm">
                <span className="text-[#7a6a4f]">{item.nombre} × {item.cantidad}</span>
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
          <div className="flex flex-col">
            <label className="text-sm font-medium text-[#7a6a4f] mb-2">Nombre completo</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              className="px-4 py-3 rounded-xl border border-[#e7dcc5] bg-[#fffdfa]/80 focus:ring-2 focus:ring-[#d4b978] focus:outline-none text-[#3f3524]"
              placeholder="Ej: Lucía Fernández"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-[#7a6a4f] mb-2">Correo electrónico</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="px-4 py-3 rounded-xl border border-[#e7dcc5] bg-[#fffdfa]/80 focus:ring-2 focus:ring-[#d4b978] focus:outline-none text-[#3f3524]"
              placeholder="Ej: lucia@ejemplo.com"
            />
          </div>
          <div className="flex flex-col md:col-span-2">
            <label className="text-sm font-medium text-[#7a6a4f] mb-2">Dirección de envío</label>
            <input
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              required
              className="px-4 py-3 rounded-xl border border-[#e7dcc5] bg-[#fffdfa]/80 focus:ring-2 focus:ring-[#d4b978] focus:outline-none text-[#3f3524]"
              placeholder="Calle, número, ciudad"
            />
          </div>

          {/* 💳 Método de pago */}
          <div className="flex flex-col md:col-span-2 mt-2">
            <label className="text-sm font-medium text-[#7a6a4f] mb-2">Método de pago</label>
            <select
              name="metodoPago"
              value={formData.metodoPago}
              onChange={handleChange}
              className="px-4 py-3 rounded-xl border border-[#e7dcc5] bg-[#fffdfa]/80 focus:ring-2 focus:ring-[#d4b978] focus:outline-none text-[#3f3524]"
            >
              <option value="tarjeta">💳 Tarjeta de crédito / débito</option>
              <option value="transferencia">🏦 Transferencia bancaria</option>
              <option value="efectivo">💵 Pago en efectivo</option>
            </select>
          </div>

          {/* ✨ Botón confirmar */}
          <motion.button
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.96 }}
            disabled={processing}
            type="submit"
            className={`md:col-span-2 mt-6 w-full py-4 rounded-full font-semibold text-[#3f2e13] shadow-[0_4px_20px_rgba(176,140,78,0.3)] transition-all duration-300 ${
              processing
                ? "bg-[#b9994b]/50 cursor-not-allowed"
                : "bg-gradient-to-r from-[#d4b978] via-[#e8d29a] to-[#b9994b] hover:shadow-[0_4px_30px_rgba(176,140,78,0.5)]"
            }`}
          >
            {processing ? "Procesando..." : "Confirmar compra ✨"}
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
}
