import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

export default function Home() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [username, setUsername] = useState("");
  const [destacados, setDestacados] = useState([]);
  const scrollRef = useRef(null);

  const backendURL =
    import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000/";

  const mediaBase =
    import.meta.env.VITE_MEDIA_BASE ||
    "https://res.cloudinary.com/dfkyxmjnx/image/upload/v1730060034/yoquet";

  const { width, height } = useWindowSize();

  // 🔹 Cargar destacados
  useEffect(() => {
    const fetchDestacados = async () => {
      try {
        const res = await fetch(`${backendURL}api/productos/destacados/`);
        const data = await res.json();
        setDestacados(data.results || data);
      } catch (error) {
        console.log("Error cargando destacados:", error);
      }
    };
    fetchDestacados();
  }, [backendURL]);

  // 🔹 Carrusel automático
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let frame;
    const speed = 0.25;
    const animate = () => {
      el.scrollLeft += speed;
      if (el.scrollLeft >= el.scrollWidth - el.clientWidth) el.scrollLeft = 0;
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [destacados]);

  // 🔹 Autenticación + mensaje
  useEffect(() => {
    const hora = new Date().getHours();
    if (hora < 12) setMensaje("🔥 Buenos días, el brillo arranca temprano");
    else if (hora < 18) setMensaje("💎 Buenas tardes, seguimos creando magia");
    else setMensaje("🌙 Buenas noches, el glamour no descansa");

    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (Date.now() < decoded.exp * 1000) {
          setUsername(decoded.username || decoded.user || "Cliente");
          setIsLoggedIn(true);
        } else {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
        }
      } catch {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/despedida");
  };

  return (
    <>
      {/* ✨ Confeti metálico sutil */}
      <Confetti
        width={width}
        height={height}
        numberOfPieces={80} // 🎊 Cantidad moderada
        recycle={false} // ❌ No se repite eternamente
        gravity={0.2} // 🌬️ Caída suave
        colors={[
          "#ff1d8e", // fucsia
          "#ffcc33", // dorado
          "#00b8ff", // azul neón
          "#ffffff", // blanco brillante
          "#7b2cbf", // violeta royal
        ]}
        tweenDuration={8000} // ⚡ Duración de animación
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="min-h-screen flex flex-col items-center justify-center text-center
      bg-gradient-to-br from-[#0b0a09] via-[#1a0020] to-[#2b003a]
      text-white font-[Poppins] overflow-hidden relative"
      >
        {/* 🖼️ LOGO */}
     

        {/* ✨ TÍTULO */}
        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-5xl sm:text-6xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-[#ff1d8e] via-[#ffcc33] to-[#00b8ff] drop-shadow-[0_0_12px_rgba(255,204,51,0.6)]"
        >
          Yoquet Diseños
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-[#ffcc33] text-lg max-w-md mb-10 font-medium"
        >
          🎇 Cotillón Premium — Color, Estilo y Brillo en Cada Detalle ✨
        </motion.p>

        {/* 👤 LOGIN / LOGOUT */}
        {isLoggedIn ? (
          <>
            <motion.p
              className="text-[#ffcc33] text-lg mb-8 italic"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {mensaje},{" "}
              <span className="text-[#ff1d8e] font-semibold">{username}</span>{" "}
              💫
            </motion.p>

            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/productos")}
                className="px-8 py-3 bg-gradient-to-r from-[#ff1d8e] via-[#ffcc33] to-[#00b8ff]
              text-[#0b0a09] font-semibold rounded-full shadow-[0_0_15px_rgba(255,204,51,0.7)] hover:shadow-[0_0_25px_rgba(255,204,51,0.9)] transition-all"
              >
                Ir al Catálogo 🛍️
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleLogout}
                className="px-8 py-3 border-2 border-[#ffcc33] text-[#ffcc33] font-semibold rounded-full shadow-sm hover:bg-[#1a0020] transition-all"
              >
                Cerrar sesión
              </motion.button>
            </div>
          </>
        ) : (
          <>
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/login")}
              className="px-8 py-3 bg-gradient-to-r from-[#ff1d8e] via-[#ffcc33] to-[#00b8ff]
            text-[#0b0a09] font-semibold rounded-full shadow-[0_0_15px_rgba(255,204,51,0.7)] hover:shadow-[0_0_25px_rgba(255,204,51,0.9)] transition-all"
            >
              Iniciar Sesión 🔐
            </motion.button>

            <p className="text-sm text-[#d8cfa6] mt-4">
              Accedé a nuestros productos exclusivos para tus eventos más
              brillantes ✨
            </p>
          </>
        )}

        {/* 🎠 CARRUSEL DESTACADOS */}
        {destacados?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="w-full max-w-6xl mt-20 px-6"
          >
            <h2 className="text-3xl font-semibold text-[#ffcc33] mb-6">
              Destacados de la colección 💎
            </h2>

            <div className="relative">
              <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#0b0a09] to-transparent z-10"></div>
              <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#0b0a09] to-transparent z-10"></div>

              <div
                ref={scrollRef}
                className="flex gap-6 overflow-x-auto scrollbar-none pb-4 snap-x snap-mandatory"
              >
                {destacados.map((p) => (
                  <motion.div
                    key={p.id}
                    whileHover={{ scale: 1.05 }}
                    className="card-glam min-w-[280px] max-w-[280px] snap-start cursor-pointer"
                    onClick={() => navigate(`/productos/${p.id}`)}
                  >
                    <img
                      src={p.imagen}
                      alt={p.nombre}
                      className="w-full h-64 object-cover rounded-t-[24px] transition-transform duration-[1200ms] ease-out hover:scale-[1.08]"
                      onError={(e) => {
                        e.target.src =
                          "https://res.cloudinary.com/dfkyxmjnx/image/upload/v1730060034/yoquet/productos/fallback.webp";
                      }}
                    />
                    <div className="p-4 text-left">
                      <h3 className="text-[#ffcc33] font-semibold leading-tight">
                        {p.nombre}
                      </h3>
                      <p className="text-[#ff1d8e] font-medium mt-1">
                        ${p.precio}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ✨ FONDO DECORATIVO */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 2 }}
          className="pointer-events-none -z-10 absolute inset-0
        bg-[radial-gradient(circle_at_20%_20%,rgba(255,29,142,0.2),transparent_70%),radial-gradient(circle_at_80%_80%,rgba(255,204,51,0.2),transparent_70%),radial-gradient(circle_at_50%_50%,rgba(0,184,255,0.15),transparent_70%)]
        blur-3xl"
        />
      </motion.div>
    </>
  );
}
