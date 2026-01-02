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

// (lo dejo por si lo seguís usando en otras partes)
const cloudThumb = (url, w = 600) => {
  const clean = sanitizeImg(url);
  if (!clean.startsWith("http")) return clean;
  if (!clean.includes("/image/upload/")) return clean;
  return clean.replace("/image/upload/", `/image/upload/f_auto,q_auto,w_${w},c_fill/`);
};

/* Cache en memoria (solo sesión) */
const pageCache = new Map(); // key: `${page}|${catId}|${q}|${pageSize}` -> payload

/* Cache de imágenes rotas (sesión) */
const brokenImageIds = new Set();

const getSafeImage = (url, id) => {
  if (!url || brokenImageIds.has(id)) return "/fallback.webp";
  return url;
};

export default function Productos() {
  const navigate = useNavigate();
  const location = useLocation();

  const { agregarAlCarrito } = useCarrito();
  const { showToast } = useToast();

  const [data, setData] = useState({ results: [], next: null, previous: null, count: 0 });
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(!navigator.onLine);

  // pageSize dinámico
  const [pageSize, setPageSize] = useState(() => computePageSize());

  // Para invalidar requests viejas
  const reqIdRef = useRef(0);

  function computePageSize() {
    const w = window.innerWidth;
    if (w < 640) return 12;
    if (w < 1024) return 16;
    return 24;
  }

  // ✅ cat desde URL
  const catParamId = useMemo(() => {
    const sp = new URLSearchParams(location.search);
    const v = sp.get("cat");
    return v ? Number(v) : null;
  }, [location.search]);

  // ✅ q desde URL
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

  // ✅ Resize => recalcular pageSize + reset page
  useEffect(() => {
    let t = null;

    const onResize = () => {
      // debounce corto
      if (t) clearTimeout(t);
      t = setTimeout(() => {
        const next = computePageSize();
        setPageSize((prev) => (prev === next ? prev : next));
        setPage(1);
        reqIdRef.current += 1; // invalida requests viejas
      }, 200);
    };

    window.addEventListener("resize", onResize);
    return () => {
      if (t) clearTimeout(t);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // ✅ al cambiar categoría o búsqueda, resetea page e invalida requests viejas
  useEffect(() => {
    setPage(1);
    reqIdRef.current += 1;
  }, [catParamId, qParam]);

  const fetchPage = useCallback(
    async (p, { prefetch = false } = {}) => {
      const catIdForFetch = catParamId || "";
      const qForFetch = qParam || "";
      const key = `${p}|${catIdForFetch}|${qForFetch}|${pageSize}`;

      // 1) cache memoria
      if (pageCache.has(key)) {
        const cached = pageCache.get(key);
        if (!prefetch) setData(cached);
        return cached;
      }

      // 2) cache localStorage
      const lsKey = `cache_prod_page_${key}`;
      const cachedLS = localStorage.getItem(lsKey);
      if (cachedLS) {
        try {
          const parsed = JSON.parse(cachedLS);
          pageCache.set(key, parsed);
          if (!prefetch) setData(parsed);
          return parsed;
        } catch {
          // noop
        }
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

        // si llegó una respuesta vieja, la ignoramos
        if (!prefetch && myReqId !== reqIdRef.current) return null;

        const payload = {
          results: Array.isArray(res.data.results) ? res.data.results : [],
          next: res.data.next || null,
          previous: res.data.previous || null,
          count: Number(res.data.count || 0),
        };

        pageCache.set(key, payload);

        // persistencia diferida (no bloquear)
        const persist = () => {
          try {
            localStorage.setItem(lsKey, JSON.stringify(payload));
          } catch {}
        };

        if (!prefetch) {
          if ("requestIdleCallback" in window) requestIdleCallback(persist, { timeout: 1500 });
          else setTimeout(persist, 800);
        }

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

  // Fetch principal + prefetch
  useEffect(() => {
    let mounted = true;

    (async () => {
      const res = await fetchPage(page);
      if (!mounted || !res) return;

      if (res.next && navigator.onLine) {
        const cb = () => fetchPage(page + 1, { prefetch: true });
        if ("requestIdleCallback" in window) requestIdleCallback(cb, { timeout: 1500 });
        else setTimeout(cb, 900);
      }
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

      <section className="container-yoquet pt-6 pb-12">
        {/* Micro-hero */}
        <div
          className="rounded-3xl p-4"
          style={{
            border: "1px solid var(--border)",
            background:
              "radial-gradient(520px 240px at 20% 0%, rgba(255,102,179,0.18), transparent 55%)," +
              "radial-gradient(460px 220px at 80% 10%, rgba(66,226,184,0.18), transparent 55%)," +
              "radial-gradient(420px 220px at 40% 100%, rgba(255,216,90,0.16), transparent 60%)," +
              "rgba(255,255,255,0.66)",
            backdropFilter: "blur(6px) saturate(140%)",
          }}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <div
                className="text-[11px] font-extrabold tracking-wide uppercase"
                style={{ color: "var(--muted)" }}
              >
                Yoquet Diseños · artesanal & festivo
              </div>

              <h2 className="mt-1 text-xl font-extrabold" style={{ color: "var(--text)" }}>
                Catálogo para celebrar con estilo
              </h2>

              <p className="mt-2 text-sm font-bold leading-snug" style={{ color: "var(--muted)" }}>
                Piezas listas para regalar, decorar y sorprender. Coloridas y premium, sin perder
                calidez.
              </p>
            </div>

            <div className="shrink-0">
              <div
                className="rounded-2xl px-3 py-2 text-xs font-extrabold"
                style={{
                  background: "rgba(255,255,255,0.75)",
                  border: "1px solid var(--border)",
                  color: "var(--text)",
                }}
                title="Cantidad total de productos (según backend)"
              >
                {data.count} items
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
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
                  title="Quitar filtro de categoría"
                >
                  Ver todo
                </button>
              </>
            ) : (
              <span className="chip is-active">Explorá por categorías arriba</span>
            )}

            {qParam ? (
              <span
                className="chip"
                title="Búsqueda activa"
                style={{
                  background: "rgba(255,255,255,0.80)",
                  border: "1px solid var(--border)",
                }}
              >
                Buscando: {sanitizeText(qParam)}
              </span>
            ) : null}

            {qParam ? (
              <button
                type="button"
                className="chip"
                onClick={() => setQueryParam("q", null)}
                title="Limpiar búsqueda"
              >
                Limpiar
              </button>
            ) : null}

            <div className="flex-1" />

            <div className="flex gap-2 overflow-x-auto scrollbar-none">
              {["Cumples", "Souvenirs", "Navidad", "Deco"].map((t) => (
                <button
                  key={t}
                  type="button"
                  className="chip"
                  onClick={() => setQueryParam("q", t)}
                  title={`Buscar: ${t}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid */}
        <div
          className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          style={{ animation: "yqFadeIn .22s ease" }}
        >
          {loading
            ? skeletonItems.map((_, i) => (
                <div key={i} className="card-yoquet overflow-hidden">
                  <div className="skeleton h-56 w-full" />
                  <div className="p-4">
                    <div className="skeleton h-6 w-3/4" />
                    <div className="skeleton h-4 w-full mt-3" />
                    <div className="skeleton h-4 w-2/3 mt-2" />
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <div className="skeleton h-7 w-24" />
                      <div className="skeleton h-10 w-28 rounded-full" />
                    </div>
                  </div>
                </div>
              ))
            : productos.map((p, i) => {
                const isNuevo = Number(p.id) > 120;
                const isPremium = Number(p.precio) >= 15000;

                const safeUrl = getSafeImage(p.imagen, p.id);

                const imgSrc = optimizeImage(safeUrl, { w: 600, h: 448, crop: "fill" });
                const blurSrc = optimizeImage(safeUrl, { w: 40, h: 30, quality: 20 });

                // ✅ eager real: primeras 4 cards renderizadas de la primera página
                const eager = page === 1 && i < 4;

                return (
                  <article
                    key={p.id}
                    className="card-yoquet overflow-hidden cursor-pointer relative"
                    onClick={() => navigate(`/productos/${p.id}`)}
                  >
                    <div className="absolute top-3 left-3 flex gap-2 z-10">
                      {isNuevo && (
                        <span
                          className="px-2 py-1 rounded-full text-[11px] font-extrabold"
                          style={{
                            background: "linear-gradient(135deg, var(--color-rosa), #ff1d8e)",
                            color: "white",
                            border: "1px solid rgba(255,255,255,0.60)",
                            boxShadow: "0 10px 28px rgba(0,0,0,0.10)",
                          }}
                        >
                          Nuevo
                        </span>
                      )}
                      {isPremium && (
                        <span
                          className="px-2 py-1 rounded-full text-[11px] font-extrabold"
                          style={{
                            background: "rgba(255,255,255,0.86)",
                            color: "var(--text)",
                            border: "1px solid var(--border)",
                            boxShadow: "0 10px 28px rgba(0,0,0,0.08)",
                          }}
                        >
                          Premium
                        </span>
                      )}
                    </div>

                    <SmartImage
                      src={imgSrc}
                      blur={blurSrc}
                      alt={sanitizeText(p.nombre)}
                      eager={eager}
                      className="w-full h-56"
                      fallback="/fallback.webp"
                      onError={() => brokenImageIds.add(p.id)}
                    />

                    <div className="p-4">
                      <h3
                        className="font-extrabold text-lg truncate"
                        style={{ color: "var(--text)" }}
                      >
                        {sanitizeText(p.nombre)}
                      </h3>

                      <p
                        className="text-sm mt-1 line-clamp-2"
                        style={{ color: "var(--muted)", fontWeight: 700 }}
                      >
                        {sanitizeText(p.descripcion)}
                      </p>

                      <div className="mt-4 flex items-center justify-between gap-3">
                        <div className="text-xl font-extrabold" style={{ color: "var(--text)" }}>
                          ${p.precio}
                        </div>

                        <button
                          type="button"
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
                );
              })}
        </div>

        {/* Paginación */}
        <div className="mt-10 flex items-center justify-center gap-3">
          <button
            type="button"
            className="btn-yoquet-ghost"
            disabled={!hasPrev}
            onClick={() => hasPrev && setPage((x) => Math.max(1, x - 1))}
            style={!hasPrev ? { opacity: 0.55, pointerEvents: "none" } : undefined}
          >
            Anterior
          </button>

          <div className="text-sm font-extrabold" style={{ color: "var(--muted)" }}>
            Página {page}
          </div>

          <button
            type="button"
            className="btn-yoquet-ghost"
            disabled={!hasNext}
            onClick={() => hasNext && setPage((x) => x + 1)}
            style={!hasNext ? { opacity: 0.55, pointerEvents: "none" } : undefined}
          >
            Siguiente
          </button>
        </div>
      </section>

      <style>{`
        @keyframes yqFadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
}
