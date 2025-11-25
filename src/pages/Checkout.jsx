import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCarrito } from "../context/CarritoContext";
import { useToast } from "../context/ToastContext";
import api from "../utils/api";   // ✔ USO DEL API GLOBAL

/* =========================================================
   🛡 Sanitización para evitar XSS / HTML injection
========================================================= */
const clean = (str) =>
  String(str || "")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .slice(0, 200);

/* =========================================================
   VALIDACIONES (extra seguridad)
========================================================= */
const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
const validateName = (n) => /^[a-zA-ZÀ-ÿ0-9\s]{3,40}$/.test(n);
const validateAddress = (d) => d.length >= 5;

export default function Checkout() {
  const { carrito, totalPrecio, vaciarCarrito } = useCarrito();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const token = localStorage.getItem("access_token");

  const [processing, setProcessing] = useState(false);

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    direccion: "",
    metodoPago: "tarjeta",
  });

  /* =========================================================
     VALIDACIÓN 1: Si el CARRITO está vacío → volver a productos
     (la verificación de login la hace ProtectedRoute)
========================================================= */
  useEffect(() => {
    if (carrito.length === 0) {
      navigate("/productos");
    }
  }, [carrito, navigate]);

  /* =========================================================
     Handlers
========================================================= */
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: clean(e.target.value) });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (processing) return;

    // 🛡 Validaciones previas
    if (!validateName(formData.nombre))
      return showToast("Nombre inválido", "error");

    if (!validateEmail(formData.email))
      return showToast("Email inválido", "error");

    if (!validateAddress(formData.direccion))
      return showToast("Dirección demasiado corta", "error");

    setProcessing(true);

    try {
      await api.post("/api/pedido/crear/", {
        items: carrito.map((i) => ({
          id: i.id,
          cantidad: Number(i.cantidad) || 1,
        })),
        total: Number(totalPrecio),
        ...formData,
      });

      showToast("Compra realizada con éxito ✨", "success");
      vaciarCarrito();
      navigate("/empaquetando");
    } catch (error) {
      console.error(error);
      showToast("No se pudo procesar el pedido", "error");
    }

    setProcessing(false);
  };

  /* =========================================================
     UI —  ESTILO
========================================================= */
  return (
    <div className="min-h-screen flex justify-center items-center px-6 py-16 bg-[#2f3034]">
      <div className="w-full max-w-3xl bg-white/95 rounded-2xl shadow-xl p-10">

        <h1
          className="text-3xl sm:text-4xl font-extrabold text-center mb-8 
          bg-gradient-to-r from-[#ff66b3] via-[#ffd85a] to-[#42e2b8]
          bg-clip-text text-transparent"
        >
          Finalizá tu compra ✨
        </h1>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* NOMBRE */}
          <div>
            <label className="font-semibold text-sm mb-1 block">
              Nombre completo
            </label>
            <input
              name="nombre"
              required
              value={formData.nombre}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-[#d4c7a9] bg-white rounded-xl"
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="font-semibold text-sm mb-1 block">
              Correo electrónico
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-[#d4c7a9] bg-white rounded-xl"
            />
          </div>

          {/* DIRECCION */}
          <div className="md:col-span-2">
            <label className="font-semibold text-sm mb-1 block">Dirección</label>
            <input
              type="text"
              name="direccion"
              required
              value={formData.direccion}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-[#d4c7a9] bg-white rounded-xl"
            />
          </div>

          {/* METODO PAGO */}
          <div className="md:col-span-2">
            <label className="font-semibold text-sm mb-1 block">
              Método de pago
            </label>
            <select
              name="metodoPago"
              value={formData.metodoPago}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-[#d4c7a9] bg-white rounded-xl"
            >
              <option value="tarjeta">Tarjeta 💳</option>
              <option value="transferencia">Transferencia 🏦</option>
              <option value="efectivo">Efectivo 💵</option>
            </select>
          </div>

          {/* BOTÓN */}
          <button
            type="submit"
            disabled={processing}
            className={`md:col-span-2 py-4 mt-4 rounded-full font-semibold 
              text-[#1b1b1b]
              ${
                processing
                  ? "bg-[#ffd85a]/40"
                  : "bg-gradient-to-r from-[#ff66b3] via-[#ffd85a] to-[#42e2b8]"
              }
              transition-all`}
          >
            {processing ? "Procesando..." : "Confirmar compra ✨"}
          </button>
        </form>
      </div>
    </div>
  );
}
