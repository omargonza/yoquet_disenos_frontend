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
          <div className="card-yoquet p-8 text-center max-w-xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-extrabold" style={{ color: "var(--text)" }}>
              Tu carrito está vacío
            </h1>
            <p className="mt-2 text-sm font-bold" style={{ color: "var(--muted)" }}>
              Sumá productos y volvé acá para finalizar la compra.
            </p>

            <div className="mt-6 flex justify-center">
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
      <section className="container-yoquet pt-8 pb-14">
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
                Tu carrito
              </span>
            </h1>
            <p className="mt-2 text-sm font-bold" style={{ color: "var(--muted)" }}>
              Artículos: {totalItems}
            </p>
          </div>

          <button className="btn-yoquet-ghost" onClick={vaciarCarrito}>
            Vaciar
          </button>
        </div>

        <div className="mt-7 card-yoquet p-4 sm:p-6 overflow-hidden">
          {/* Header tabla */}
          <div className="hidden md:grid grid-cols-6 text-xs font-extrabold pb-3" style={{ color: "var(--muted)" }}>
            <div className="col-span-3">Producto</div>
            <div className="text-center">Cant.</div>
            <div className="text-center">Precio</div>
            <div className="text-right">Subtotal</div>
          </div>

          {/* Items */}
          <div className="divide-y" style={{ borderColor: "var(--border)" }}>
            {carrito.map((item) => (
              <div key={item.id} className="py-4 grid grid-cols-1 md:grid-cols-6 items-center gap-4">
                {/* Producto */}
                <div className="md:col-span-3 flex items-center gap-4">
                  <img
                    src={sanitizeImg(item.imagen)}
                    alt={sanitizeText(item.nombre)}
                    className="w-16 h-16 rounded-2xl object-cover"
                    style={{ border: "1px solid var(--border)" }}
                    loading="lazy"
                    decoding="async"
                    onError={(e) => (e.currentTarget.src = "/fallback.webp")}
                  />

                  <div className="min-w-0">
                    <div className="font-extrabold truncate" style={{ color: "var(--text)" }}>
                      {sanitizeText(item.nombre)}
                    </div>
                    <button
                      onClick={() => quitarProducto(item.id)}
                      className="text-xs font-extrabold mt-1"
                      style={{ color: "rgba(255, 102, 179, 0.95)" }}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>

                {/* Cantidad */}
                <div className="flex items-center justify-start md:justify-center gap-2">
                  <button
                    onClick={() => eliminarDelCarrito(item.id)}
                    className="chip"
                    aria-label="Quitar uno"
                  >
                    −
                  </button>

                  <span className="font-extrabold" style={{ color: "var(--text)" }}>
                    {item.cantidad}
                  </span>

                  <button
                    onClick={() => agregarAlCarrito(item)}
                    className="chip"
                    aria-label="Agregar uno"
                  >
                    +
                  </button>
                </div>

                {/* Precio */}
                <div className="text-left md:text-center font-extrabold" style={{ color: "var(--text)" }}>
                  ${item.precio}
                </div>

                {/* Subtotal */}
                <div className="text-left md:text-right font-extrabold" style={{ color: "var(--text)" }}>
                  ${(item.precio * item.cantidad).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          {/* Totales */}
          <div className="mt-6 flex items-center justify-between flex-wrap gap-4">
            <button className="btn-yoquet-ghost" onClick={() => navigate("/productos")}>
              Seguir comprando
            </button>

            <div className="text-right">
              <div className="text-sm font-extrabold" style={{ color: "var(--muted)" }}>
                Total
              </div>
              <div className="text-3xl font-extrabold" style={{ color: "var(--text)" }}>
                ${totalPrecio.toFixed(2)}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-7 flex justify-center gap-3 flex-wrap">
            <button className="btn-yoquet-ghost" onClick={() => navigate("/productos")}>
              Volver al catálogo
            </button>

            <button
              className={online ? "btn-yoquet" : "btn-yoquet-ghost"}
              disabled={!online}
              onClick={() => online && navigate("/checkout")}
              title={!online ? "Necesitás conexión para finalizar" : "Finalizar compra"}
            >
              {online ? "Finalizar compra" : "Sin conexión"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
