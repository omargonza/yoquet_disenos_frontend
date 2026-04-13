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
    metodoPago: "transferencia",
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
    if (!validateAddress(formData.direccion)) return showToast("Dirección muy corta", "error");

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

      showToast("Pedido creado", "success");
      vaciarCarrito();
      navigate("/empaquetando");
    } catch (err) {
      console.error(err);
      showToast("Error al procesar pedido", "error");
      setProcessing(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-72px)]">
      <section className="container-yoquet pt-6 pb-12">
        {/* Volver */}
        <button 
          className="btn-yoquet-ghost mb-4 text-sm" 
          onClick={() => navigate("/carrito")}
        >
          ← Volver
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulario */}
          <div className="lg:col-span-2 card-yoquet p-5 sm:p-7">
            <h1 className="text-xl sm:text-2xl font-semibold" style={{ color: "var(--text-primary)" }}>
              Completá tus datos
            </h1>
            <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
              Para finalizar tu compra
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-primary)" }}>
                  Nombre completo
                </label>
                <input
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  className="input-yoquet"
                  placeholder="Tu nombre"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-primary)" }}>
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="input-yoquet"
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-primary)" }}>
                  Dirección de entrega
                </label>
                <input
                  type="text"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  required
                  className="input-yoquet"
                  placeholder="Dirección"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-primary)" }}>
                  Método de pago
                </label>
                <select
                  name="metodoPago"
                  value={formData.metodoPago}
                  onChange={handleChange}
                  className="input-yoquet"
                >
                  <option value="transferencia">Transferencia bancaria</option>
                  <option value="efectivo">Efectivo</option>
                  <option value="tarjeta">Tarjeta</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={processing}
                className="btn-yoquet w-full justify-center mt-4"
              >
                {processing ? "Procesando…" : "Confirmar pedido"}
              </button>
            </form>
          </div>

          {/* Resumen */}
          <div className="card-yoquet p-5 sm:p-6 h-fit">
            <h2 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
              Resumen
            </h2>

            <div className="mt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span style={{ color: "var(--text-secondary)" }}>Artículos</span>
                <span className="font-medium" style={{ color: "var(--text-primary)" }}>{totalItems}</span>
              </div>
              
              <div className="h-px" style={{ background: "var(--border-soft)" }} />
              
              <div className="flex justify-between">
                <span className="font-medium" style={{ color: "var(--text-primary)" }}>Total</span>
                <span className="text-xl font-semibold" style={{ color: "var(--color-rosa)" }}>
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            <button 
              className="btn-yoquet-ghost w-full mt-6" 
              onClick={() => navigate("/carrito")}
            >
              Editar carrito
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}