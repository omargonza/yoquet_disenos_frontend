import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../utils/api"; 
import { useCarrito } from "../context/CarritoContext";

// ============================================================
// Sanitización mínima y suficiente
// ============================================================
const sanitizeText = (str) =>
  typeof str === "string"
    ? str.replace(/</g, "&lt;").replace(/>/g, "&gt;").slice(0, 500)
    : "";

const sanitizeImg = (url) => {
  if (!url || typeof url !== "string") return "/fallback.webp";
  if (!url.startsWith("http")) return "/fallback.webp";
  return url.replace(/["'<>]/g, "");
};

export default function ProductoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { agregarAlCarrito } = useCarrito();

  const [producto, setProducto] = useState(null);
  const [error, setError] = useState("");
  const [agregado, setAgregado] = useState(false);

  // ============================================================
  // Cargar producto
  // ============================================================
  useEffect(() => {
    let isMounted = true;

    api
      .get(`/api/productos/${id}/`)
      .then((res) => {
        if (isMounted) setProducto(res.data);
      })
      .catch(() => {
        if (isMounted) setError("No se pudo cargar el producto");
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  // ============================================================
  // Agregar al carrito
  // ============================================================
  const handleAdd = useCallback(() => {
    if (!producto) return;

    agregarAlCarrito(producto);
    setAgregado(true);
    setTimeout(() => setAgregado(false), 1500);
  }, [producto]);

  // ============================================================
  // Loading
  // ============================================================
  if (error)
    return (
      <p className="text-center text-red-600 mt-10 font-semibold">{error}</p>
    );

  if (!producto)
    return (
      <div className="min-h-screen flex items-center justify-center text-[#ffd85a]">
        Cargando producto...
      </div>
    );

  const imgSrc = sanitizeImg(producto.imagen);

  // ============================================================
  // UI FINAL
  // ============================================================
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45 }}
      className="min-h-screen bg-[#2f3035] text-white px-6 py-14 flex items-center justify-center"
    >
      <style>{`
        .card {
          background: #ffffff10;
          border: 1px solid #ffffff22;
          border-radius: 22px;
          padding: 2rem;
          max-width: 960px;
          width: 100%;
          box-shadow: 0 8px 28px rgba(0,0,0,0.35);
        }
        .btn-main {
          background: linear-gradient(90deg,#ff66b3,#ffd85a);
          padding: 0.9rem 1.5rem;
          border-radius: 9999px;
          color:#111;
          font-weight: 600;
          text-align:center;
        }
        .btn-main:disabled {
          background:#aaaaaa55;
          color:#333;
        }
        .price {
          background: linear-gradient(90deg,#ffd85a,#ff66b3);
          -webkit-background-clip: text;
          color: transparent;
          font-weight: 800;
        }
      `}</style>

      <div className="card flex flex-col md:flex-row gap-10 items-center">
        {/* Imagen */}
        <div className="w-full md:w-1/2 flex justify-center">
          <motion.img
            src={imgSrc}
            alt={sanitizeText(producto.nombre)}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.45 }}
            className="rounded-2xl w-full max-w-md object-cover border border-[#ffffff22]"
            onError={(e) => (e.currentTarget.src = "/fallback.webp")}
          />
        </div>

        {/* Info */}
        <div className="flex-1 flex flex-col text-left">
          <h1 className="text-4xl font-extrabold mb-2 bg-gradient-to-r from-[#ff66b3] via-[#ffd85a] to-[#42e2b8] bg-clip-text text-transparent">
            {sanitizeText(producto.nombre)}
          </h1>

          <p className="text-sm text-white/70 mb-2">
            {sanitizeText(producto.categoria?.nombre || "Sin categoría")}
          </p>

          <p className="text-white/90 mb-6 leading-relaxed">
            {sanitizeText(producto.descripcion)}
          </p>

          <p className="text-3xl mb-6 price">${producto.precio}</p>

          <button
            onClick={handleAdd}
            disabled={agregado}
            className="btn-main w-full"
          >
            {agregado ? "Agregado ✔️" : "Agregar al carrito 🛒"}
          </button>

          <button
            onClick={() => navigate("/productos")}
            className="mt-6 text-sm text-white/70 hover:text-[#ffd85a] transition"
          >
            ← Volver al catálogo
          </button>
        </div>
      </div>
    </motion.div>
  );
}
