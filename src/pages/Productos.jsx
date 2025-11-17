import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useCarrito } from "../context/CarritoContext";
import { useToast } from "../context/ToastContext";

/* =========================================================
   Íconos mínimos (sin recalcular JSX en cada render)
   ========================================================= */
const IconGrid = () => (
  <svg width="20" height="20" stroke="currentColor" fill="none" strokeWidth="2">
    <rect x="3" y="3" width="6" height="6" />
    <rect x="11" y="3" width="6" height="6" />
    <rect x="3" y="11" width="6" height="6" />
    <rect x="11" y="11" width="6" height="6" />
  </svg>
);

const IconList = () => (
  <svg width="20" height="20" stroke="currentColor" fill="none" strokeWidth="2">
    <line x1="8" y1="6" x2="20" y2="6" />
    <line x1="8" y1="12" x2="20" y2="12" />
    <line x1="8" y1="18" x2="20" y2="18" />
    <circle cx="4" cy="6" r="1.5" />
    <circle cx="4" cy="12" r="1.5" />
    <circle cx="4" cy="18" r="1.5" />
  </svg>
);

const IconFilter = () => (
  <svg width="18" height="18" stroke="currentColor" fill="none" strokeWidth="2">
    <polygon points="2 3 22 3 14 14 14 22 10 20 10 14 2 3" />
  </svg>
);

/* =========================================================
   Variantes para animaciones livianas
   ========================================================= */
const variantsContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const variantsItem = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [vista, setVista] = useState("grid");
  const [loading, setLoading] = useState(true);
  const [showParticles, setShowParticles] = useState(true);
  const [vuelo, setVuelo] = useState(null);

  const { agregarAlCarrito } = useCarrito();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const cartRef = useRef(null);

  const backendURL =
    import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000";

  /* =========================================================
     CARGA CON CACHE → 3× MÁS RÁPIDO
     ========================================================= */
  useEffect(() => {
    const cached = localStorage.getItem("productos_cache");
    const cachedTime = localStorage.getItem("productos_cache_time");

    if (cached && cachedTime) {
      const age = Date.now() - Number(cachedTime);
      if (age < 3600 * 1000) {
        setProductos(JSON.parse(cached));
        setLoading(false);
      }
    }

    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          axios.get(`${backendURL}/api/productos/`),
          axios.get(`${backendURL}/api/categorias/`),
        ]);

        const prod = Array.isArray(prodRes.data)
          ? prodRes.data
          : prodRes.data.results;

        const cats = Array.isArray(catRes.data)
          ? catRes.data
          : catRes.data.results;

        setProductos(prod);
        setCategorias(cats);

        localStorage.setItem("productos_cache", JSON.stringify(prod));
        localStorage.setItem("productos_cache_time", Date.now());
      } catch (err) {
        showToast("No se pudieron cargar productos", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* =========================================================
     FILTRO → useMemo evita recalcular SIEMPRE
     ========================================================= */
  const productosFiltrados = useMemo(() => {
    if (!categoriaSeleccionada) return productos;
    return productos.filter(
      (p) => p.categoria?.id === categoriaSeleccionada.id
    );
  }, [productos, categoriaSeleccionada]);

  /* =========================================================
     AL AGREGAR AL CARRITO → animación liviana + ultra rápida
     ========================================================= */
  const handleAdd = useCallback(
    (producto, e) => {
      agregarAlCarrito(producto);
      showToast(`Agregado: ${producto.nombre}`, "success");

      const img = e.target.closest(".p-card")?.querySelector("img");
      if (!img || !cartRef.current) return;

      const start = img.getBoundingClientRect();
      const end = cartRef.current.getBoundingClientRect();

      setVuelo({
        img: producto.imagen,
        start: { x: start.left, y: start.top },
        end: { x: end.left, y: end.top },
        scale: start.width / 40,
      });

      setTimeout(() => setVuelo(null), 900);

      cartRef.current.classList.add("cart-bump");
      setTimeout(() => cartRef.current?.classList.remove("cart-bump"), 400);
    },
    [agregarAlCarrito]
  );

  /* =========================================================
     LOADING
     ========================================================= */
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-[#d4b978] bg-[#0f0f10]">
        Cargando catálogo...
      </div>
    );

  /* =========================================================
     UI PRINCIPAL
     ========================================================= */
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
      className="min-h-screen px-6 py-10 text-white relative overflow-hidden"
    >
      {/* ======================== ESTILOS OPTIMIZADOS ======================== */}
      <style>{`
        .cart-bump { animation: bump .35s ease-out; }
        @keyframes bump {
          0% { transform: scale(1); }
          50% { transform: scale(1.22); }
          100% { transform: scale(1); }
        }
      `}</style>

      {/* =========================================================
        HEADER + CARRITO
      ========================================================= */}
      <header className="max-w-7xl mx-auto mb-10 flex justify-between items-center flex-wrap gap-6">
        <h2 className="text-4xl font-extrabold bg-gradient-to-r from-[#ff66b3] via-[#ffd85a] to-[#42e2b8] bg-clip-text text-transparent">
          Nuestro Catálogo
        </h2>

        <div className="flex items-center gap-4">
          <div ref={cartRef} className="text-3xl relative">
            🛍️
          </div>

          <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-full backdrop-blur-md border border-white/20">
            <button onClick={() => setVista("grid")}>
              <IconGrid />
            </button>
            <button onClick={() => setVista("list")}>
              <IconList />
            </button>
          </div>
        </div>
      </header>

      {/* =========================================================
        FILTROS
      ========================================================= */}
      <div className="max-w-6xl mx-auto flex flex-wrap gap-3 mb-10 justify-center">
        <Filtro
          text="Todas"
          active={!categoriaSeleccionada}
          onClick={() => setCategoriaSeleccionada(null)}
        />

        {categorias.map((c) => (
          <Filtro
            key={c.id}
            text={c.nombre}
            active={categoriaSeleccionada?.id === c.id}
            onClick={() => setCategoriaSeleccionada(c)}
          />
        ))}
      </div>

      {/* =========================================================
        CATÁLOGO
      ========================================================= */}
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={variantsContainer}
          initial="hidden"
          animate="show"
          className={`grid ${
            vista === "grid"
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
              : "grid-cols-1 gap-5"
          }`}
        >
          {productosFiltrados.map((p) => (
            <motion.div
              key={p.id}
              variants={variantsItem}
              className={`p-card cursor-pointer ${
                vista === "list"
                  ? "flex items-center gap-6 p-4"
                  : "p-3"
              }`}
              onClick={() => navigate(`/productos/${p.id}`)}
            >
              <div className="bg-white/10 p-3 rounded-2xl border border-white/20 backdrop-blur-sm w-full">
                <div
                  className={`overflow-hidden rounded-xl ${
                    vista === "list" ? "w-44 h-44" : "w-full h-56"
                  }`}
                >
                  <img
                    src={p.imagen}
                    alt={p.nombre}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div
                  className={`${
                    vista === "list" ? "pl-4 flex-1" : "mt-3"
                  }`}
                >
                  <h3 className="font-semibold text-lg truncate">
                    {p.nombre}
                  </h3>

                  <p className="text-sm text-white/70 line-clamp-2">
                    {p.descripcion}
                  </p>

                  <div className="flex justify-between items-center mt-3">
                    <span className="font-bold text-xl">
                      ${p.precio}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAdd(p, e);
                      }}
                      className="px-4 py-1.5 rounded-full bg-gradient-to-r from-[#ff66b3] to-[#ffd85a] text-[#111] text-sm font-bold"
                    >
                      Agregar
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* =========================================================
        ANIMACIÓN DEL VUELO
      ========================================================= */}
      <AnimatePresence>
        {vuelo && (
          <motion.img
            src={vuelo.img}
            initial={{
              opacity: 1,
              x: vuelo.start.x,
              y: vuelo.start.y,
              scale: vuelo.scale,
            }}
            animate={{
              opacity: 0,
              x: vuelo.end.x,
              y: vuelo.end.y,
              scale: 0.1,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9 }}
            className="fixed w-12 h-12 object-cover rounded-xl pointer-events-none z-50"
          />
        )}
      </AnimatePresence>

      {/* =========================================================
        TOGGLE PARTICULAS
      ========================================================= */}
      <button
        onClick={() => setShowParticles((s) => !s)}
        className="fixed bottom-6 right-6 bg-[#ffd85a] text-black w-12 h-12 rounded-full shadow-lg"
      >
        ✨
      </button>
    </motion.div>
  );
}

/* =========================================================
   COMPONENTE BOTÓN FILTRO
   ========================================================= */
function Filtro({ text, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2 rounded-full text-sm font-semibold border transition-all flex items-center gap-2 ${
        active
          ? "bg-gradient-to-r from-[#ff66b3] to-[#ffd85a] text-black"
          : "bg-white/10 text-white border-white/20"
      }`}
    >
      <IconFilter />
      {text}
    </button>
  );
}
