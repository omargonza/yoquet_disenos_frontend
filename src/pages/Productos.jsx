import { useEffect, useState, useRef } from "react";
import api from "../utils/api";

import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useCarrito } from "../context/CarritoContext";
import { useToast } from "../context/ToastContext";
import axios from "axios";
// === Íconos SVG (sin dependencias externas) ===
const IconGrid = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
  </svg>
);
const IconList = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <circle cx="4" cy="6" r="1.5" />
    <circle cx="4" cy="12" r="1.5" />
    <circle cx="4" cy="18" r="1.5" />
  </svg>
);
const IconFilter = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <polygon points="3 4 21 4 14 14 14 21 10 19 10 14 3 4" />
  </svg>
);

// === Variantes de animación ===
const contenedor = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
};
const item = {
  hidden: { opacity: 0, y: 25 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [vista, setVista] = useState("grid");
  const [loading, setLoading] = useState(true);
  const [flyImage, setFlyImage] = useState(null);

  const { carrito, agregarAlCarrito } = useCarrito();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const cartRef = useRef(null);

  const backendURL =
    import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000/";

  // 🚀 Carga de productos con caché local
  useEffect(() => {
    const cachedProducts = localStorage.getItem("productos_cache");
    const cachedTime = localStorage.getItem("productos_cache_time");
    const isRecent =
      cachedTime && Date.now() - parseInt(cachedTime, 10) < 3600 * 1000; // 1h

    if (cachedProducts && isRecent) {
      setProductos(JSON.parse(cachedProducts));
      setLoading(false);
    }

    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          axios.get(`${backendURL}/api/productos/`),
          axios.get(`${backendURL}/api/categorias/`),
        ]);

        const prodData = Array.isArray(prodRes.data)
          ? prodRes.data
          : prodRes.data.results || [];

        const catData = Array.isArray(catRes.data)
          ? catRes.data
          : catRes.data.results || [];

        setProductos(prodData);
        setCategorias(catData);

        localStorage.setItem("productos_cache", JSON.stringify(prodData));
        localStorage.setItem("productos_cache_time", Date.now().toString());
      } catch (error) {
        console.error("Error al cargar productos:", error);
        showToast("No se pudieron cargar los productos", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ✈️ Efecto vuelo al carrito
  const handleAddToCart = (producto, e) => {
    agregarAlCarrito(producto);
    showToast(`${producto.nombre} agregado 🛍️`, "success");

    const imgEl = e.target.closest(".producto-card")?.querySelector("img");
    if (!imgEl || !cartRef.current) return;

    const imgRect = imgEl.getBoundingClientRect();
    const cartRect = cartRef.current.getBoundingClientRect();
    const fly = {
      x: cartRect.left - imgRect.left,
      y: cartRect.top - imgRect.top,
    };

    setFlyImage({
      src: producto.imagen,
      x: imgRect.left,
      y: imgRect.top,
      w: imgRect.width,
      h: imgRect.height,
      tx: fly.x,
      ty: fly.y,
    });

    setTimeout(() => setFlyImage(null), 1200);
  };

  // 🎯 Filtro
  const productosFiltrados = categoriaSeleccionada
    ? productos.filter((p) => p.categoria?.id === categoriaSeleccionada.id)
    : productos;

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf7f1] text-[#b08c4e] text-lg">
        Cargando catálogo...
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="min-h-screen bg-gradient-to-br from-[#fdfaf4] via-[#f7f1e6] to-[#f4ebdc] text-[#3f3524] px-6 py-10"
    >
      <div className="max-w-7xl mx-auto">
        {/* 💫 Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          <div className="text-center md:text-left">
            <h2 className="text-5xl font-extrabold text-[#b08c4e] tracking-tight drop-shadow-sm">
              Nuestro Catálogo
            </h2>
            <p className="text-[#7a6a4f] mt-2 font-medium">
              Piezas únicas, hechas con pasión y detalle ✨
            </p>
          </div>

          {/* 🛍️ Carrito */}
          <div className="flex items-center gap-5">
            <div ref={cartRef} className="relative text-3xl">
              🛍️
              {carrito.length > 0 && (
                <span className="absolute -top-2 -right-3 bg-[#b08c4e] text-white text-xs font-bold rounded-full px-2 py-0.5">
                  {carrito.length}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 bg-white/70 backdrop-blur-md border border-[#e7dcc5] rounded-full px-4 py-2 shadow-sm">
              <Tooltip text="Vista galería">
                <button
                  onClick={() => setVista("grid")}
                  className={`p-2 rounded-full transition-all ${
                    vista === "grid"
                      ? "bg-gradient-to-r from-[#d4b978] to-[#b9994b] text-[#3f2e13]"
                      : "text-[#7a6a4f] hover:text-[#b08c4e]"
                  }`}
                >
                  <IconGrid />
                </button>
              </Tooltip>
              <Tooltip text="Vista lista">
                <button
                  onClick={() => setVista("list")}
                  className={`p-2 rounded-full transition-all ${
                    vista === "list"
                      ? "bg-gradient-to-r from-[#d4b978] to-[#b9994b] text-[#3f2e13]"
                      : "text-[#7a6a4f] hover:text-[#b08c4e]"
                  }`}
                >
                  <IconList />
                </button>
              </Tooltip>
            </div>
          </div>
        </div>

        {/* 🌸 Filtros */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <FilterButton
            active={!categoriaSeleccionada}
            onClick={() => setCategoriaSeleccionada(null)}
            text="Todas"
          />
          {categorias.map((cat) => (
            <FilterButton
              key={cat.id}
              active={categoriaSeleccionada?.id === cat.id}
              onClick={() => setCategoriaSeleccionada(cat)}
              text={cat.nombre}
            />
          ))}
        </div>

        {/* 🪄 Catálogo */}
        <motion.div
          variants={contenedor}
          initial="hidden"
          animate="show"
          className={`grid ${
            vista === "grid"
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
              : "grid-cols-1 gap-6"
          }`}
        >
          {productosFiltrados.map((producto) => (
            <motion.div
              key={producto.id}
              variants={item}
              whileHover={{ scale: 1.03 }}
              onClick={() => navigate(`/productos/${producto.id}`)}
              className={`card-warm relative group overflow-hidden cursor-pointer ${
                vista === "list" ? "flex items-center gap-6 p-4" : "p-4"
              }`}
            >
              <div
                className={`relative ${
                  vista === "list" ? "w-48 h-48 flex-shrink-0" : "w-full h-64"
                } overflow-hidden rounded-[22px]`}
              >
                <img
                  loading="lazy"
                  src={producto.imagen}
                  alt={producto.nombre}
                  className="w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
                />
              </div>

              <div
                className={`flex flex-col justify-between ${
                  vista === "list" ? "flex-1 pr-4" : "mt-4"
                }`}
              >
                <h3 className="text-lg font-semibold text-[var(--color-cafe)] truncate font-[Playfair_Display]">
                  {producto.nombre}
                </h3>

                <p className="text-sm text-[#7a6a4f] line-clamp-2">
                  {producto.descripcion}
                </p>

                <div className="flex justify-between items-center mt-3">
                  <span className="text-[var(--color-dorado-profundo)] font-bold text-lg tracking-wide">
                    ${producto.precio}
                  </span>

                  <motion.button
                    whileHover={{ scale: 1.07 }}
                    whileTap={{ scale: 0.93 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(producto, e);
                    }}
                    className="px-4 py-2 rounded-full bg-gradient-to-r from-[#d4b978] to-[#b9994b] text-[#3f2e13] font-medium text-sm shadow hover:shadow-lg transition-all"
                  >
                    Agregar
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ✈️ Imagen volando */}
      <AnimatePresence>
        {flyImage && (
          <motion.img
            src={flyImage.src}
            alt="Flying to cart"
            initial={{
              position: "fixed",
              top: flyImage.y,
              left: flyImage.x,
              width: flyImage.w,
              height: flyImage.h,
              borderRadius: "12px",
              zIndex: 100,
            }}
            animate={{
              top: flyImage.y + flyImage.ty,
              left: flyImage.x + flyImage.tx,
              width: 30,
              height: 30,
              opacity: 0,
            }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="pointer-events-none"
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// === Botón de filtro ===
function FilterButton({ active, onClick, text }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`px-5 py-2 rounded-full text-sm font-semibold transition-all shadow-sm border flex items-center gap-2 ${
        active
          ? "bg-gradient-to-r from-[#d4b978] to-[#b9994b] text-[#3f2e13] shadow-md"
          : "bg-[#fffdf9] text-[#7a6a4f] border-[#e7dcc5] hover:border-[#d4b978]"
      }`}
    >
      <IconFilter />
      {text}
    </motion.button>
  );
}

// === Tooltip ===
function Tooltip({ text, children }) {
  return (
    <div className="relative group">
      {children}
      <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-[#3f2e13] text-[#f9f4e1] text-xs rounded-md px-2 py-1 shadow-md transition-all duration-300">
        {text}
      </span>
    </div>
  );
}
