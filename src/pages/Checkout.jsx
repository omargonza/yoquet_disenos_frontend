import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCarrito } from "../context/CarritoContext";
import { useToast } from "../context/ToastContext";
import api from "../utils/api";

const clean = (str) => String(str || "").replace(/[<>{}]/g, "").slice(0, 200);

const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
const validateName = (n) => /^[a-zA-ZÀ-ÿ0-9\s]{3,40}$/.test(n);
const validateAddress = (d) => String(d || "").trim().length >= 5;

export default function Checkout() {
  const { carrito, totalPrecio, vaciarCarrito, totalItems } = useCarrito();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [processing, setProcessing] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    direccion: "",
    metodoPago: "tarjeta",
  });

  useEffect(() => {
    if (!carrito || carrito.length === 0) navigate("/productos", { replace: true });
  }, [carrito, navigate]);

  const total = useMemo(() => Number(totalPrecio || 0), [totalPrecio]);

  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: clean(e.target.value) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (processing) return;

    if (!validateName(formData.nombre)) return showToast("Nombre inválido", "error");
    if (!validateEmail(formData.email)) return showToast("Email inválido", "error");
    if (!validateAddress(formData.direccion)) return showToast("Dirección demasiado corta", "error");

    setProcessing(true);

    try {
      await api.post(
        "/api/pedido/crear/",
        {
          items: carrito.map((i) => ({ id: i.id, cantidad: Number(i.cantidad) || 1 })),
          total: Number(total),
          ...formData,
        },
        { timeout: 25000 }
      );

      showToast("Compra realizada con éxito", "success");
      vaciarCarrito();
      navigate("/empaquetando");
    } catch (err) {
      console.error(err);
      showToast("No se pudo procesar el pedido", "error");
      setProcessing(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-72px)]">
      <section className="container-yoquet pt-8 pb-14">
        <div className="flex items-center justify-between gap-3">
          <button className="btn-yoquet-ghost" onClick={() => navigate("/carrito")}>
            ← Volver al carrito
          </button>
          <button className="btn-yoquet-ghost" onClick={() => navigate("/productos")}>
            Seguir comprando
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* FORM */}
          <div className="lg:col-span-2 card-yoquet p-5 sm:p-7">
            <h1 className="text-3xl sm:text-4xl text-center">
              <span
                style={{
                  background:
                    "linear-gradient(90deg, var(--color-rosa), var(--color-dorado), var(--color-turquesa))",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                }}
              >
                Finalizá tu compra
              </span>
            </h1>
            <p className="mt-2 text-center text-sm" style={{ color: "var(--muted)", fontWeight: 700 }}>
              Completá tus datos y confirmá. Es rápido.
            </p>

            <form onSubmit={handleSubmit} className="mt-7 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-extrabold mb-1" style={{ color: "var(--text)" }}>
                  Nombre completo
                </label>
                <input
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-2xl outline-none"
                  style={{
                    background: "rgba(255,255,255,0.82)",
                    border: "1px solid rgba(61,43,31,0.12)",
                    color: "var(--text)",
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-extrabold mb-1" style={{ color: "var(--text)" }}>
                  Correo electrónico
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-2xl outline-none"
                  style={{
                    background: "rgba(255,255,255,0.82)",
                    border: "1px solid rgba(61,43,31,0.12)",
                    color: "var(--text)",
                  }}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-extrabold mb-1" style={{ color: "var(--text)" }}>
                  Dirección
                </label>
                <input
                  type="text"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-2xl outline-none"
                  style={{
                    background: "rgba(255,255,255,0.82)",
                    border: "1px solid rgba(61,43,31,0.12)",
                    color: "var(--text)",
                  }}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-extrabold mb-1" style={{ color: "var(--text)" }}>
                  Método de pago
                </label>
                <select
                  name="metodoPago"
                  value={formData.metodoPago}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-2xl outline-none"
                  style={{
                    background: "rgba(255,255,255,0.82)",
                    border: "1px solid rgba(61,43,31,0.12)",
                    color: "var(--text)",
                  }}
                >
                  <option value="tarjeta">Tarjeta 💳</option>
                  <option value="transferencia">Transferencia 🏦</option>
                  <option value="efectivo">Efectivo 💵</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={processing}
                className="btn-yoquet md:col-span-2"
                style={{
                  paddingTop: "1rem",
                  paddingBottom: "1rem",
                  opacity: processing ? 0.75 : 1,
                  pointerEvents: processing ? "none" : "auto",
                }}
              >
                {processing ? "Procesando…" : "Confirmar compra"}
              </button>

              <div className="md:col-span-2 text-center text-xs" style={{ color: "var(--muted)" }}>
                Al confirmar, se genera tu pedido y te redirigimos a “Empaquetando”.
              </div>
            </form>
          </div>

          {/* RESUMEN */}
          <aside className="card-yoquet p-5 sm:p-6 h-fit">
            <div className="text-sm font-extrabold" style={{ color: "var(--muted)" }}>
              Resumen
            </div>

            <div className="mt-3 flex items-center justify-between">
              <div className="text-sm font-extrabold" style={{ color: "var(--text)" }}>
                Artículos
              </div>
              <div className="text-sm font-extrabold" style={{ color: "var(--text)" }}>
                {totalItems}
              </div>
            </div>

            <div className="mt-2 flex items-center justify-between">
              <div className="text-sm font-extrabold" style={{ color: "var(--text)" }}>
                Total
              </div>
              <div className="text-2xl font-extrabold" style={{ color: "var(--color-rosa)" }}>
                ${total.toFixed(2)}
              </div>
            </div>

            <div
              className="mt-4 p-4 rounded-3xl text-xs font-bold"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,102,179,0.10), rgba(255,216,90,0.10), rgba(66,226,184,0.10))",
                border: "1px solid rgba(61,43,31,0.10)",
                color: "var(--muted)",
              }}
            >
              Tip: revisá el carrito antes de confirmar para evitar duplicados.
            </div>

            <button className="btn-yoquet-ghost w-full mt-5" onClick={() => navigate("/carrito")}>
              Editar carrito
            </button>
          </aside>
        </div>
      </section>
    </main>
  );
}
