import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCarrito } from "../context/CarritoContext";
import { useToast } from "../context/ToastContext";
import api from "../utils/api";

const clean = (str) => String(str || "").replace(/[<>{}]/g, "").slice(0, 200);

const toNumber = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

const formatMoney = (value) => {
  return toNumber(value).toFixed(2);
};

const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
const validateName = (n) => /^[a-zA-ZÀ-ÿ0-9\s]{3,40}$/.test(n);
const validatePhone = (p) => /^[0-9\s\-\+]{8,20}$/.test(p);
const validateAddress = (d) => String(d || "").trim().length >= 5;

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "541126483009";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

const EMOJI = {
  party: "\u{1F389}",
  box: "\u{1F4E6}",
  user: "\u{1F464}",
  phone: "\u{1F4F1}",
  email: "\u{1F4E7}",
  pin: "\u{1F4CD}",
  card: "\u{1F4B3}",
  bag: "\u{1F6CD}\uFE0F",
  money: "\u{1F4B0}",
  note: "\u{1F4CC}",
  mobile: "\u{1F4F2}",
};

export default function Checkout() {
  const { carrito, totalPrecio, vaciarCarrito, totalItems } = useCarrito();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [processing, setProcessing] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    direccion: "",
    metodoPago: "transferencia",
  });

  useEffect(() => {
    if (!carrito || carrito.length === 0) navigate("/productos", { replace: true });
  }, [carrito, navigate]);

  const total = useMemo(() => Number(totalPrecio || 0), [totalPrecio]);

  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: clean(e.target.value) }));

  const generateWhatsAppMessage = (pedidoId) => {
    const textoMetodoPago =
      formData.metodoPago === "transferencia"
        ? "Transferencia bancaria"
        : formData.metodoPago === "efectivo"
          ? "Efectivo"
          : "Tarjeta";

    const lines = [
      `${EMOJI.party} NUEVO PEDIDO - YOQUET DISEÑOS ${EMOJI.party}`,
      ``,
      `${EMOJI.box} Pedido #${pedidoId || "(pendiente)"}`,
      `${EMOJI.user} Cliente: ${formData.nombre}`,
      `${EMOJI.phone} Telefono: ${formData.telefono}`,
      `${EMOJI.email} Email: ${formData.email}`,
      `${EMOJI.pin} Direccion: ${formData.direccion}`,
      `${EMOJI.card} Pago: ${textoMetodoPago}`,
      ``,
      `${EMOJI.bag} Productos:`,
    ];

    carrito.forEach((item) => {
      const cantidad = Number(item.cantidad) || 1;
      const subtotal = toNumber(item.precio) * cantidad;

      lines.push(
        `- ${item.nombre} x${cantidad} - $${formatMoney(item.precio)} c/u = $${subtotal.toFixed(2)}`
      );
    });

    lines.push(
      ``,
      `${EMOJI.money} Total estimado: $${total.toFixed(2)}`,
      ``,
      `${EMOJI.note} Pedido sujeto a confirmacion de stock.`,
      `${EMOJI.mobile} El pago se coordina por WhatsApp.`
    );

    return lines.join("\n");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (processing) return;

    if (!validateName(formData.nombre))
      return showToast("Nombre inválido (3-40 caracteres)", "error");
    if (!validateEmail(formData.email))
      return showToast("Email inválido", "error");
    if (!validatePhone(formData.telefono))
      return showToast("Teléfono inválido (8-20 dígitos)", "error");
    if (!validateAddress(formData.direccion))
      return showToast("Dirección muy corta (mín. 5 caracteres)", "error");

    setProcessing(true);

    try {
      const response = await api.post(
        "/api/pedido/crear/",
        {
          items: carrito.map((i) => ({ id: i.id, cantidad: Number(i.cantidad) || 1 })),
          total: Number(total),
          ...formData,
        },
        { timeout: 25000 }
      );

      const pedidoId = response.data?.pedido_id;

      showToast("¡Pedido creado con éxito!", "success");

      const message = generateWhatsAppMessage(pedidoId);
      const waUrl = `${WHATSAPP_URL}?text=${encodeURIComponent(message)}`;

      vaciarCarrito();

      window.open(waUrl, "_blank");

      navigate("/empaquetando");
    } catch (err) {
      console.error(err);
      showToast("Error al procesar el pedido. Intentá nuevamente.", "error");
      setProcessing(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-72px)] bg-[var(--bg-secondary)]">
      <section className="container-yoquet pt-6 pb-12">
        {/* Volver */}
        <button
          className="btn-yoquet-ghost mb-4 text-sm inline-flex items-center gap-1"
          onClick={() => navigate("/carrito")}
        >
          ← Volver al carrito
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulario */}
          <div className="lg:col-span-2">
            <div className="card-yoquet p-5 sm:p-7">
              <div className="mb-6">
                <h1 className="text-xl sm:text-2xl font-semibold" style={{ color: "var(--text-primary)" }}>
                  Finalizar compra
                </h1>
                <p className="mt-1.5 text-sm" style={{ color: "var(--text-secondary)" }}>
                  Completá tus datos para recibir el pedido
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Nombre */}
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-primary)" }}>
                    Nombre completo *
                  </label>
                  <input
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    className="input-yoquet text-base"
                    placeholder="Tu nombre completo"
                  />
                </div>

                {/* Email y Teléfono - Responsive grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-primary)" }}>
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="input-yoquet text-base"
                      placeholder="tu@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-primary)" }}>
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      required
                      className="input-yoquet text-base"
                      placeholder="Ej: 11 2345 6789"
                    />
                  </div>
                </div>

                {/* Dirección */}
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-primary)" }}>
                    Dirección de entrega *
                  </label>
                  <input
                    type="text"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                    required
                    className="input-yoquet text-base"
                    placeholder="Calle, número, piso, departamento, ciudad"
                  />
                </div>

                {/* Método de pago */}
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-primary)" }}>
                    Método de pago
                  </label>
                  <select
                    name="metodoPago"
                    value={formData.metodoPago}
                    onChange={handleChange}
                    className="input-yoquet text-base"
                  >
                    <option value="transferencia">Transferencia bancaria</option>
                    <option value="efectivo">Efectivo</option>
                    <option value="tarjeta">Tarjeta</option>
                  </select>
                </div>

                {/* Aviso importante */}
                <div className="card-yoquet bg-[var(--bg-secondary)] border-l-4 border-[var(--color-rosa)] p-4">
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    <span className="font-semibold">📦 Pedido sujeto a confirmación de stock.</span>
                    <br />
                    El pago se coordina por WhatsApp después de enviar tu pedido.
                  </p>
                </div>

                {/* Botón confirmar */}
                <button
                  type="submit"
                  disabled={processing}
                  className="btn-yoquet w-full justify-center mt-4 py-3.5 text-base font-semibold"
                >
                  {processing ? (
                    <span className="inline-flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Procesando…
                    </span>
                  ) : (
                    "Confirmar pedido y enviar por WhatsApp"
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Resumen del pedido */}
          <div className="lg:col-span-1">
            <div className="card-yoquet p-5 sm:p-6 sticky top-6">
              <h2 className="text-base font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
                Resumen del pedido
              </h2>

              {/* Lista de productos */}
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {carrito.map((item) => (
                  <div key={item.id} className="flex justify-between items-start gap-2 text-sm">
                    <div className="flex-1">
                      <p className="font-medium" style={{ color: "var(--text-primary)" }}>
                        {item.nombre}
                      </p>
                      <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                        Cantidad: {item.cantidad} × ${formatMoney(item.precio)}
                      </p>
                    </div>
                    <span className="font-medium whitespace-nowrap" style={{ color: "var(--text-primary)" }}>
                      ${(toNumber(item.precio) * (Number(item.cantidad) || 1)).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="h-px mb-4" style={{ background: "var(--border-soft)" }} />

              {/* Totales */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span style={{ color: "var(--text-secondary)" }}>Artículos ({totalItems})</span>
                  <span className="font-medium" style={{ color: "var(--text-primary)" }}>
                    ${total.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span style={{ color: "var(--text-secondary)" }}>Envío</span>
                  <span className="font-medium" style={{ color: "var(--color-rosa)" }}>
                    A coordinar
                  </span>
                </div>

                <div className="h-px" style={{ background: "var(--border-soft)" }} />

                <div className="flex justify-between pt-2">
                  <span className="font-semibold text-lg" style={{ color: "var(--text-primary)" }}>
                    Total
                  </span>
                  <span className="text-xl font-bold" style={{ color: "var(--color-rosa)" }}>
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="btn-yoquet-ghost w-full mt-6 text-sm"
                onClick={() => navigate("/carrito")}
              >
                Editar carrito
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
