import { useNavigate } from "react-router-dom";
import { useCarrito } from "../context/CarritoContext";

/* ======================================================
   Sanitización básica segura
====================================================== */
const sanitizeText = (str) =>
  String(str || "")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .slice(0, 200);

const sanitizeImg = (url) => {
  if (!url) return "/fallback.webp";
  if (!String(url).startsWith("http")) return "/fallback.webp";
  return url.replace(/["'<>]/g, "");
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

  /* ======================================================
     Si está vacío
====================================================== */
  if (carrito.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#2f3035] text-white px-6 text-center">
        <h2 className="text-4xl font-extrabold bg-gradient-to-r from-[#ffd85a] via-[#ff66b3] to-[#42e2b8] bg-clip-text text-transparent mb-4">
          Tu carrito está vacío 🛍️
        </h2>

        <p className="text-white/70 mb-6 max-w-sm">
          Descubrí cientos de productos premium ✨
        </p>

        <button
          onClick={() => navigate("/productos")}
          className="px-8 py-3 bg-gradient-to-r from-[#ff66b3] to-[#ffd85a] text-black font-semibold rounded-full shadow-lg"
        >
          Ver catálogo
        </button>
      </div>
    );
  }

  /* ======================================================
     Carrito lleno (100% local — funciona offline perfecto)
====================================================== */
  return (
    <div className="min-h-screen bg-[#2e2f33] text-white px-6 py-10">
      <style>{`
        .tarjeta {
          background: #ffffff0d;
          border: 1px solid #ffffff22;
          border-radius: 20px;
          padding: 1.5rem;
        }
        .btn-main {
          background: linear-gradient(90deg,#ff66b3,#ffd85a);
          color:#111;
          padding: .8rem 2rem;
          font-weight:600;
          border-radius:9999px;
        }
      `}</style>

      {/* Título */}
      <h2
        className="text-4xl font-extrabold text-center mb-10
        bg-gradient-to-r from-[#ffd85a] via-[#ff66b3] to-[#42e2b8]
        bg-clip-text text-transparent"
      >
        🛒 Tu carrito
      </h2>

      {/* Contenedor */}
      <div className="tarjeta max-w-5xl mx-auto shadow-xl">

        {/* Encabezado */}
        <div className="grid grid-cols-6 text-sm font-semibold text-white/70 mb-3">
          <div className="col-span-3">Producto</div>
          <div className="text-center">Cant.</div>
          <div className="text-center">Precio</div>
          <div className="text-right">Subtotal</div>
        </div>

        {/* ITEMS */}
        {carrito.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-6 items-center py-3 border-b border-white/10"
          >
            {/* Producto + imagen */}
            <div className="col-span-3 flex items-center gap-4">
              <img
                src={sanitizeImg(item.imagen)}
                alt={sanitizeText(item.nombre)}
                className="w-16 h-16 rounded-xl object-cover border border-[#ffd85a]/40"
                onError={(e) => (e.currentTarget.src = "/fallback.webp")}
              />
              <div>
                <p className="font-semibold">{sanitizeText(item.nombre)}</p>
                <button
                  onClick={() => quitarProducto(item.id)}
                  className="text-xs text-[#ff8a7b]"
                >
                  Eliminar
                </button>
              </div>
            </div>

            {/* Cantidad */}
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => eliminarDelCarrito(item.id)}
                className="w-7 h-7 flex justify-center items-center border border-[#ffd85a] text-[#ffd85a] rounded-full"
              >
                −
              </button>

              <span className="font-semibold">{item.cantidad}</span>

              <button
                onClick={() => agregarAlCarrito(item)}
                className="w-7 h-7 flex justify-center items-center border border-[#ffd85a] text-[#ffd85a] rounded-full"
              >
                +
              </button>
            </div>

            {/* Precio unitario */}
            <div className="text-center text-[#ffd85a] font-medium">
              ${item.precio}
            </div>

            {/* Subtotal */}
            <div className="text-right font-bold">
              ${(item.precio * item.cantidad).toFixed(2)}
            </div>
          </div>
        ))}

        {/* Totales */}
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={vaciarCarrito}
            className="text-sm text-[#ffd85a] hover:underline"
          >
            Vaciar carrito
          </button>

          <div className="text-right">
            <p className="text-sm text-white/60">
              Artículos:{" "}
              <span className="font-semibold text-[#ffd85a]">{totalItems}</span>
            </p>

            <p
              className="text-3xl font-extrabold 
              bg-gradient-to-r from-[#ffd85a] via-[#ff66b3] to-[#42e2b8]
              bg-clip-text text-transparent"
            >
              Total: ${totalPrecio.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Botones Finales */}
        <div className="mt-10 flex flex-col sm:flex-row gap-6 justify-center">
          <button onClick={() => navigate("/productos")} className="btn-main">
            Seguir comprando ✨
          </button>

          <button
            disabled={!online}
            onClick={() => online && navigate("/checkout")}
            className={`px-10 py-3 rounded-full font-semibold transition
              ${online
                ? "border-2 border-[#ffd85a] text-[#ffd85a] hover:bg-[#fff8dd]/10"
                : "bg-gray-700 text-gray-400 border-gray-700 cursor-not-allowed"}
  `}
          >
            {online ? "Finalizar compra 💳" : "Sin conexión"}
          </button>

        </div>
      </div>
    </div>
  );
}

