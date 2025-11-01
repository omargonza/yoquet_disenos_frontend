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
  const [pulso, setPulso] = useState(false);
  const [rayo, setRayo] = useState(false);
  const [destelloPrecio, setDestelloPrecio] = useState(false);

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
    setPulso(true);
    setRayo(true);
    setDestelloPrecio(true);
    setTimeout(() => setAnimarVuelo(false), 1200);
    setTimeout(() => setPulso(false), 1200);
    setTimeout(() => setRayo(false), 1000);
    setTimeout(() => setDestelloPrecio(false), 1200);
  };

  if (error)
    return <p className="text-center text-red-600 mt-10">{error}</p>;

  if (!producto)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#3b3d45] via-[#5c5f6a] to-[#7d808c] text-[#d4b978] text-lg">
        Cargando producto...
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="relative min-h-screen bg-gradient-to-br from-[#3b3d45] via-[#5c5f6a] to-[#7d808c] text-[#e7e6e1] py-16 px-6 sm:px-12 flex items-center justify-center overflow-hidden"
    >
      {/* ✨ Capas de brillo de fondo */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,215,120,0.12),transparent_70%)] blur-2xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(163,161,255,0.12),transparent_70%)] blur-2xl" />
      </div>

      {/* 🌈 Pulso parabólico 3D */}
      <AnimatePresence>
        {pulso && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 80 }}
            animate={{ opacity: 0.5, scale: 2.4, y: -150 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute w-[120vw] h-[70vh] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[50%] blur-3xl pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at center, rgba(160,255,220,0.45) 0%, rgba(180,170,255,0.35) 40%, transparent 75%)",
              transform: "perspective(600px) rotateX(55deg)",
              zIndex: 0,
            }}
          />
        )}
      </AnimatePresence>

      {/* ⚡ Rayo energético entre imagen y botón */}
      <AnimatePresence>
        {rayo && (
          <motion.div
            initial={{ opacity: 0, scaleY: 0.2, rotate: -10 }}
            animate={{ opacity: 0.8, scaleY: 1, rotate: 0 }}
            exit={{ opacity: 0, scaleY: 0.5 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 w-[2px] h-[260px] rounded-full"
            style={{
              background:
                "linear-gradient(180deg, rgba(180,250,255,0) 0%, rgba(160,255,220,0.8) 50%, rgba(180,170,255,0) 100%)",
              filter: "blur(2px)",
              transform: "translateY(-30%)",
              zIndex: 1,
            }}
          />
        )}
      </AnimatePresence>

      <motion.div
        layoutId={`producto-${producto.id}`}
        className="relative max-w-6xl w-full backdrop-blur-xl bg-white/5 border border-[#d4b978]/40 rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.25)] overflow-hidden flex flex-col md:flex-row items-center gap-12 p-10 z-10"
      >
        {/* 📸 Imagen */}
        <motion.div
          layoutId={`imagen-${producto.id}`}
          className="relative flex-1 flex justify-center items-center"
        >
          <motion.img
            src={producto.imagen}
            alt={producto.nombre}
            className="rounded-[2rem] shadow-xl object-cover w-full max-w-md border-[4px] border-[#d4b978]/30"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />

          {/* ✈️ Vuelo hacia el carrito */}
          <AnimatePresence>
            {animarVuelo && (
              <motion.img
                src={producto.imagen}
                alt="vuelo"
                initial={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                animate={{
                  opacity: 0,
                  scale: 0.3,
                  y: -280,
                  x: 220,
                  rotate: 12,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
                className="absolute w-40 h-40 rounded-2xl border-2 border-[#a3a1ff]/70 shadow-lg"
              />
            )}
          </AnimatePresence>

          {/* 🌟 Halo metálico */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(180,220,250,0.18),transparent_60%)] blur-3xl pointer-events-none" />
        </motion.div>

        {/* 💎 Información */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex-1 flex flex-col justify-center"
        >
          <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-[#b6fff1] via-[#d4b978] to-[#a3a1ff] text-transparent bg-clip-text drop-shadow-lg font-[Playfair_Display]">
            {producto.nombre}
          </h1>
          <p className="text-[#cfcfcf]/80 italic mb-4 text-sm">
            {producto.categoria?.nombre || "Sin categoría"}
          </p>
          <p className="text-[#f1f1f1]/90 leading-relaxed mb-8 text-[1.05rem] font-light">
            {producto.descripcion}
          </p>

          {/* 💸 Precio con destello */}
          <div className="relative inline-block mb-10">
            <p className="text-4xl font-bold bg-gradient-to-r from-[#b6fff1] to-[#a3a1ff] text-transparent bg-clip-text drop-shadow-md">
              ${producto.precio}
            </p>

            {/* ✨ Destello luminoso */}
            <AnimatePresence>
              {destelloPrecio && (
                <motion.span
                  initial={{ x: "-100%", opacity: 0 }}
                  animate={{ x: "100%", opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent skew-x-[20deg] blur-sm"
                />
              )}
            </AnimatePresence>
          </div>

          {/* 🛒 Botón principal */}
          <motion.button
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleAdd}
            disabled={agregado}
            className={`relative overflow-hidden w-full py-4 rounded-full font-semibold tracking-wide shadow-md transition-all duration-300 ${
              agregado
                ? "bg-[#a3a1ff]/60 cursor-not-allowed text-[#1b1b1d]"
                : "bg-gradient-to-r from-[#b6fff1] to-[#a3a1ff] text-[#1b1b1d] hover:shadow-[0_0_25px_rgba(180,220,250,0.4)]"
            }`}
          >
            {agregado ? "Agregado ✔️" : "Agregar al carrito 🛒"}
          </motion.button>

          {/* 🔙 Volver */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/productos")}
            className="mt-8 text-sm text-[#cfcfcf] hover:text-[#b6fff1] transition-all"
          >
            ← Volver al catálogo
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
