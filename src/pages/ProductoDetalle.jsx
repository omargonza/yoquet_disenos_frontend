import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useCarrito } from "../context/CarritoContext";

const easing = [0.25, 0.1, 0.25, 1];

export default function ProductoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { agregarAlCarrito } = useCarrito();

  const [producto, setProducto] = useState(null);
  const [error, setError] = useState("");
  const [estado, setEstado] = useState({
    agregado: false,
    vuelo: false,
    pulso: false,
    rayo: false,
    destelloPrecio: false,
  });

  const backendURL =
    import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000";

  /* =========================================================
     Carga del producto (optimizado)
     ========================================================= */
  useEffect(() => {
    let isMounted = true;

    axios
      .get(`${backendURL}/api/productos/${id}/`)
      .then((res) => {
        if (isMounted) setProducto(res.data);
      })
      .catch(() => setError("No se pudo cargar el producto"));

    return () => {
      isMounted = false;
    };
  }, [id, backendURL]);

  /* =========================================================
     Manejar agregar al carrito (1 solo update → super eficiente)
     ========================================================= */
  const handleAdd = useCallback(() => {
    if (!producto) return;

    agregarAlCarrito(producto);

    setEstado({
      agregado: true,
      vuelo: true,
      pulso: true,
      rayo: true,
      destelloPrecio: true,
    });

    setTimeout(() => setEstado((s) => ({ ...s, vuelo: false })), 900);
    setTimeout(() => setEstado((s) => ({ ...s, pulso: false })), 900);
    setTimeout(() => setEstado((s) => ({ ...s, rayo: false })), 700);
    setTimeout(() => setEstado((s) => ({ ...s, destelloPrecio: false })), 950);
  }, [producto, agregarAlCarrito]);

  /* =========================================================
     Loading
     ========================================================= */
  if (error)
    return (
      <p className="text-center text-red-600 mt-10 font-semibold">{error}</p>
    );

  if (!producto)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#3b3d45] text-[#d4b978] text-lg">
        Cargando producto...
      </div>
    );

  const imgSrc = producto.imagen || "/fallback.webp";

  /* =========================================================
     UI principal — más liviano pero igual de premium
     ========================================================= */
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
      className="relative min-h-screen bg-gradient-to-br from-[#3b3d45] via-[#5c5f6a] to-[#7d808c] text-[#e7e6e1] py-16 px-6 sm:px-12 flex items-center justify-center overflow-hidden"
    >
      {/* CAPAS DE BRILLO — optimizadas sin blur excesivo */}
      <div className="absolute inset-0 pointer-events-none opacity-60">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,215,120,0.10),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(163,161,255,0.10),transparent_70%)]" />
      </div>

      {/* ⚡ Pulso parabólico SVG — mucho más barato que div+blur */}
      <AnimatePresence>
        {estado.pulso && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 0.4, scale: 2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: easing }}
            className="absolute w-[80vw] h-[40vh] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(150,255,220,0.35),transparent_70%)] pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* ⚡ RAYO */}
      <AnimatePresence>
        {estado.rayo && (
          <motion.div
            initial={{ opacity: 0, scaleY: 0.3 }}
            animate={{ opacity: 0.8, scaleY: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: easing }}
            className="absolute left-1/2 -translate-x-1/2 w-[2px] h-[220px] bg-gradient-to-b from-transparent via-[#b8fff7] to-transparent pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* CARD PRINCIPAL */}
      <motion.div
        layoutId={`producto-${producto.id}`}
        className="relative max-w-5xl w-full backdrop-blur-xl bg-white/5 border border-[#d4b978]/30 rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.25)] overflow-hidden flex flex-col md:flex-row items-center gap-12 p-10 z-10"
      >
        {/* Imagen */}
        <motion.div className="relative flex-1 flex justify-center items-center">
          <motion.img
            src={imgSrc}
            alt={producto.nombre}
            className="rounded-[2rem] shadow-md object-cover w-full max-w-md border-[3px] border-[#d4b978]/20"
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
          />

          {/* Vuelo */}
          <AnimatePresence>
            {estado.vuelo && (
              <motion.img
                src={imgSrc}
                initial={{ opacity: 1, scale: 1 }}
                animate={{
                  opacity: 0,
                  scale: 0.3,
                  y: -200,
                  x: 200,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9 }}
                className="absolute w-32 h-32 rounded-xl shadow-lg border border-white/30 pointer-events-none"
              />
            )}
          </AnimatePresence>
        </motion.div>

        {/* Información */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1 flex flex-col"
        >
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-[#b6fff1] via-[#d4b978] to-[#a3a1ff] text-transparent bg-clip-text drop-shadow-lg">
            {producto.nombre}
          </h1>

          <p className="text-sm text-[#dcdcdc]/80 mb-2">
            {producto.categoria?.nombre || "Sin categoría"}
          </p>

          <p className="text-[#f1f1f1]/90 mb-6 leading-relaxed">
            {producto.descripcion}
          </p>

          {/* Precio */}
          <div className="relative mb-8">
            <p className="text-3xl font-bold bg-gradient-to-r from-[#b6fff1] to-[#a3a1ff] text-transparent bg-clip-text">
              ${producto.precio}
            </p>

            <AnimatePresence>
              {estado.destelloPrecio && (
                <motion.span
                  initial={{ x: "-120%" }}
                  animate={{ x: "120%" }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-[20deg]"
                />
              )}
            </AnimatePresence>
          </div>

          {/* Botón */}
          <button
            onClick={handleAdd}
            disabled={estado.agregado}
            className={`w-full py-4 rounded-full font-semibold transition-all ${
              estado.agregado
                ? "bg-[#a3a1ff]/50 text-[#333] cursor-not-allowed"
                : "bg-gradient-to-r from-[#b6fff1] to-[#a3a1ff] text-[#111] hover:shadow-[0_0_18px_rgba(180,220,250,0.4)]"
            }`}
          >
            {estado.agregado ? "Agregado ✔️" : "Agregar al carrito 🛒"}
          </button>

          <button
            onClick={() => navigate("/productos")}
            className="mt-8 text-sm text-[#dadada] hover:text-[#b6fff1] transition"
          >
            ← Volver al catálogo
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
