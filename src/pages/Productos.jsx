import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../utils/api";
import { useCarrito } from "../context/CarritoContext";
import { useToast } from "../context/ToastContext";

/* Sanitización */
const sanitizeText = (str) =>
  typeof str === "string"
    ? str.replace(/</g, "&lt;").replace(/>/g, "&gt;").slice(0, 200)
    : "";

const sanitizeImg = (url) => {
  if (!url || typeof url !== "string") return "/fallback.webp";
  if (!url.startsWith("http")) return "/fallback.webp";
  return url.replace(/["'<>]/g, "");
};

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(!navigator.onLine);

  const { agregarAlCarrito } = useCarrito();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  /* Carga inicial (cache + refresh) */
  useEffect(() => {
    let mounted = true;

    async function load() {
      const cachedProd = localStorage.getItem("cache_prod");
      const cachedCat = localStorage.getItem("cache_cat");

      if (cachedProd && cachedCat) {
        if (!mounted) return;
        setProductos(JSON.parse(cachedProd));
        setCategorias(JSON.parse(cachedCat));
        setLoading(false);
      }

      try {
        const [prodRes, catRes] = await Promise.all([
          api.get("/api/productos/", { timeout: 20000 }),
          api.get("/api/categorias/", { timeout: 20000 }),
        ]);

        if (!mounted) return;

        const prod = prodRes.data.results || prodRes.data;
        const cat = catRes.data.results || catRes.data;

        setProductos(Array.isArray(prod) ? prod : []);
        setCategorias(Array.isArray(cat) ? cat : []);

        localStorage.setItem("cache_prod", JSON.stringify(prod));
        localStorage.setItem("cache_cat", JSON.stringify(cat));
      } catch (e) {
        // UX: silencioso, usa cache
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => (mounted = false);
  }, []);

  /* Detectar online/offline */
  useEffect(() => {
    const on = () => setOffline(false);
    const off = () => setOffline(true);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  /* Si venimos desde Header chips: location.state?.categoriaId */
  useEffect(() => {
    const cid = location.state?.categoriaId;
    if (!cid || !Array.isArray(categorias) || categorias.length === 0) return;
    const found = categorias.find((c) => c.id === cid);
    if (found) setCategoriaSeleccionada(found);
    // limpiamos state para no “persistir” al volver
    if (cid) navigate(location.pathname, { replace: true, state: {} });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categorias]);

  const productosFiltrados = useMemo(() => {
    if (!categoriaSeleccionada) return productos;
    return productos.filter((p) => p.categoria?.id === categoriaSeleccionada.id);
  }, [productos, categoriaSeleccionada]);

  const handleAdd = useCallback(
    (p) => {
      agregarAlCarrito(p);
      showToast(`Agregado: ${sanitizeText(p.nombre)}`, "success");
    },
    [agregarAlCarrito, showToast]
  );

  if (loading) {
    return (
      <div className="container-yoquet py-12">
        <div className="card-yoquet p-6">
          <div className="skeleton h-7 w-44" />
          <div className="skeleton h-4 w-72 mt-3" />
          <div className="skeleton h-10 w-40 mt-6 rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-[calc(100vh-72px)]">
      {offline && (
        <div
          className="text-center py-2 text-sm font-extrabold"
          style={{
            background: "rgba(255,216,90,0.35)",
            color: "var(--text)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          Modo offline — Catálogo cargado desde caché
        </div>
      )}

      <section className="container-yoquet pt-8 pb-12">
        {/* Header */}
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold" style={{ color: "var(--text)" }}>
              <span
                style={{
                  background:
                    "linear-gradient(90deg, var(--color-rosa), var(--color-dorado), var(--color-turquesa))",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                }}
              >
                Catálogo
              </span>
            </h1>
            <p className="mt-2 text-sm font-bold" style={{ color: "var(--muted)" }}>
              Explorá y sumá al carrito en un toque.
            </p>
          </div>

          <button className="btn-yoquet-ghost" onClick={() => navigate("/carrito")}>
            Ir al carrito
          </button>
        </div>

        {/* Filtros */}
        <div className="mt-7 flex gap-2 flex-wrap">
          <button
            className={categoriaSeleccionada ? "chip" : "chip is-active"}
            onClick={() => setCategoriaSeleccionada(null)}
          >
            Todas
          </button>

          {categorias.map((c) => (
            <button
              key={c.id}
              className={categoriaSeleccionada?.id === c.id ? "chip is-active" : "chip"}
              onClick={() => setCategoriaSeleccionada(c)}
              title={sanitizeText(c.nombre)}
            >
              {sanitizeText(c.nombre)}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {productosFiltrados.map((p) => (
            <article
              key={p.id}
              className="card-yoquet overflow-hidden cursor-pointer"
              onClick={() => navigate(`/productos/${p.id}`)}
            >
              <img
                src={sanitizeImg(p.imagen)}
                alt={sanitizeText(p.nombre)}
                className="w-full h-56 object-cover"
                loading="lazy"
                decoding="async"
                onError={(e) => (e.currentTarget.src = "/fallback.webp")}
              />

              <div className="p-4">
                <h3 className="font-extrabold text-lg truncate" style={{ color: "var(--text)" }}>
                  {sanitizeText(p.nombre)}
                </h3>
                <p className="text-sm mt-1 line-clamp-2" style={{ color: "var(--muted)", fontWeight: 700 }}>
                  {sanitizeText(p.descripcion)}
                </p>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <div className="text-xl font-extrabold" style={{ color: "var(--text)" }}>
                    ${p.precio}
                  </div>

                  <button
                    className="btn-yoquet"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAdd(p);
                    }}
                  >
                    Agregar
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
