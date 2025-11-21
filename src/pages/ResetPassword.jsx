import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import axios from "axios";

export default function ResetPassword() {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [loading, setLoading] = useState(false);

  const backendURL = (import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000")
    .replace(/\/$/, "");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmar) {
      showToast("Las contraseñas no coinciden ❌", "error");
      return;
    }

    if (password.length < 6) {
      showToast("La contraseña debe tener al menos 6 caracteres", "error");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(`${backendURL}/api/auth/password-reset-confirm/`, {
        uid,
        token,
        password,
      });

      showToast("Contraseña actualizada ✔️", "success");

      // Redirección elegante
      setTimeout(() => navigate("/reset-success"), 1000);

    } catch (error) {
      console.error(error);
      showToast("Enlace inválido o expirado ❌", "error");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 
                    bg-gradient-to-br from-[#1b1c1f] via-[#2d2f36] to-[#4b4d55] text-white">

      <div className="bg-white/10 backdrop-blur-xl p-10 rounded-3xl 
                      border border-white/20 shadow-xl max-w-md w-full">

        <h1 className="text-3xl font-bold mb-4 text-center 
                       bg-gradient-to-r from-[#ffd85a] via-[#ff66b3] to-[#42e2b8] 
                       text-transparent bg-clip-text">
          Restablecer Contraseña
        </h1>

        <p className="text-center text-white/70 text-sm mb-6">
          Ingresá tu nueva contraseña para recuperar acceso a tu cuenta ✨
        </p>

        {/* FORMULARIO */}
        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="text-sm text-[#ffeccb] font-medium mb-1 block">
              Nueva contraseña
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 bg-[#1c1b1f]/60 border border-[#ffd85a]/40 
                         rounded-xl text-white placeholder-[#d6c6a8] outline-none 
                         focus:ring-2 focus:ring-[#ffd85a]"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm text-[#ffeccb] font-medium mb-1 block">
              Confirmar contraseña
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 bg-[#1c1b1f]/60 border border-[#ffd85a]/40 
                         rounded-xl text-white placeholder-[#d6c6a8] outline-none 
                         focus:ring-2 focus:ring-[#ff66b3]"
              placeholder="••••••••"
              required
              value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full font-semibold text-black
                       bg-gradient-to-r from-[#ff66b3] via-[#ffd85a] to-[#42e2b8]
                       shadow-lg hover:scale-[1.03] transition-all">
            {loading ? "Procesando..." : "Guardar contraseña ✨"}
          </button>

        </form>

      </div>
    </div>
  );
}
