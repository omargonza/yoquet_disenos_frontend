import { useNavigate } from "react-router-dom";
import { useCarrito } from "../context/CarritoContext";

const sanitizeText = (str) =>
  String(str || "").replace(/</g, "&lt;").replace(/>/g, "&gt;").slice(0, 200);

const sanitizeImg = (url) => {
  if (!url) return "/fallback.webp";
  if (!String(url).startsWith("http")) return "/fallback.webp";
  return String(url).replace(/["'<>]/g, "");
};

export default function Carrito() {
  const {
    carrito,
    agregarAlCarrito,
    eliminarDelCarrito,
    quitarProducto,
    vaciarCarrito,
    totalItems,
    totalPrecio,
  } = useCarrito();

  const online = navigator.onLine;
  const navigate = useNavigate();

  if (carrito.length === 0) {
    return (
      <main className="min-h-[calc(100vh-72px)]">
        <section className="container-yoquet pt-10 pb-14">
          <div className="card-yoquet p-8 sm:p-10 text-center max-w-md mx-auto">
            <h1 className="text-2xl sm:text-3xl font-semibold" style={{ color: "var(--text-primary)" }}>
              Tu carrito está vacío
            </h1>
            <p className="mt-3 text-sm" style={{ color: "var(--text-secondary)" }}>
              Agregá productos para continuar con tu compra.
            </p>

            <div className="mt-8">
              <button className="btn-yoquet" onClick={() => navigate("/productos")}>
                Ver catálogo
              </button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-72px)]">
      <section className="container-yoquet pt-6 pb-12">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold" style={{ color: "var(--text-primary)" }}>
              Tu carrito
            </h1>
            <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
              {totalItems} {totalItems === 1 ? 'artículo' : 'artículos'}
            </p>
          </div>

          <button 
            className="text-sm font-medium px-3 py-1.5 rounded-lg transition-colors hover:bg-red-50" 
            style={{ color: "#dc2626" }}
            onClick={vaciarCarrito}
          >
            Vaciar
          </button>
        </div>

        {/* Lista de items */}
        <div className="card-yoquet overflow-hidden divide-y" style={{ borderColor: "var(--border-soft)" }}>
          {carrito.map((item) => (
            <div key={item.id} className="p-4 flex gap-4">
              {/* Imagen */}
              <button
                onClick={() => navigate(`/productos/${item.id}`)}
                className="shrink-0"
              >
                <img
                  src={sanitizeImg(item.imagen)}
                  alt={sanitizeText(item.nombre)}
                  className="w-20 h-20 rounded-lg object-cover"
                  loading="lazy"
                  onError={(e) => (e.currentTarget.src = "/fallback.webp")}
                />
              </button>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <button
                  onClick={() => navigate(`/productos/${item.id}`)}
                  className="text-left"
                >
                  <div className="font-medium text-sm truncate" style={{ color: "var(--text-primary)" }}>
                    {sanitizeText(item.nombre)}
                  </div>
                </button>

                <div className="mt-2 flex items-center justify-between gap-3">
                  {/* Controles de cantidad */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => eliminarDelCarrito(item.id)}
                      className="w-7 h-7 rounded-md flex items-center justify-center text-sm font-medium"
                      style={{ 
                        background: "var(--surface)", 
                        border: "1px solid var(--border-soft)",
                        color: "var(--text-secondary)"
                      }}
                    >
                      −
                    </button>

                    <span className="font-medium text-sm w-6 text-center" style={{ color: "var(--text-primary)" }}>
                      {item.cantidad}
                    </span>

                    <button
                      onClick={() => agregarAlCarrito(item)}
                      className="w-7 h-7 rounded-md flex items-center justify-center text-sm font-medium"
                      style={{ 
                        background: "var(--surface)", 
                        border: "1px solid var(--border-soft)",
                        color: "var(--text-secondary)"
                      }}
                    >
                      +
                    </button>
                  </div>

                  {/* Precio */}
                  <div className="text-right">
                    <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                      ${(item.precio * item.cantidad).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Eliminar */}
              <button
                onClick={() => quitarProducto(item.id)}
                className="shrink-0 self-start text-xs font-medium"
                style={{ color: "var(--text-secondary)" }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Total y acciones */}
        <div className="mt-6 space-y-4">
          {/* Total */}
          <div className="flex items-center justify-between">
            <span className="text-base" style={{ color: "var(--text-secondary)" }}>
              Total
            </span>
            <span className="text-2xl font-semibold" style={{ color: "var(--text-primary)" }}>
              ${totalPrecio.toFixed(2)}
            </span>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              className="btn-yoquet-ghost flex-1 justify-center" 
              onClick={() => navigate("/productos")}
            >
              Agregar más
            </button>
            <button 
              className="btn-yoquet flex-1 justify-center" 
              disabled={!online}
              onClick={() => online && navigate("/checkout")}
            >
              {online ? "Continuar" : "Sin conexión"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}