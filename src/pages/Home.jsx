import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export default function Home() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [username, setUsername] = useState("");

  const backendURL =
    import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000";

  // 🕒 Determina saludo y valida token
  useEffect(() => {
    const hora = new Date().getHours();
    if (hora < 12) setMensaje("☀️ Buenos días, creatividad en marcha");
    else if (hora < 18)
      setMensaje("🌞 Buenas tardes, sigamos creando belleza");
    else setMensaje("🌙 Buenas noches, el arte nunca duerme");

    const token = localStorage.getItem("access_token");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        const exp = decoded.exp * 1000;
        if (Date.now() < exp) {
          setUsername(decoded.username || decoded.user || "Cliente");
          setIsLoggedIn(true);
        } else {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          setIsLoggedIn(false);
        }
      } catch {
        localStorage.removeItem("access_token");
        setIsLoggedIn(false);
      }
    }
  }, []);

  // 🚪 Cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/despedida");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="min-h-screen flex flex-col items-center justify-center text-center bg-gradient-to-br from-[#faf7f1] via-[#f4efe6] to-[#f9f4e9] text-[#3f3524] font-serif overflow-hidden relative"
    >
      {/* Logo */}
      <motion.img
        src={`${backendURL}/media/productos/souvenir/catalogo-diego-1-1.webp`}
        alt="Yoquet Diseños Logo"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.9, scale: 1 }}
        transition={{ duration: 1 }}
        className="w-28 h-28 mb-6 rounded-xl object-cover shadow-md ring-2 ring-[#e2c78c]/50"
      />

      {/* Título */}
      <motion.h1
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="text-4xl sm:text-5xl font-bold mb-3 text-[#b08c4e]"
      >
        Bienvenido a Yoquet Diseños
      </motion.h1>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="text-[#7a6a4f] text-lg max-w-md mb-10"
      >
        Donde la creatividad y la elegancia se encuentran 💫
      </motion.p>

      {/* Acciones dinámicas */}
      {isLoggedIn ? (
        <>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-[#7a6a4f] text-lg mb-8 italic"
          >
            {mensaje},{" "}
            <span className="text-[#b08c4e] font-semibold">{username}</span> 💛
          </motion.p>

          <div className="flex flex-col sm:flex-row gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/productos")}
              className="px-8 py-3 bg-gradient-to-r from-[#d4b978] via-[#e8d29a] to-[#b9994b] text-[#3f2e13] font-medium rounded-full shadow-md hover:shadow-lg transition-all duration-300"
            >
              Ir al catálogo 🛍️
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleLogout}
              className="px-8 py-3 border border-[#d4b978] text-[#b08c4e] font-medium rounded-full shadow-sm hover:bg-[#f8f3e8] transition-all duration-300"
            >
              Cerrar sesión
            </motion.button>
          </div>
        </>
      ) : (
        <>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/login")}
            className="px-8 py-3 bg-gradient-to-r from-[#d4b978] via-[#e8d29a] to-[#b9994b] text-[#3f2e13] font-medium rounded-full shadow-md hover:shadow-lg transition-all duration-300"
          >
            Iniciar sesión para explorar 🛒
          </motion.button>

          <p className="text-sm text-[#a4977b] mt-4">
            Accedé a nuestros productos exclusivos ✨
          </p>
        </>
      )}

      {/* Fondo decorativo */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.25 }}
        transition={{ duration: 2 }}
        className="pointer-events-none -z-10 absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(212,185,120,0.3),transparent_70%),radial-gradient(circle_at_70%_70%,rgba(185,153,75,0.3),transparent_70%)] blur-3xl"
      />
    </motion.div>
  );
}
