import { useState } from "react";
import { useToast } from "../context/ToastContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

export default function Login() {
  const { showToast } = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  const backendURL =
    import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(`${backendURL}/api/auth/login/`, {
        username,
        password,
      });

      localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);

      setLoggedIn(true);

      // 🎉 Celebración visual y sonora
      showToast(`¡Bienvenido de nuevo, ${username || "artista"}!`, "celebration");

      // ✅ Toast informativo breve
      showToast("Inicio de sesión exitoso", "success");

      // Redirigir con un pequeño delay
      setTimeout(() => navigate("/productos"), 2000);
    } catch (err) {
      console.error(err);
      setError("Usuario o contraseña incorrectos");

      // ❌ Toast de error
      showToast("Usuario o contraseña incorrectos", "error");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-[#faf7f1] via-[#f4efe6] to-[#f9f4e9]">
      {/* COLUMNA IZQUIERDA — FORMULARIO */}
      <div className="flex flex-col justify-center w-full md:w-1/2 px-6 sm:px-12 lg:px-20 py-10 bg-white/60 backdrop-blur-md border-r border-[#e8e0cf]/40 shadow-inner">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-sm mx-auto"
        >
          {/* LOGO */}
          <motion.img
            src={`${backendURL}/media/productos/souvenir/catalogo-diego-1-1.webp`}
            alt="Yoquet Diseños Logo"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="w-14 h-14 mx-auto mb-4 rounded-lg object-cover shadow-sm ring-2 ring-[#e2c78c]/50"
          />

          {/* TITULO */}
          <h2 className="text-center text-2xl font-semibold text-[#4b3f2f] mb-1">
            Bienvenido a{" "}
            <span className="text-[#b08c4e] font-bold">Yoquet Diseños</span>
          </h2>
          <p className="text-center text-[#7a6a4f] mb-8 text-sm">
            Creaciones únicas, hechas con pasión ✨
          </p>

          {/* FORMULARIO */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#5c4e35] mb-1">
                Usuario o Email
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 bg-[#fffdf9] border border-[#e7dcc5] rounded-md focus:ring-2 focus:ring-[#cbb278] focus:border-[#cbb278] text-[#3f3524] outline-none transition text-sm"
                placeholder="usuario@ejemplo.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#5c4e35] mb-1">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-[#fffdf9] border border-[#e7dcc5] rounded-md focus:ring-2 focus:ring-[#cbb278] focus:border-[#cbb278] text-[#3f3524] outline-none transition text-sm"
                placeholder="••••••••"
                required
              />
            </div>

            {/* BOTÓN DE LOGIN */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className="relative w-full flex justify-center items-center gap-2 py-2 rounded-md font-medium text-[#3f2e13] shadow-md text-sm overflow-hidden group"
            >
              <span className="z-10">
                {loading ? "Cargando..." : "Iniciar Sesión"}
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-[#d4b978] via-[#e8d29a] to-[#b9994b] group-hover:animate-shine"></span>
            </motion.button>
          </form>

          {/* ERROR */}
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[#a15234] bg-[#fff6f4] border border-[#e2b9a8] rounded-md text-sm text-center py-2 mt-4"
            >
              {error}
            </motion.p>
          )}

          {/* FOOTER */}
          <div className="text-center mt-8">
            <p className="text-sm text-[#7a6a4f]">
              ¿Olvidaste tu contraseña?{" "}
              <a
                href="#"
                className="text-[#b58b49] hover:text-[#9c7c41] font-medium"
              >
                Recuperar
              </a>
            </p>
            <p className="text-xs text-[#b2a78c] mt-3">
              © {new Date().getFullYear()} Yoquet Diseños
            </p>
          </div>
        </motion.div>
      </div>

      {/* COLUMNA DERECHA — IMAGEN DECORATIVA */}
      <motion.div
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        className="hidden md:flex w-1/2 items-center justify-center relative overflow-hidden"
      >
        <img
          src={`${backendURL}/media/productos/souvenir/catalogo-diego-1-1.webp`}
          alt="Imagen decorativa Yoquet Diseños"
          className="absolute inset-0 w-full h-full object-cover brightness-95 contrast-105 blur-[1.5px]"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#d4b978]/50 via-[#f7f1e5]/20 to-[#c4aa70]/30"></div>

        <div className="relative z-10 text-center text-[#fffaf0] drop-shadow-md px-10">
          <h3 className="text-3xl font-semibold mb-2 tracking-tight">
            Elegancia Artesanal
          </h3>
          <p className="text-base text-[#fdf7e9]">
            Detalles únicos, pensados con amor 💛
          </p>
        </div>
      </motion.div>
    </div>
  );
}
