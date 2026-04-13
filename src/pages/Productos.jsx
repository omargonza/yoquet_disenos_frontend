import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../utils/api";
import { useCarrito } from "../context/CarritoContext";
import { useToast } from "../context/ToastContext";
import SmartImage from "../components/SmartImage";
import { optimizeImage } from "../utils/cloudinary";

/* ================================
   Sanitización
================================ */
const sanitizeText = (str) =>
  typeof str === "string"
    ? str.replace(/</g, "&lt;").replace(/>/g, "&gt;").slice(0, 200)
    : "";

const sanitizeImg = (url) => {
  if (!url || typeof url !== "string") return "/fallback.webp";
  if (!url.startsWith("http")) return "/fallback.webp";
  return url.replace(/["'<>]/g, "");
};

/* Cache en memoria */
const pageCache = new Map();
const brokenImageIds = new Set();

const getSafeImage = (url, id) => {
  if (!url || brokenImageIds.has(id)) return "/fallback.webp";
  return url;
};

function computePageSize() {
  const w = window.innerWidth;
  if (w < 640) return 12;
  if (w < 1024) return 16;
  return 24;
}

export default function Productos() {
  const navigate = useNavigate();
  const location = useLocation();
  const { agregarAlCarrito } = useCarrito();
  const { showToast } = useToast();

  const [data, setData] = useState({ results: [], next: null, previous: null, count: 0 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(!navigator.onLine);
  const [pageSize, setPageSize] = useState(() => computePageSize());
  const reqIdRef = useRef(0);

  // Categoría desde URL
  const catParamId = useMemo(() => {
    const sp = new URLSearchParams(location.search);
    const v = sp.get("cat");
    return v ? Number(v) : null;
  }, [location.search]);

  // Búsqueda desde URL
  const qParam = useMemo(() => {
    const sp = new URLSearchParams(location.search);
    const v = sp.get("q");
    return v ? String(v).trim() : "";
  }, [location.search]);

  const setQueryParam = useCallback(
    (key, valueOrNull) => {
      const sp = new URLSearchParams(location.search);
      if (valueOrNull == null || String(valueOrNull).trim() === "") sp.delete(key);
      else sp.set(key, String(valueOrNull));
      navigate(`/productos?${sp.toString()}`);
    },
    [location.search, navigate]
  );

  // Online/offline
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

  // Resize
  useEffect(() => {
    let t = null;
    const onResize = () => {
      if (t) clearTimeout(t);
      t = setTimeout(() => {
        const next = computePageSize();
        setPageSize((prev) => (prev === next ? prev : next));
        setPage(1);
        reqIdRef.current += 1;
      }, 200);
    };
    window.addEventListener("resize", onResize);
    return () => {
      if (t) clearTimeout(t);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // Reset al cambiar filtros
  useEffect(() => {
    setPage(1);
    reqIdRef.current += 1;
  }, [catParamId, qParam]);

  const fetchPage = useCallback(
    async (p, { prefetch = false } = {}) => {
      const catIdForFetch = catParamId || "";
      const qForFetch = qParam || "";
      const key = `${p}|${catIdForFetch}|${qForFetch}|${pageSize}`;

      if (pageCache.has(key)) {
        const cached = pageCache.get(key);
        if (!prefetch) setData(cached);
        return cached;
      }

      const myReqId = ++reqIdRef.current;
      if (!prefetch) setLoading(true);

      try {
        const params = new URLSearchParams();
        params.set("page", String(p));
        params.set("page_size", String(pageSize));
        if (qForFetch) params.set("search", qForFetch);

        const url = catIdForFetch
          ? `/api/productos/por-categoria/${catIdForFetch}/?${params.toString()}`
          : `/api/productos/?${params.toString()}`;

        const res = await api.get(url, { timeout: 20000 });

        if (!prefetch && myReqId !== reqIdRef.current) return null;

        const payload = {
          results: Array.isArray(res.data.results) ? res.data.results : [],
          next: res.data.next || null,
          previous: res.data.previous || null,
          count: Number(res.data.count || 0),
        };

        pageCache.set(key, payload);
        if (!prefetch) setData(payload);
        return payload;
      } catch {
        return null;
      } finally {
        if (!prefetch) setLoading(false);
      }
    },
    [catParamId, qParam, pageSize]
  );

  // Fetch principal
  useEffect(() => {
    let mounted = true;
    (async () => {
      const res = await fetchPage(page);
      if (!mounted || !res) return;
    })();
    return () => {
      mounted = false;
    };
  }, [page, fetchPage]);

  const handleAdd = useCallback(
    (p) => {
      agregarAlCarrito(p);
      showToast(`Agregado: ${sanitizeText(p.nombre)}`, "success");
    },
    [agregarAlCarrito, showToast]
  );

  const productos = useMemo(() => data.results, [data.results]);
  const hasPrev = !!data.previous && page > 1;
  const hasNext = !!data.next;
  const skeletonItems = useMemo(() => Array.from({ length: pageSize }), [pageSize]);

  return (
    <main className="min-h-[calc(100vh-72px)]">
      {offline && (
        <div
          className="text-center py-2 text-sm font-medium"
          style={{
            background: "var(--surface-soft)",
            color: "var(--text-secondary)",
            borderBottom: "1px solid var(--border-soft)",
          }}
        >
          Modo offline — Catálogo desde caché
        </div>
      )}

      <section className="container-yoquet pt-6 pb-10">
        {/* Micro-hero limpio */}
        <div
          className="rounded-xl p-5"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border-soft)",
          }}
        >
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div>
              <div
                className="text-xs font-medium uppercase tracking-wide"
                style={{ color: "var(--text-secondary)" }}
              >
                Yoquet Diseños
              </div>
              <h1 className="text-xl sm:text-2xl font-semibold mt-1" style={{ color: "var(--text-primary)" }}>
                Catálogo de productos
              </h1>
              <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
                {data.count} productos disponibles
              </p>
            </div>

            {/* Filtros rápidos */}
            <div className="flex flex-wrap gap-2">
              {catParamId ? (
                <>
                  <span className="chip is-active">Filtrando</span>
                  <button
                    type="button"
                    className="chip"
                    onClick={() => {
                      const sp = new URLSearchParams(location.search);
                      sp.delete("cat");
                      navigate(`/productos?${sp.toString()}`);
                    }}
                  >
                    Ver todo
                  </button>
                </>
              ) : (
                <>
                  {qParam && (
                    <span className="chip is-active">Buscando: {sanitizeText(qParam)}</span>
                  )}
                  {qParam && (
                    <button
                      type="button"
                      className="chip"
                      onClick={() => setQueryParam("q", null)}
                    >
                      Limpiar
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Categorías */}
          <div className="mt-4 flex flex-wrap gap-2 overflow-x-auto scrollbar-none">
            {["Cumpleaños", "Souvenirs", "Navidad", "Deco"].map((t) => (
              <button
                key={t}
                type="button"
                className="chip"
                onClick={() => setQueryParam("q", t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Grid de productos */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {loading
            ? skeletonItems.map((_, i) => (
                <div key={i} className="card-yoquet">
                  <div className="skeleton h-36 sm:h-44 w-full rounded-lg" />
                  <div className="p-3 space-y-2">
                    <div className="skeleton h-4 w-3/4" />
                    <div className="skeleton h-3 w-1/2" />
                  </div>
                </div>
              ))
            : productos.map((p, i) => {
                const isNuevo = Number(p.id) > 120;
                const isPremium = Number(p.precio) >= 15000;
                const safeUrl = getSafeImage(p.imagen, p.id);
                const imgSrc = optimizeImage(safeUrl, { w: 400, h: 300, crop: "fill" });
                const blurSrc = optimizeImage(safeUrl, { w: 40, h: 30, quality: 20 });
                const eager = page === 1 && i < 4;

                return (
                  <article
                    key={p.id}
                    className="card-yoquet flex flex-col group"
                    onClick={() => navigate(`/productos/${p.id}`)}
                  >
                    {/* Imagen -主角 */}
                    <div className="relative aspect-[4/5] overflow-hidden rounded-t-xl">
                      <SmartImage
                        src={imgSrc}
                        blur={blurSrc}
                        alt={sanitizeText(p.nombre)}
                        eager={eager}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        fallback="/fallback.webp"
                        onError={() => brokenImageIds.add(p.id)}
                      />
                    </div>

                    {/* Contenido - limpio */}
                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="text-sm font-medium leading-tight line-clamp-2" style={{ color: "var(--text-primary)" }}>
                        {sanitizeText(p.nombre)}
                      </h3>
                      
                      <div className="mt-auto pt-4 flex items-center justify-between gap-3">
                        <span className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
                          ${p.precio}
                        </span>
                        <button
                          type="button"
                          className="btn-yoquet text-xs py-1.5 px-3"
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
                );
              })}
        </div>

        {/* Paginación */}
        {data.count > 0 && (
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              type="button"
              className="btn-yoquet-ghost text-sm"
              disabled={!hasPrev}
              onClick={() => hasPrev && setPage((x) => Math.max(1, x - 1))}
              style={!hasPrev ? { opacity: 0.4, pointerEvents: "none" } : undefined}
            >
              Anterior
            </button>
            <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
              Página {page}
            </span>
            <button
              type="button"
              className="btn-yoquet-ghost text-sm"
              disabled={!hasNext}
              onClick={() => hasNext && setPage((x) => x + 1)}
              style={!hasNext ? { opacity: 0.4, pointerEvents: "none" } : undefined}
            >
              Siguiente
            </button>
          </div>
        )}
      </section>
    </main>
  );
}