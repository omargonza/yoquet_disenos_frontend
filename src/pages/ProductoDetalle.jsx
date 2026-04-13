import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useCarrito } from "../context/CarritoContext";

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
  const [offline, setOffline] = useState(!navigator.onLine);
  const [error, setError] = useState("");
  const [agregado, setAgregado] = useState(false);

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

  useEffect(() => {
    let mounted = true;
    const cacheKey = `prod_${id}`;

    const cached = localStorage.getItem(cacheKey);
    if (cached) setProducto(JSON.parse(cached));

    api
      .get(`/api/productos/${id}/`, { timeout: 20000 })
      .then((res) => {
        if (!mounted) return;
        setProducto(res.data);
        localStorage.setItem(cacheKey, JSON.stringify(res.data));
      })
      .catch(() => {
        if (!cached) setError("Producto no disponible");
      });

    return () => (mounted = false);
  }, [id]);

  const handleAdd = useCallback(() => {
    if (!producto) return;
    agregarAlCarrito(producto);
    setAgregado(true);
    setTimeout(() => setAgregado(false), 1500);
  }, [producto, agregarAlCarrito]);

  if (error) {
    return (
      <main className="min-h-[calc(100vh-72px)]">
        <section className="container-yoquet py-10">
          <div className="card-yoquet p-6">
            <p className="font-semibold" style={{ color: "var(--text-secondary)" }}>
              {error}
            </p>
            <button className="btn-yoquet-ghost mt-4" onClick={() => navigate("/productos")}>
              Volver al catálogo
            </button>
          </div>
        </section>
      </main>
    );
  }

  if (!producto) {
    return (
      <main className="min-h-[calc(100vh-72px)]">
        <section className="container-yoquet py-10">
          <div className="card-yoquet p-6">
            <div className="skeleton h-6 w-56" />
            <div className="skeleton h-4 w-full mt-3 max-w-md" />
            <div className="skeleton h-10 w-32 mt-6 rounded-lg" />
          </div>
        </section>
      </main>
    );
  }

  const imgSrc = sanitizeImg(producto.imagen);

  return (
    <main className="min-h-[calc(100vh-72px)]">
      <section className="container-yoquet pt-6 pb-12">
        {/* Botón volver */}
        <button 
          onClick={() => navigate("/productos")} 
          className="btn-yoquet-ghost mb-4 text-sm"
        >
          ← Volver al catálogo
        </button>

        <div className="card-yoquet overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Imagen - protagonista */}
            <div className="bg-white flex items-center justify-center" style={{ background: "var(--surface-soft)" }}>
              <img
                src={imgSrc}
                alt={sanitizeText(producto.nombre)}
                className="w-full h-[300px] md:h-[500px] object-cover"
                loading="eager"
                decoding="async"
                onError={(e) => (e.currentTarget.src = "/fallback.webp")}
              />
            </div>

            {/* Info - limpio y estructurado */}
            <div className="p-6 sm:p-8 flex flex-col">
              {offline && (
                <div 
                  className="inline-block text-xs font-medium mb-4 px-2 py-1 rounded" 
                  style={{ 
                    background: "var(--surface-soft)", 
                    color: "var(--text-secondary)",
                    width: "fit-content"
                  }}
                >
                  Modo offline
                </div>
              )}

              {/* Categoría */}
              <div className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--text-secondary)" }}>
                {sanitizeText(producto.categoria?.nombre || "Producto")}
              </div>

              {/* Título */}
              <h1 className="text-2xl sm:text-3xl font-semibold mt-1" style={{ color: "var(--text-primary)" }}>
                {sanitizeText(producto.nombre)}
              </h1>

              {/* Descripción */}
              <p className="mt-4 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {sanitizeText(producto.descripcion)}
              </p>

              <div className="flex-1" />

              {/* Precio y CTA */}
              <div className="mt-6 space-y-4">
                <div className="text-3xl font-semibold" style={{ color: "var(--text-primary)" }}>
                  ${producto.precio}
                </div>

                <button 
                  className="btn-yoquet w-full justify-center" 
                  disabled={agregado} 
                  onClick={handleAdd}
                >
                  {agregado ? "Agregado ✓" : "Agregar al carrito"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}