import { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../context/ToastContext";

export default function ResetPasswordConfirm() {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const backend = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000";
  const { showToast } = useToast();

  const [pass1, setPass1] = useState("");
  const [pass2, setPass2] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (pass1 !== pass2) {
      showToast("Las contraseñas no coinciden", "error");
      return;
    }

    try {
      await axios.post(`${backend}/api/auth/password-reset-confirm/`, {
        uid,
        token,
        password: pass1,
      });

      showToast("Contraseña actualizada ✔️", "success");

      setTimeout(() => navigate("/login"), 1200);

    } catch (err) {
      showToast("Error al actualizar la contraseña", "error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">

        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Nueva contraseña
        </h1>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Nueva contraseña"
            className="w-full p-3 border rounded-lg border-gray-300"
            value={pass1}
            onChange={(e) => setPass1(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Repetir contraseña"
            className="w-full p-3 border rounded-lg border-gray-300"
            value={pass2}
            onChange={(e) => setPass2(e.target.value)}
            required
          />

          <button className="w-full bg-[#42e2b8] text-black py-3 rounded-lg font-semibold hover:bg-[#20d3a6] transition">
            Actualizar ✔️
          </button>
        </form>
      </div>
    </div>
  );
}
