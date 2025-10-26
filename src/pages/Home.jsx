import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { jwtDecode } from "jwt-decode";

export default function Home() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [username, setUsername] = useState("");

  const [destacados, setDestacados] = useState([]);
  const scrollRef = useRef(null);

  const backendURL =
    import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000/";

  // ✅ Cargar destacados
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

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let frame;
    const speed = 0.15; // ← LENTO Y ELEGANTE ✨

    const animate = () => {
      el.scrollLeft += speed;

      if (el.scrollLeft >= el.scrollWidth - el.clientWidth) {
        el.scrollLeft = 0;
      }

      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [destacados]);

  // ✅ Determinar saludo + validar autenticación
  useEffect(() => {
    const hora = new Date().getHours();
    if (hora < 12) setMensaje("☀️ Buenos días, creatividad en marcha");
    else if (hora < 18) setMensaje("🌞 Buenas tardes, sigamos creando belleza");
    else setMensaje("🌙 Buenas noches, el arte nunca duerme");

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

  // ✅ Cerrar sesión
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
      className="min-h-screen flex flex-col items-center justify-center text-center
      bg-gradient-to-br from-[#faf7f1] via-[#f4efe6] to-[#f9f4e9]
      text-[#3f3524] font-serif overflow-hidden relative"
    >
      {/* LOGO */}
      <motion.img
        src={`${backendURL}media/productos/souvenir/catalogo-diego-1-1.webp`}
        alt="Yoquet Diseños Logo"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.9, scale: 1 }}
        transition={{ duration: 1 }}
        className="w-28 h-28 mb-6 rounded-xl object-cover shadow-md ring-2 ring-[#e2c78c]/50"
      />

      {/* TÍTULO */}
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

      {/* BOTONES SEGÚN LOGIN */}
      {isLoggedIn ? (
        <>
          <motion.p
            className="text-[#7a6a4f] text-lg mb-8 italic"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {mensaje},{" "}
            <span className="text-[#b08c4e] font-semibold">{username}</span> 💛
          </motion.p>

          <div className="flex flex-col sm:flex-row gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/productos")}
              className="px-8 py-3 bg-gradient-to-r from-[#d4b978] via-[#e8d29a] to-[#b9994b]
              text-[#3f2e13] font-medium rounded-full shadow-md hover:shadow-lg transition-all"
            >
              Ir al catálogo 🛍️
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleLogout}
              className="px-8 py-3 border border-[#d4b978] text-[#b08c4e] font-medium rounded-full shadow-sm hover:bg-[#f8f3e8] transition-all"
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
            className="px-8 py-3 bg-gradient-to-r from-[#d4b978] via-[#e8d29a] to-[#b9994b]
            text-[#3f2e13] font-medium rounded-full shadow-md hover:shadow-lg transition-all"
          >
            Iniciar sesión para explorar 🛒
          </motion.button>

          <p className="text-sm text-[#a4977b] mt-4">
            Accedé a nuestros productos exclusivos ✨
          </p>
        </>
      )}

      {/* CARRUSEL DESTACADOS */}
      {destacados.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="w-full max-w-6xl mt-20 px-6"
        >
          <h2 className="text-3xl font-semibold text-[#b08c4e] mb-6">
            Destacados de la colección ✨
          </h2>

          <div className="relative">
            {/* Fade suave lateral */}
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#faf7f1] to-transparent z-10"></div>
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#faf7f1] to-transparent z-10"></div>

            {/* CARRUSEL */}
            <div
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto scrollbar-none pb-4 snap-x snap-mandatory"
            >
              {destacados.map((p) => (
                <motion.div
                  key={p.id}
                  whileHover={{ scale: 1.04 }}
                  className="min-w-[280px] max-w-[280px] snap-start rounded-[24px] overflow-hidden
            shadow-[0_6px_18px_rgba(0,0,0,0.08)]
            bg-[#fffdf9] border border-[#e7dcc5]
            hover:shadow-[0_10px_26px_rgba(0,0,0,0.12)] transition-all duration-500 cursor-pointer"
                  onClick={() => navigate(`/productos/${p.id}`)}
                >
                  <img
                    src={p.imagen}
                    alt={p.nombre}
                    className="w-full h-64 object-cover rounded-[20px] transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
                  />
                  <div className="p-4 text-left">
                    <h3 className="text-[#4b3f2f] font-semibold leading-tight">
                      {p.nombre}
                    </h3>
                    <p className="text-[#b08c4e] font-medium mt-1">
                      ${p.precio}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* FONDO DECORATIVO */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.25 }}
        transition={{ duration: 2 }}
        className="pointer-events-none -z-10 absolute inset-0
        bg-[radial-gradient(circle_at_30%_30%,rgba(212,185,120,0.3),transparent_70%),radial-gradient(circle_at_70%_70%,rgba(185,153,75,0.3),transparent_70%)]
        blur-3xl"
      />
    </motion.div>
  );
}
