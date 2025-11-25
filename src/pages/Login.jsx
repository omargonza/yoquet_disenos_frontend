import { useState } from "react";
import { useToast } from "../context/ToastContext";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../utils/api"; // ✔ AHORA CORRECTO
import { useAuth } from "../context/AuthContext";
import logo_Yoquet from "../assets/logo_Yoquet.png";
import loginImg from "../assets/login.jpg";


export default function Login() {
  const { showToast } = useToast();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/productos";
   

  /* =========================================================
     VALIDACIÓN MÍNIMA DE INPUTS (anti-XSS básico)
  ========================================================= */
  const cleanText = (txt) => txt.replace(/[<>{}]/g, "");

  /* =========================================================
     LOGIN — ENVÍA TOKEN A API GLOBAL (FIX CRÍTICO)
  ========================================================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/api/auth/login/", {
        username: cleanText(username),
        password,
      });

      // Guardar tokens correctamente
      // localStorage.setItem("access_token", res.data.access);
      //localStorage.setItem("refresh_token", res.data.refresh);
     
    login(res.data.access, res.data.refresh);

      showToast(`Bienvenido, ${cleanText(username)} ✨`, "success");

       // Redirección inteligente:
      setTimeout(() => navigate(from, { replace: true }), 900);
    } catch {
      setError("Usuario o contraseña incorrectos");
      showToast("Credenciales incorrectos", "error");
      setLoading(false);
    }
  };

  /* =========================================================
     UI —  DISEÑO ORIGINAL COMPLETO
  ========================================================= */
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#1e1e22] text-white">

      {/* FORM */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-10 py-16">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-sm mx-auto w-full"
        >

          {/* LOGO */}
          <img
            src={logo_Yoquet}
            alt="Logo Yoquet Diseños"
            className="w-44 mx-auto mb-6 drop-shadow-xl"
          />

          <h2 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-[#ffd85a] to-[#ff66b3] bg-clip-text text-transparent">
            ¡Bienvenido!
          </h2>
          <p className="text-center text-white/70 mb-6">
            Iniciá sesión para continuar ✨
          </p>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* USER */}
            <div>
              <label className="block text-sm mb-1">Usuario</label>
              <input
                type="text"
                value={username}
                onChange={(e) =>
                  setUsername(cleanText(e.target.value))
                }
                className="w-full px-3 py-2 bg-[#2a2a2e] border border-white/20 rounded-md text-white"
                placeholder="usuario@ejemplo.com"
                required
              />
            </div>

            {/* PASS */}
            <div>
              <label className="block text-sm mb-1">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-[#2a2a2e] border border-white/20 rounded-md text-white"
                placeholder="••••••••"
                required
              />
            </div>

            {/* BUTTON */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className="w-full py-2 rounded-full bg-gradient-to-r from-[#ff66b3] to-[#ffd85a] text-black font-semibold shadow-md"
            >
              {loading ? "Ingresando..." : "Iniciar Sesión"}
            </motion.button>

            <p className="text-center text-white/70 text-sm mt-3">
              ¿No tenés cuenta?
              <span
                onClick={() => navigate("/register")}
                className="text-[#42e2b8] cursor-pointer ml-1 hover:text-[#ffd85a]"
              >
                Registrarme
              </span>
            </p>

            <p className="text-center text-white/70 text-sm">
              ¿Olvidaste tu contraseña?
              <span
                onClick={() => navigate("/forgot-password")}
                className="text-[#ff66b3] cursor-pointer ml-1 hover:text-[#ffd85a]"
              >
                Recuperarla 🔐
              </span>
            </p>
          </form>

          {/* ERROR */}
          {error && (
            <div className="mt-4 bg-red-500/80 text-white text-center p-2 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* FOOTER */}
          <div className="text-center text-white/50 text-xs mt-16">
            © {new Date().getFullYear()} Yoquet Diseños
            <br />
            <span className="text-white/40 text-[10px]">
              Desarrollado por conurbaDEV
            </span>
          </div>

        </motion.div>
      </div>

      {/* IMAGEN */}
      <div className="hidden md:flex w-1/2 relative">
        <img
          src={loginImg}
          alt="decorativo"
          className="w-full h-full object-cover opacity-70"
        />
      </div>
    </div>
  );
}
