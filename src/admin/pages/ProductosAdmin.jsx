import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { useAdminProductos } from "../../hooks/useAdminProductos";

const safeText = (s) => String(s || "").replace(/[<>]/g, "").slice(0, 120);
const safeImg = (url) => {
  const u = String(url || "");
  if (!u.startsWith("http")) return "/fallback.webp";
  return u.replace(/["'<>]/g, "");
};

export default function ProductosAdmin() {
  const { productos, count, pagina, setPagina, loading, hasNext, hasPrev } = useAdminProductos();


  // UX: filtro local (no pega al backend; liviano)
  const [q, setQ] = useState("");

  const filtrados = useMemo(() => {
    const qq = q.trim().toLowerCase();
    if (!qq) return productos;
    return productos.filter((p) => {
      const n = (p?.nombre || "").toLowerCase();
      const c = (p?.categoria_nombre || "").toLowerCase();
      return n.includes(qq) || c.includes(qq);
    });
  }, [productos, q]);

  // Heurística simple: si la página trae menos de "page_size" desconocido, no sabemos si hay más.
  // Pero sí podemos desactivar "Siguiente" si no hay productos.
  const disableNext = !productos?.length;

  return (
    <main className="min-h-[calc(100vh-72px)]">
      <section className="container-yoquet pt-8 pb-14">
        {/* Header */}
        <div className="card-yoquet p-6 sm:p-7">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <h2 className="text-3xl sm:text-4xl font-extrabold">
                <span
                  style={{
                    background:
                      "linear-gradient(90deg, var(--color-rosa), var(--color-dorado), var(--color-turquesa))",
                    WebkitBackgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  Productos
                </span>
              </h2>

              <p className="mt-1 text-sm font-bold" style={{ color: "var(--muted)" }}>
                Administrá el catálogo. Total: {count ?? 0}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="chip is-active">Página: {pagina}</span>
                <span className="chip">En vista: {filtrados.length}</span>
              </div>
            </div>

            {/* Buscador */}
            <div className="w-full md:w-auto">
              <div
                className="flex items-center gap-2 px-4 py-3 rounded-2xl"
                style={{
                  background: "rgba(255,255,255,0.85)",
                  border: "1px solid rgba(61,43,31,0.12)",
                }}
              >
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Buscar por nombre o categoría…"
                  className="outline-none bg-transparent text-sm w-full md:w-72"
                  style={{ color: "var(--text)" }}
                />
                {q && (
                  <button className="chip" onClick={() => setQ("")} title="Limpiar búsqueda">
                    Limpiar
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="mt-6 card-yoquet p-4 sm:p-6">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="p-3 rounded-3xl" style={{ border: "1px solid var(--border)" }}>
                  <div className="skeleton h-40 w-full rounded-2xl" />
                  <div className="skeleton h-4 w-3/4 mt-3" />
                  <div className="skeleton h-4 w-1/2 mt-2" />
                </div>
              ))}
            </div>
          ) : filtrados.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-lg font-extrabold" style={{ color: "var(--text)" }}>
                No hay productos para mostrar
              </div>
              <p className="mt-1 text-sm font-bold" style={{ color: "var(--muted)" }}>
                Probá cambiar la búsqueda o revisar la API.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {filtrados.map((prod) => (
                <Link
                  key={prod.id}
                  to={`/admin/producto/${prod.id}`}
                  className="group rounded-3xl p-3"
                  style={{
                    background: "rgba(255,255,255,0.70)",
                    border: "1px solid var(--border)",
                    transition: "transform .15s ease, box-shadow .15s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0px)")}
                >
                  <img
                    src={safeImg(prod.imagen)}
                    alt={safeText(prod.nombre)}
                    className="w-full h-40 object-cover rounded-2xl"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => (e.currentTarget.src = "/fallback.webp")}
                    style={{ border: "1px solid rgba(61,43,31,0.10)" }}
                  />
                  <h3 className="mt-2 font-extrabold" style={{ color: "var(--text)" }}>
                    {safeText(prod.nombre)}
                  </h3>
                  <p className="text-xs font-bold" style={{ color: "var(--muted)" }}>
                    {safeText(prod.categoria_nombre)}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Paginación */}
        <div className="mt-6 flex items-center justify-between gap-3 flex-wrap">
          <button
            onClick={() => setPagina(pagina - 1)}
            disabled={!hasPrev || loading}
            className="btn-yoquet-ghost"
            style={{ opacity: !hasPrev || loading ? 0.55 : 1 }}
          >
            Anterior
          </button>

          <button
            onClick={() => setPagina(pagina + 1)}
            disabled={!hasNext || loading}
            className="btn-yoquet"
            style={{ opacity: !hasNext || loading ? 0.55 : 1 }}
          >
            Siguiente
          </button>

        </div>
      </section>
    </main>
  );
}
