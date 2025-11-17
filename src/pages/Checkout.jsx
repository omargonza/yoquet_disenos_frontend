import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCarrito } from "../context/CarritoContext";
import { useToast } from "../context/ToastContext";
import axios from "axios";

export default function Checkout() {
  const { carrito, totalPrecio, vaciarCarrito } = useCarrito();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const backendURL =
    import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000";

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    direccion: "",
    metodoPago: "tarjeta",
  });

  const [processing, setProcessing] = useState(false);

  const token = localStorage.getItem("access_token");

  // ⛔ SI NO ESTÁ LOGUEADO → REDIRIGE A LOGIN
  useEffect(() => {
    if (!token) {
      showToast("Debés iniciar sesión para finalizar la compra", "error");
      navigate("/login", { state: { fromCheckout: true } });
      return;
    }

    if (carrito.length === 0) {
      navigate("/productos");
      return;
    }
  }, [carrito, token, navigate, showToast]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🚨 Si no hay token, no permitimos continuar
    if (!token) {
      showToast("Debés iniciar sesión para confirmar la compra", "error");
      navigate("/login", { state: { fromCheckout: true } });
      return;
    }

    setProcessing(true);

    try {
      await axios.post(
        `${backendURL}/api/pedido/crear/`,
        {
          items: carrito.map((i) => ({
            id: i.id,
            cantidad: i.cantidad,
          })),
          total: totalPrecio,
          ...formData,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

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
    <div className="min-h-screen py-16 flex justify-center items-center px-6 bg-gradient-to-br from-[#3b3d45] via-[#5c5f6a] to-[#7d808c]">
      <div className="bg-white/80 backdrop-blur-2xl p-10 rounded-3xl shadow-xl w-full max-w-3xl">

        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-[#ff66b3] via-[#ffd85a] to-[#42e2b8] bg-clip-text text-transparent">
          Finalizá tu compra ✨
        </h1>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {["nombre", "email", "direccion"].map((field) => (
            <div key={field} className={field === "direccion" ? "md:col-span-2" : ""}>
              <label className="text-sm font-semibold text-[#3f3524] mb-2 block">
                {field === "nombre" ? "Nombre completo"
                  : field === "email" ? "Correo electrónico"
                  : "Dirección"}
              </label>

              <input
                type={field === "email" ? "email" : "text"}
                name={field}
                required
                value={formData[field]}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border bg-white/90 border-[#e7dcc5]"
              />
            </div>
          ))}

          <div className="md:col-span-2">
            <label className="text-sm font-semibold mb-2 block">Método de pago</label>
            <select
              name="metodoPago"
              value={formData.metodoPago}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-[#e7dcc5] bg-white/90"
            >
              <option value="tarjeta">Tarjeta 💳</option>
              <option value="transferencia">Transferencia 🏦</option>
              <option value="efectivo">Efectivo 💵</option>
            </select>
          </div>

          {/* BOTÓN */}
          <button
            type={token ? "submit" : "button"}
            onClick={() => {
              if (!token) navigate("/login", { state: { fromCheckout: true } });
            }}
            disabled={processing}
            className={`md:col-span-2 mt-6 py-4 rounded-full text-[#1b1b1b] font-semibold
                        ${processing ? "bg-[#ffd85a]/40" : "bg-gradient-to-r from-[#ff66b3] via-[#ffd85a] to-[#42e2b8]"} 
                        transition-all flex items-center justify-center gap-2`}
          >
            {processing
              ? "Procesando..."
              : !token
                ? <>🔒 Inicia sesión para comprar</>
                : "Confirmar compra ✨"}
          </button>
        </form>
      </div>
    </div>
  );
}
