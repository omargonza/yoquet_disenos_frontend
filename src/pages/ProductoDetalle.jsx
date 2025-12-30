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
        if (!cached) setError("Sin conexión. Producto no disponible.");
      });

    return () => (mounted = false);
  }, [id]);

  const handleAdd = useCallback(() => {
    if (!producto) return;
    agregarAlCarrito(producto);
    setAgregado(true);
    setTimeout(() => setAgregado(false), 900);
  }, [producto, agregarAlCarrito]);

  if (error) {
    return (
      <div className="container-yoquet py-12">
        <div className="card-yoquet p-6">
          <p className="font-extrabold" style={{ color: "var(--text)" }}>
            {error}
          </p>
          <button className="btn-yoquet-ghost mt-5" onClick={() => navigate("/productos")}>
            Volver al catálogo
          </button>
        </div>
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="container-yoquet py-12">
        <div className="card-yoquet p-6">
          <div className="skeleton h-7 w-56" />
          <div className="skeleton h-4 w-72 mt-3" />
          <div className="skeleton h-10 w-40 mt-6 rounded-full" />
        </div>
      </div>
    );
  }

  const imgSrc = sanitizeImg(producto.imagen);

  return (
    <main className="min-h-[calc(100vh-72px)]">
      <section className="container-yoquet pt-8 pb-12">
        <div className="card-yoquet overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Imagen */}
            <div className="bg-white">
              <img
                src={imgSrc}
                alt={sanitizeText(producto.nombre)}
                className="w-full h-[360px] md:h-full object-cover"
                loading="eager"
                decoding="async"
                onError={(e) => (e.currentTarget.src = "/fallback.webp")}
              />
            </div>

            {/* Info */}
            <div className="p-6 sm:p-8">
              {offline && (
                <div className="text-xs font-extrabold mb-3" style={{ color: "var(--muted)" }}>
                  Modo offline — datos desde caché
                </div>
              )}

              <h1 className="text-3xl sm:text-4xl font-extrabold" style={{ color: "var(--text)" }}>
                <span
                  style={{
                    background:
                      "linear-gradient(90deg, var(--color-rosa), var(--color-dorado), var(--color-turquesa))",
                    WebkitBackgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  {sanitizeText(producto.nombre)}
                </span>
              </h1>

              <p className="mt-2 text-sm font-bold" style={{ color: "var(--muted)" }}>
                {sanitizeText(producto.categoria?.nombre || "Sin categoría")}
              </p>

              <p className="mt-4 text-sm leading-relaxed" style={{ color: "var(--text)", fontWeight: 600, opacity: 0.9 }}>
                {sanitizeText(producto.descripcion)}
              </p>

              <div className="mt-6 flex items-center justify-between gap-4 flex-wrap">
                <div className="text-3xl font-extrabold" style={{ color: "var(--text)" }}>
                  ${producto.precio}
                </div>

                <button className="btn-yoquet" disabled={agregado} onClick={handleAdd}>
                  {agregado ? "Agregado ✔" : "Agregar al carrito"}
                </button>
              </div>

              <div className="mt-7 flex gap-3 flex-wrap">
                <button className="btn-yoquet-ghost" onClick={() => navigate("/productos")}>
                  ← Volver
                </button>
                <button className="btn-yoquet-ghost" onClick={() => navigate("/carrito")}>
                  Ir al carrito
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
