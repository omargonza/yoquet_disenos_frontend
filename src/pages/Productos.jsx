import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { useCarrito } from "../context/CarritoContext";
import { useToast } from "../context/ToastContext";

/* ------------------------------------------------------------
   Íconos SVG livianos (sin animaciones ni cálculos)
------------------------------------------------------------ */
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

/* ============================================================
   SANITIZACIÓN contra ataques XSS / injection
============================================================ */
const sanitizeText = (str) => {
  if (!str) return "";
  return String(str)
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .slice(0, 200);
};

const sanitizeImg = (url) => {
  if (!url) return "";
  if (!url.startsWith("http")) return "";     // evita inyección file://
  return url.replace(/["'<>]/g, "");
};

/* ============================================================
   Animaciones ULTRA livianas
============================================================ */
const fade = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.45 } },
};

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [vista, setVista] = useState("grid");
  const [loading, setLoading] = useState(true);

  const { agregarAlCarrito } = useCarrito();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const backendURL =
    (import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000").replace(
      /\/$/,
      ""
    );

  /* ============================================================
     Carga rápida con CACHE seguro
============================================================ */
  useEffect(() => {
    const cached = localStorage.getItem("productos_cache");
    const cacheTime = localStorage.getItem("productos_cache_time");

    if (cached && cacheTime && Date.now() - cacheTime < 45 * 60 * 1000) {
      setProductos(JSON.parse(cached));
    }

    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          axios.get(`${backendURL}/api/productos/`, { timeout: 6000 }),
          axios.get(`${backendURL}/api/categorias/`, { timeout: 6000 }),
        ]);

        const prod = prodRes.data.results || prodRes.data;
        const cat = catRes.data.results || catRes.data;

        setProductos(prod);
        setCategorias(cat);

        localStorage.setItem("productos_cache", JSON.stringify(prod));
        localStorage.setItem("productos_cache_time", Date.now());
      } catch (err) {
        showToast("Error cargando catálogo", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* ============================================================
     Filtro seguro (Memorizado)
============================================================ */
  const productosFiltrados = useMemo(() => {
    if (!categoriaSeleccionada) return productos;
    return productos.filter(
      (p) => p.categoria?.id === categoriaSeleccionada.id
    );
  }, [productos, categoriaSeleccionada]);

  /* ============================================================
     Agregar al carrito (sin animación pesada)
============================================================ */
  const handleAdd = useCallback(
    (p) => {
      agregarAlCarrito(p);
      showToast(`Agregado: ${sanitizeText(p.nombre)}`, "success");
    },
    [agregarAlCarrito]
  );

  /* ============================================================
     LOADING
============================================================ */
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-[#ffd85a]">
        Cargando catálogo...
      </div>
    );

  /* ============================================================
     UI
============================================================ */
  return (
    <motion.div
      variants={fade}
      initial="hidden"
      animate="show"
      className="min-h-screen px-6 py-10 text-white"
    >
      <style>{`
        .card {
          background: #ffffff12;
          border: 1px solid #ffffff22;
          border-radius: 16px;
          backdrop-filter: blur(4px);
          transition: 0.25s;
        }
        .card:hover {
          transform: translateY(-4px);
          border-color: #ffd85a66;
        }
        .btn-add {
          background: linear-gradient(90deg,#ff66b3,#ffd85a);
          color: #111;
          font-weight: 600;
          padding: 0.45rem 1rem;
          border-radius: 9999px;
        }
      `}</style>

      {/* ------------------ HEADER ------------------ */}
      <header className="max-w-7xl mx-auto mb-10 flex justify-between items-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-[#ff66b3] via-[#ffd85a] to-[#42e2b8] bg-clip-text text-transparent">
          Productos
        </h2>

        <div className="flex items-center gap-3 bg-white/10 px-3 py-2 rounded-full border border-white/20">
          <button onClick={() => setVista("grid")}>
            <IconGrid />
          </button>
          <button onClick={() => setVista("list")}>
            <IconList />
          </button>
        </div>
      </header>

      {/* ------------------ FILTROS ------------------ */}
      <div className="max-w-6xl mx-auto flex gap-3 flex-wrap mb-10 justify-center">
        <Filtro
          text="Todas"
          active={!categoriaSeleccionada}
          onClick={() => setCategoriaSeleccionada(null)}
        />
        {categorias.map((c) => (
          <Filtro
            key={c.id}
            text={sanitizeText(c.nombre)}
            active={categoriaSeleccionada?.id === c.id}
            onClick={() => setCategoriaSeleccionada(c)}
          />
        ))}
      </div>

      {/* ------------------ LISTA ------------------ */}
      <div className="max-w-7xl mx-auto">
        <div
          className={`grid ${
            vista === "grid"
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "grid-cols-1 gap-5"
          }`}
        >
          {productosFiltrados.map((p) => (
            <div
              key={p.id}
              className={`card cursor-pointer ${
                vista === "list" ? "flex items-center p-4 gap-4" : "p-3"
              }`}
              onClick={() => navigate(`/productos/${p.id}`)}
            >
              <img
                src={sanitizeImg(p.imagen)}
                alt={sanitizeText(p.nombre)}
                className={`object-cover rounded-xl ${
                  vista === "list" ? "w-36 h-36" : "w-full h-56"
                }`}
                onError={(e) => (e.currentTarget.src = "/fallback.png")}
              />

              <div className={vista === "list" ? "flex-1" : "mt-3"}>
                <h3 className="font-semibold text-lg truncate">
                  {sanitizeText(p.nombre)}
                </h3>
                <p className="text-white/60 text-sm line-clamp-2">
                  {sanitizeText(p.descripcion)}
                </p>

                <div className="flex justify-between items-center mt-3">
                  <span className="font-bold text-xl">${p.precio}</span>
                  <button
                    className="btn-add"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAdd(p);
                    }}
                  >
                    Agregar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------ COMPONENTE FILTRO ------------------ */
function Filtro({ text, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2 rounded-full text-sm font-semibold border 
        flex items-center gap-2 transition-all
        ${
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
