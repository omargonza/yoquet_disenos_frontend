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

    
  const mediaBase =
    import.meta.env.VITE_MEDIA_BASE ||
    "https://res.cloudinary.com/dfkyxmjnx/image/upload/v1730060034/yoquet";

 

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
  <div className="flex flex-col md:flex-row min-h-screen bg-[#0d0b0c] relative overflow-hidden text-white">
    {/* ✨ Confites animados */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.35 }}
      transition={{ duration: 1.2 }}
      className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,102,179,0.35),transparent_70%),radial-gradient(circle_at_80%_70%,rgba(255,216,90,0.35),transparent_70%),radial-gradient(circle_at_50%_90%,rgba(66,226,184,0.35),transparent_70%),radial-gradient(circle_at_30%_80%,rgba(139,92,246,0.3),transparent_70%)] blur-3xl"
    />

    {/* COLUMNA IZQUIERDA — FORMULARIO */}
    <div className="flex flex-col justify-center w-full md:w-1/2 px-8 sm:px-14 lg:px-20 py-12 bg-black/50 backdrop-blur-lg border-r border-white/10 shadow-inner relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-sm mx-auto"
      >
        {/* LOGO */}
        <motion.img
          src={`${mediaBase}/productos/logo-yoquet.png`}
          alt="Yoquet Diseños Logo"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="w-40 h-auto mx-auto mb-6 object-contain drop-shadow-[0_4px_10px_rgba(255,216,90,0.6)]"
        />

        {/* TÍTULO */}
        <h2 className="text-center text-3xl font-bold mb-1 bg-gradient-to-r from-[#ff66b3] via-[#ffd85a] to-[#42e2b8] text-transparent bg-clip-text drop-shadow-sm">
          Iniciá sesión
        </h2>
        <p className="text-center text-[#e9e4dc] mb-8 text-sm italic">
          Bienvenido a <span className="text-[#ffd85a] font-semibold">Yoquet Diseños</span> 🎉
        </p>

        {/* FORMULARIO */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#f5e6d0] mb-1">
              Usuario o Email
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 bg-[#1a181a]/60 border border-[#ffd85a]/40 rounded-md focus:ring-2 focus:ring-[#ff66b3] focus:border-[#ffd85a] text-[#fffaf2] outline-none transition text-sm placeholder-[#c9bca8]"
              placeholder="usuario@ejemplo.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#f5e6d0] mb-1">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-[#1a181a]/60 border border-[#ffd85a]/40 rounded-md focus:ring-2 focus:ring-[#ff66b3] focus:border-[#ffd85a] text-[#fffaf2] outline-none transition text-sm placeholder-[#c9bca8]"
              placeholder="••••••••"
              required
            />
          </div>

          {/* BOTÓN */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="relative w-full flex justify-center items-center gap-2 py-2 rounded-md font-semibold text-white text-sm overflow-hidden group shadow-md"
          >
            <span className="z-10">
              {loading ? "Cargando..." : "Iniciar Sesión"}
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-[#ff66b3] via-[#ffd85a] to-[#42e2b8] group-hover:opacity-90 transition-all"></span>
          </motion.button>
        </form>

        {/* ERROR */}
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[#ff8fa3] bg-[#2b1a1d]/70 border border-[#ff66b3]/30 rounded-md text-sm text-center py-2 mt-4"
          >
            {error}
          </motion.p>
        )}

        {/* FOOTER */}
        <div className="text-center mt-8">
          <p className="text-sm text-[#e9e4dc]">
            ¿Olvidaste tu contraseña?{" "}
            <a
              href="#"
              className="text-[#ff66b3] hover:text-[#ffd85a] font-medium"
            >
              Recuperar
            </a>
          </p>
          <p className="text-xs text-[#c1b8a4] mt-3">
            © {new Date().getFullYear()} Yoquet Diseños
          </p>
        </div>
      </motion.div>
    </div>

    {/* COLUMNA DERECHA — DECORACIÓN */}
    <motion.div
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1 }}
      className="hidden md:flex w-1/2 items-center justify-center relative overflow-hidden"
    >
      <img
        src={`${mediaBase}/productos/fondo-festivo.webp`}
        alt="Fondo festivo"
        className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-screen"
      />
      <div className="absolute inset-0 bg-gradient-to-tr from-[#000]/70 via-transparent to-[#000]/60"></div>

      <div className="relative z-10 text-center text-[#fffaf0] drop-shadow-lg px-10">
        <h3 className="text-3xl font-bold mb-2 tracking-tight bg-gradient-to-r from-[#ffd85a] via-[#ff66b3] to-[#42e2b8] bg-clip-text text-transparent">
          ✨ Creatividad sin límites
        </h3>
        <p className="text-base text-[#fdf7e9]">
          Cada diseño, una fiesta de color 🎊
        </p>
      </div>
    </motion.div>
  </div>
);
}