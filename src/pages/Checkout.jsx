import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCarrito } from "../context/CarritoContext";
import { useToast } from "../context/ToastContext";
import api from "../utils/api";

/* =========================================================
   Sanitización y validaciones
========================================================= */
const clean = (str) =>
  String(str || "")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .slice(0, 200);

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

  useEffect(() => {
    if (carrito.length === 0) {
      navigate("/productos");
    }
  }, [carrito, navigate]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: clean(e.target.value) });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (processing) return;

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

  return (
    <>
      {/* =====================================================
          ESTILOS INCRUSTADOS — Yoquet PRO (responsive)
      ===================================================== */}
      <style>
        {`
        /* CONTENEDOR GENERAL */
        .checkout-wrapper {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 2rem 1rem;
          background: #fffaf6;
        }

        .checkout-box {
          width: 100%;
          max-width: 700px;
          background: white;
          padding: 2rem;
          border-radius: 20px;
          box-shadow: 0 8px 25px rgba(0,0,0,0.10);
        }

        /* TITULO */
        .checkout-title {
          font-size: 2rem;
          font-weight: 800;
          text-align: center;
          margin-bottom: 1.5rem;
          background: linear-gradient(90deg, #ff66b3, #ffd85a, #42e2b8);
          -webkit-background-clip: text;
          color: transparent;
        }

        /* FORM GRID */
        .checkout-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.2rem;
        }

        @media (min-width: 768px) {
          .checkout-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        .checkout-grid label {
          font-weight: 600;
          margin-bottom: 3px;
          display: block;
          color: #3d2b1f;
        }

        /* INPUTS */
        .checkout-input {
          width: 100%;
          padding: 0.85rem 1rem;
          border-radius: 12px;
          border: 2px solid #ffd85a;
          background: white;
          color: #3d2b1f;
          font-size: 1rem;
          transition: all 0.2s ease;
        }

        .checkout-input:focus {
          border-color: #ff66b3;
          box-shadow: 0 0 6px rgba(255,102,179,0.35);
          outline: none;
        }

        /* SELECT */
        .checkout-select {
          width: 100%;
          padding: 0.85rem 1rem;
          border-radius: 12px;
          border: 2px solid #ffd85a;
          background: white;
          color: #3d2b1f;
          font-size: 1rem;
        }

        /* SPAN DE DOS COLUMNAS */
        .span-2 {
          grid-column: span 2;
        }

        @media (max-width: 767px) {
          .span-2 {
            grid-column: span 1;
          }
        }

        /* BOTÓN */
        .checkout-btn {
          width: 100%;
          padding: 1rem;
          margin-top: 10px;
          border: none;
          border-radius: 16px;
          font-weight: 700;
          font-size: 1.1rem;
          color: #1b1b1b;
          cursor: pointer;
          background: linear-gradient(90deg, #ff66b3, #ffd85a, #42e2b8);
          transition: transform 0.15s ease, opacity 0.25s ease;
        }

        .checkout-btn:disabled {
          background: #ffd85a;
          opacity: 0.5;
          cursor: not-allowed;
        }

        .checkout-btn:active {
          transform: scale(0.97);
        }
      `}
      </style>

      {/* =====================================================
          UI
      ===================================================== */}
      <div className="checkout-wrapper">
        <div className="checkout-box">
          <h1 className="checkout-title">Finalizá tu compra ✨</h1>

          <form onSubmit={handleSubmit} className="checkout-grid">

            {/* NOMBRE */}
            <div>
              <label>Nombre completo</label>
              <input
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                className="checkout-input"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label>Correo electrónico</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="checkout-input"
              />
            </div>

            {/* DIRECCION */}
            <div className="span-2">
              <label>Dirección</label>
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                required
                className="checkout-input"
              />
            </div>

            {/* MÉTODO DE PAGO */}
            <div className="span-2">
              <label>Método de pago</label>
              <select
                name="metodoPago"
                value={formData.metodoPago}
                onChange={handleChange}
                className="checkout-select"
              >
                <option value="tarjeta">Tarjeta 💳</option>
                <option value="transferencia">Transferencia 🏦</option>
                <option value="efectivo">Efectivo 💵</option>
              </select>
            </div>

            {/* BOTÓN */}
            <button type="submit" disabled={processing} className="checkout-btn span-2">
              {processing ? "Procesando..." : "Confirmar compra ✨"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
