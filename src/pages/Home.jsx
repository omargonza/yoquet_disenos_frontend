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

  // ✨ Canvas partículas metálicas/topo (igual a Productos)
  const canvasRef = useRef(null);

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

  // 🔹 Carrusel automático (se mantiene tu lógica)
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

  // 🔹 Autenticación + mensaje (se mantiene)
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

  // 🌌 Fondo de partículas metálicas (mismo motor que Productos)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const colors = [
      "rgba(255,215,120,0.25)", // dorado frío
      "rgba(200,200,255,0.25)", // blanco azulado
      "rgba(180,220,250,0.25)", // reflejos plata
    ];
    let particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = Array.from({ length: 36 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 0.6,
        dx: (Math.random() - 0.5) * 0.35,
        dy: Math.random() * 0.35 + 0.08,
        color: colors[Math.floor(Math.random() * colors.length)],
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        p.y += p.dy;
        p.x += p.dx;
        if (p.y > canvas.height) p.y = 0;
        if (p.x > canvas.width) p.x = 0;
        if (p.x < 0) p.x = canvas.width;
      });
      requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <>
      {/* 🎊 Confeti metálico sutil (tu lógica intacta) */}
      <Confetti
        width={width}
        height={height}
        numberOfPieces={80}
        recycle={false}
        gravity={0.2}
        colors={["#ff1d8e", "#ffcc33", "#00b8ff", "#ffffff", "#7b2cbf"]}
        tweenDuration={8000}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative min-h-screen flex flex-col items-center justify-start text-center
        bg-gradient-to-br from-[#3b3d45] via-[#5c5f6a] to-[#7d808c] text-white font-[Poppins] overflow-hidden"
      >
        {/* 🔧 Estilos locales para overlay metalizado, título con gloss & btn-festivo */}
        <style>{`
          @keyframes metalLux {
            0% { background-position: 0% 50%; opacity: 0.65; }
            50% { background-position: 100% 50%; opacity: 0.9; }
            100% { background-position: 0% 50%; opacity: 0.65; }
          }
          .metal-lux-overlay {
            mix-blend-mode: overlay;
            background-image:
              linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(212,185,120,0.08) 40%, rgba(255,255,255,0.1) 70%, transparent 100%),
              radial-gradient(circle at 35% 25%, rgba(255,255,255,0.18) 0%, transparent 60%),
              radial-gradient(circle at 80% 70%, rgba(255,255,255,0.1) 0%, transparent 70%);
            background-size: 250% 250%;
            animation: metalLux 20s ease-in-out infinite;
            filter: blur(2px);
          }
          .title-gloss:after{
            content:"";
            position:absolute;
            inset:0;
            background: linear-gradient(120deg, rgba(255,255,255,0.0) 30%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0.0) 70%);
            transform: skewX(-18deg) translateX(-120%);
            animation: glossRun 4.6s ease-in-out infinite 0.8s;
            pointer-events:none;
          }
          @keyframes glossRun {
            0% { transform: skewX(-18deg) translateX(-120%); opacity: 0; }
            20% { opacity: 0.25; }
            50% { transform: skewX(-18deg) translateX(120%); opacity: 0.15;}
            100% { opacity:0; }
          }
          /* Botón festivo global (usa tu paleta) */
          .btn-festivo {
            position: relative;
            overflow: hidden;
            border-radius: 9999px;
            padding: 0.75rem 2rem;
            font-weight: 600;
            color: #0b0a09;
            background: linear-gradient(90deg, var(--color-rosa), var(--color-dorado), var(--color-turquesa));
            box-shadow: 0 0 15px rgba(255,204,51,0.6);
            transition: transform .25s ease, box-shadow .25s ease, filter .25s ease;
          }
          .btn-festivo:hover {
            transform: translateY(-2px) scale(1.03);
            box-shadow: 0 0 26px rgba(255,204,51,0.85);
            filter: brightness(1.02);
          }
          .btn-outline-festivo{
            border: 2px solid var(--color-dorado);
            color: var(--color-dorado);
            border-radius: 9999px;
            padding: 0.75rem 2rem;
            font-weight: 600;
            background: transparent;
            transition: all .25s ease;
          }
          .btn-outline-festivo:hover{
            background: rgba(255, 216, 90, 0.1);
            color: #111;
          }

          /* Card glam de carrusel */
          .card-glam{
            background: linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%);
            border: 1px solid rgba(240,240,255,0.16);
            border-radius: 24px;
            backdrop-filter: blur(10px);
            box-shadow: 0 10px 28px rgba(0,0,0,0.18);
            transition: transform .45s ease, box-shadow .45s ease;
          }
          .card-glam:hover{
            transform: translateY(-6px) scale(1.03);
            box-shadow: 0 16px 40px rgba(0,0,0,0.28);
          }

          @media (max-width: 768px) {
            .metal-lux-overlay { opacity: .55 !important; filter: blur(1px) !important; }
          }
        `}</style>

        {/* 🪄 Overlay metálico igual a Productos */}
        <div className="metal-lux-overlay absolute inset-0 pointer-events-none z-[1]" />

        {/* 🫧 Halos de color muy sutiles */}
        <div className="absolute inset-0 overflow-hidden z-[2] pointer-events-none">
          <div className="absolute w-[45vw] h-[45vw] top-[8%] left-[12%] rounded-full bg-[radial-gradient(circle,rgba(255,29,142,0.22)_0%,transparent_70%)] blur-3xl" />
          <div className="absolute w-[55vw] h-[55vw] bottom-[14%] right-[8%] rounded-full bg-[radial-gradient(circle,rgba(255,204,51,0.18)_0%,transparent_70%)] blur-3xl" />
          <div className="absolute w-[40vw] h-[40vw] bottom-[30%] left-[45%] rounded-full bg-[radial-gradient(circle,rgba(0,184,255,0.18)_0%,transparent_70%)] blur-3xl" />
        </div>

        {/* 🎇 Canvas partículas metálicas */}
        <canvas ref={canvasRef} className="absolute inset-0 -z-10" />

        {/* 🔝 Header hero */}
        <div className="relative z-[3] w-full max-w-6xl mx-auto px-6 pt-20">
          {/* LOGO opcional */}
          {/* <img src={`${mediaBase}/productos/logo-yoquet.png`} alt="Logo" className="w-32 h-auto mx-auto mb-4 opacity-90" /> */}

          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="relative title-gloss text-5xl sm:text-6xl font-bold mb-3 
            text-transparent bg-clip-text bg-[length:200%_auto]
            bg-gradient-to-r from-[#ff1d8e] via-[#ffcc33] to-[#00b8ff] drop-shadow-[0_0_12px_rgba(255,204,51,0.6)]"
            style={{ backgroundPosition: "0% 50%", animation: "gradientShift 10s ease infinite" }}
          >
            Yoquet Diseños
          </motion.h1>

          {/* Gradiente animado del título */}
          <style>{`
            @keyframes gradientShift {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
          `}</style>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-[#ffcc33] text-lg max-w-xl mx-auto mb-8 font-medium"
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

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate("/productos")}
                  className="btn-festivo"
                  style={{
                    // asegúrate de tener estas variables en tu CSS base
                    // :root { --color-rosa: #ff66b3; --color-dorado: #ffd85a; --color-turquesa: #42e2b8; }
                  }}
                >
                  Ir al Catálogo 🛍️
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleLogout}
                  className="btn-outline-festivo"
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
                className="btn-festivo"
              >
                Iniciar Sesión 🔐
              </motion.button>

              <p className="text-sm text-[#e7e6e1]/80 mt-4">
                Accedé a nuestros productos exclusivos para tus eventos más
                brillantes ✨
              </p>
            </>
          )}
        </div>

        {/* 🎠 CARRUSEL DESTACADOS */}
        {destacados?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="relative z-[3] w-full max-w-6xl mt-16 px-6"
          >
            <h2 className="text-3xl font-semibold text-[#ffcc33] mb-6">
              Destacados de la colección 💎
            </h2>

            <div className="relative">
              {/* Fades laterales */}
              <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#3b3d45] to-transparent z-10" />
              <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#7d808c] to-transparent z-10" />

              <div
                ref={scrollRef}
                className="flex gap-6 overflow-x-auto scrollbar-none pb-4 snap-x snap-mandatory"
              >
                {destacados.map((p) => (
                  <motion.div
                    key={p.id}
                    whileHover={{ scale: 1.05 }}
                    className="card-glam min-w-[280px] max-w-[280px] snap-start cursor-pointer group"
                    onClick={() => navigate(`/productos/${p.id}`)}
                  >
                    <div className="relative overflow-hidden rounded-t-[24px]">
                      <img
                        src={p.imagen}
                        alt={p.nombre}
                        className="w-full h-64 object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.08]"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://res.cloudinary.com/dfkyxmjnx/image/upload/v1730060034/yoquet/productos/fallback.webp";
                        }}
                      />
                      {/* Shine */}
                      <span className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                        style={{
                          background:
                            "linear-gradient(120deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.35) 45%, rgba(255,255,255,0) 100%)",
                          transform: "skewX(-20deg)",
                        }}
                      />
                    </div>
                    <div className="p-4 text-left">
                      <h3 className="text-[#ffcc33] font-semibold leading-tight line-clamp-1">
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

        {/* 📝 Pie sutil */}
        <div className="relative z-[3] mt-16 mb-10 px-6 text-xs text-white/70">
          © {new Date().getFullYear()} Yoquet Diseños — Estilo que celebra 🎉
        </div>
      </motion.div>
    </>
  );
}
