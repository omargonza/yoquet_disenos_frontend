import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

import { useCarrito } from "../context/CarritoContext";
import { useToast } from "../context/ToastContext";

/* ============================================================
   Sanitización
============================================================ */
const sanitizeText = (str) =>
  typeof str === "string"
    ? str.replace(/</g, "&lt;").replace(/>/g, "&gt;").slice(0, 200)
    : "";

const sanitizeImg = (url) => {
  if (!url || typeof url !== "string") return "/fallback.png";
  if (!url.startsWith("http")) return "/fallback.png";
  return url.replace(/["'<>]/g, "");
};

/* ============================================================
   PARTICULARMENTE LIVIANO
============================================================ */
export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(!navigator.onLine);

  const { agregarAlCarrito } = useCarrito();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const backendURL =
    (import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000").replace(/\/$/, "");

  /* ============================================================
     CARGA: SI HAY INTERNET → API  
            SIN INTERNET → CACHE LOCAL
============================================================ */
 useEffect(() => {
  let mounted = true;

  async function load() {
    // 1) Carga instantánea desde cache
    const cachedProd = localStorage.getItem("cache_prod");
    const cachedCat = localStorage.getItem("cache_cat");

    if (cachedProd && cachedCat) {
      setProductos(JSON.parse(cachedProd));
      setCategorias(JSON.parse(cachedCat));
      setLoading(false);
    }

    // 2) Intento de actualización desde backend
    try {
      const [prodRes, catRes] = await Promise.all([
        api.get("/api/productos/", { timeout:25000  }),
        api.get("/api/categorias/", { timeout: 25000 })
      ]);

      if (!mounted) return;

      const prod = prodRes.data.results || prodRes.data;
      const cat = catRes.data.results || catRes.data;

      setProductos(prod);
      setCategorias(cat);

      localStorage.setItem("cache_prod", JSON.stringify(prod));
      localStorage.setItem("cache_cat", JSON.stringify(cat));

    } catch (e) {
      console.warn("Error consultando backend:", e.message);

      if (!navigator.onLine) {
        console.warn("Modo OFFLINE detectado → usando cache.");
      } else {
        console.warn("API FALLÓ pero hay internet → usando cache.");
      }
    } finally {
      if (mounted) setLoading(false);
    }
  }

  load();
  return () => (mounted = false);
}, []);



  /* ============================================================
     Filtro por categoría
============================================================ */
  const productosFiltrados = useMemo(() => {
    if (!categoriaSeleccionada) return productos;
    return productos.filter((p) => p.categoria?.id === categoriaSeleccionada.id);
  }, [productos, categoriaSeleccionada]);

  /* ============================================================
     Agregar al carrito
============================================================ */
  const handleAdd = useCallback(
    (p) => {
      agregarAlCarrito(p);
      showToast(`Agregado: ${sanitizeText(p.nombre)}`, "success");
    },
    [agregarAlCarrito]
  );

  /* ============================================================
     LOADING inicial
============================================================ */
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-[#ffd85a]">
        Cargando catálogo...
      </div>
    );

  /* ============================================================
     UI FINAL — estable, liviana, sin animaciones pesadas
============================================================ */
  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage: "linear-gradient(135deg, #2b2d33, #4a4c55, #7d808c)",
        backgroundSize: "cover",
      }}
    >
      {offline && (
        <div className="bg-yellow-500 text-black text-center py-2 font-semibold">
          Modo offline — Catálogo cargado desde caché
        </div>
      )}

      <div className="min-h-screen px-6 py-10 text-white">
        <style>{`
          .card {
            background: #ffffff12;
            border: 1px solid #ffffff22;
            border-radius: 16px;
            backdrop-filter: blur(4px);
            transition: 0.2s;
          }
          .btn-add {
            background: linear-gradient(90deg,#ff66b3,#ffd85a);
            color: #111;
            font-weight: 600;
            padding: 0.45rem 1rem;
            border-radius: 9999px;
          }
        `}</style>

        {/* Header */}
        <header className="max-w-7xl mx-auto mb-10 flex justify-between items-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-[#ff66b3] via-[#ffd85a] to-[#42e2b8] bg-clip-text text-transparent">
            Productos
          </h2>
        </header>

        {/* Filtros */}
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

        {/* Lista */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {productosFiltrados.map((p) => (
              <div
                key={p.id}
                className="card cursor-pointer p-3"
                onClick={() => navigate(`/productos/${p.id}`)}
              >
                <img
                  src={sanitizeImg(p.imagen)}
                  alt={sanitizeText(p.nombre)}
                  className="object-cover rounded-xl w-full h-56"
                  onError={(e) => (e.currentTarget.src = "/fallback.png")}
                />

                <div className="mt-3">
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

      </div>
    </div>
  );
}

/* ============================================================
   COMPONENTE FILTRO
============================================================ */
function Filtro({ text, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2 rounded-full text-sm font-semibold border 
        transition-all
        ${
          active
            ? "bg-gradient-to-r from-[#ff66b3] to-[#ffd85a] text-black"
            : "bg-white/10 text-white border-white/20"
        }`}
    >
      {text}
    </button>
  );
}
