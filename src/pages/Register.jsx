import { useState } from "react";
import { useToast } from "../context/ToastContext";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";   // ✔ CORRECTO — ÚNICA INSTANCIA

export default function Register() {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  /* =========================================================
     MANEJAR REGISTRO (USANDO API GLOBAL)
  ========================================================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/api/auth/register/", form);  // ✔ CORRECTO
      showToast("Cuenta creada con éxito ✨", "success");
      navigate("/login");
    } catch (err) {
      console.error(err);
      showToast("Error creando cuenta", "error");
    }
  };

  /* =========================================================
     UI — TODO TU DISEÑO ORIGINAL
  ========================================================= */
  return (
    <div className="min-h-screen flex items-center justify-center px-6
                    bg-gradient-to-br from-[#3b3d45] via-[#5c5f6a] to-[#7d808c] text-white">
      <div className="bg-white/10 p-8 rounded-2xl backdrop-blur-xl border border-white/20 w-full max-w-sm">

        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r 
          from-[#ff66b3] via-[#ffd85a] to-[#42e2b8] text-transparent bg-clip-text">
          Crear cuenta ✨
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            placeholder="Usuario"
            required
            value={form.username}
            onChange={(e) =>
              setForm({ ...form, username: e.target.value })
            }
            className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white"
          />

          <input
            type="email"
            placeholder="Correo"
            required
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white"
          />

          <input
            type="password"
            placeholder="Contraseña"
            required
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white"
          />

          <button
            type="submit"
            className="w-full py-3 rounded-full bg-gradient-to-r 
              from-[#ff66b3] via-[#ffd85a] to-[#42e2b8] text-black font-semibold shadow-lg">
            Registrarme ✨
          </button>
        </form>

        <p className="text-center text-sm mt-4 text-white/60">
          ¿Ya tenés cuenta?{" "}
          <span 
            onClick={() => navigate("/login")} 
            className="text-[#ffd85a] cursor-pointer">
            Iniciar sesión
          </span>
        </p>
      </div>
    </div>
  );
}
