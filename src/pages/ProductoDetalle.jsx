import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useCarrito } from "../context/CarritoContext";

export default function ProductoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { agregarAlCarrito } = useCarrito();

  const [producto, setProducto] = useState(null);
  const [error, setError] = useState("");
  const [agregado, setAgregado] = useState(false);
  const [animarVuelo, setAnimarVuelo] = useState(false);

  const backendURL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000";

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    axios
      .get(`${backendURL}/api/productos/${id}/`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      .then((res) => setProducto(res.data))
      .catch(() => setError("No se pudo cargar el producto"));
  }, [id]);

  const handleAdd = () => {
    if (!producto) return;
    agregarAlCarrito(producto);
    setAgregado(true);
    setAnimarVuelo(true);
    setTimeout(() => setAnimarVuelo(false), 1200);
  };

  if (error)
    return <p className="text-center text-red-600 mt-10">{error}</p>;

  if (!producto)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf7f1] text-[#b08c4e] text-lg">
        Cargando producto...
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-gradient-to-br from-[#fbf8f2] via-[#f5efe4] to-[#f3e9da] text-[#3f3524] py-16 px-6 sm:px-12 flex items-center justify-center"
    >
      <motion.div
        layoutId={`producto-${producto.id}`}
        className="max-w-6xl w-full bg-white/70 backdrop-blur-xl border border-[#e7dcc5]/60 rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col md:flex-row items-center gap-10 p-8 relative"
      >
        {/* 📸 Imagen */}
        <motion.div
          layoutId={`imagen-${producto.id}`}
          className="relative flex-1 flex justify-center items-center"
        >
          <motion.img
            src={producto.imagen}
            alt={producto.nombre}
            className="rounded-[2rem] shadow-xl object-cover w-full max-w-md border-[5px] border-[#f4efe6]"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />

          {/* ✈️ Animación de vuelo */}
          <AnimatePresence>
            {animarVuelo && (
              <motion.img
                src={producto.imagen}
                alt="vuelo"
                initial={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                animate={{ opacity: 0, scale: 0.3, y: -250, x: 200 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, ease: "easeInOut" }}
                className="absolute w-40 h-40 rounded-2xl border-2 border-[#d4b978] shadow-lg"
              />
            )}
          </AnimatePresence>

          {/* ✨ Halo dorado */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,232,180,0.18),transparent_60%)] blur-2xl pointer-events-none" />
        </motion.div>

        {/* 💎 Información */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex-1 flex flex-col justify-center"
        >
          <h1 className="text-4xl font-extrabold text-[#b08c4e] mb-3 tracking-tight">
            {producto.nombre}
          </h1>
          <p className="text-[#7a6a4f] italic mb-4 text-sm">
            {producto.categoria?.nombre || "Sin categoría"}
          </p>
          <p className="text-[#4b3f2f] leading-relaxed mb-6 text-[1.05rem] font-light">
            {producto.descripcion}
          </p>
          <p className="text-3xl font-semibold text-[#b08c4e] mb-8 drop-shadow-sm">
            ${producto.precio}
          </p>

          <motion.button
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleAdd}
            disabled={agregado}
            className={`w-full py-4 rounded-full font-semibold tracking-wide shadow-md transition-all duration-300 ${
              agregado
                ? "bg-[#d4b978]/60 cursor-not-allowed text-[#5c5135]"
                : "bg-gradient-to-r from-[#d4b978] via-[#e8d29a] to-[#b9994b] text-[#3f2e13] hover:shadow-lg"
            }`}
          >
            {agregado ? "Agregado ✔️" : "Agregar al carrito 🛒"}
          </motion.button>

          <button
            onClick={() => navigate("/productos")}
            className="mt-8 text-sm text-[#7a6a4f] hover:text-[#b08c4e] transition-all"
          >
            ← Volver al catálogo
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
