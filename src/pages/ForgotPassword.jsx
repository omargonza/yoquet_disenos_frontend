import { useState } from "react";
import { useToast } from "../context/ToastContext";
import axios from "axios";

export default function ForgotPassword() {
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const backendURL = (import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000")
    .replace(/\/$/, "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${backendURL}/api/auth/password-reset/`, { email });
      showToast("📬 Te enviamos un correo con instrucciones", "success");
    } catch (error) {
      console.error(error);
      showToast("No pudimos enviar el correo", "error");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-br from-[#3b3d45] via-[#5c5f6a] to-[#7d808c] text-white">
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 max-w-sm w-full border border-white/20">
        
        <h2 className="text-2xl font-bold text-center mb-4 bg-gradient-to-r from-[#ff66b3] via-[#ffd85a] to-[#42e2b8] text-transparent bg-clip-text">
          ¿Olvidaste tu contraseña?
        </h2>

        <p className="text-white/70 text-sm text-center mb-6">
          Ingresá tu correo y te enviaremos instrucciones para recuperarla.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="email"
            required
            placeholder="tu correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/50 focus:ring-2 focus:ring-[#ffd85a]"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-gradient-to-r from-[#ff66b3] via-[#ffd85a] to-[#42e2b8] text-black font-semibold shadow-lg"
          >
            {loading ? "Enviando..." : "Enviar instrucciones 📬"}
          </button>
        </form>

        <button
          onClick={() => history.back()}
          className="mt-4 text-sm text-white/60 block text-center"
        >
          ← Volver atrás
        </button>
      </div>
    </div>
  );
}
