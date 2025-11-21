import { useState } from "react";
import axios from "axios";
import { useToast } from "../context/ToastContext";

export default function ResetPasswordRequest() {
  const { showToast } = useToast();
  const backend = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000";

  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${backend}/api/auth/password-reset/`, { email });
      showToast("Si el correo existe, enviamos un enlace 💌", "success");
    } catch (err) {
      showToast("Error al solicitar el reinicio", "error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Recuperar contraseña
        </h1>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Tu correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded-lg border-gray-300"
            required
          />

          <button className="w-full bg-[#ffd85a] text-black py-3 rounded-lg font-semibold hover:bg-[#ffcd2e] transition">
            Enviar enlace 💌
          </button>
        </form>
      </div>
    </div>
  );
}
