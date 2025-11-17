import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import logo_Yoquet from "../assets/logo_Yoquet.png";

export default function Home() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [username, setUsername] = useState("");
  const [destacados, setDestacados] = useState([]);
  const scrollRef = useRef(null);
  const canvasRef = useRef(null);

  const backendURL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000/";
  const { width, height } = useWindowSize();

  /* =========================================================
     Cargar Destacados
  ========================================================= */
  useEffect(() => {
    const fetchDestacados = async () => {
      try {
        const res = await fetch(`${backendURL}/api/productos/destacados/`);
        const data = await res.json();
        setDestacados(data.results || data);
      } catch (error) {
        console.log("Error cargando destacados:", error);
      }
    };
    fetchDestacados();
  }, [backendURL]);

  /* =========================================================
     Carrusel Auto Scroll
  ========================================================= */
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

  /* =========================================================
     Autenticación y Mensaje según hora
  ========================================================= */
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

  /* =========================================================
     Fondo de partículas metálicas
  ========================================================= */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const colors = [
      "rgba(255,215,120,0.25)",
      "rgba(200,200,255,0.25)",
      "rgba(180,220,250,0.25)",
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
        p.x += p.dx;
        p.y += p.dy;
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
      {/* 🎊 Confetti Metálico */}
      <Confetti
        width={width}
        height={height}
        numberOfPieces={80}
        recycle={false}
        gravity={0.2}
        colors={["#ff1d8e", "#ffcc33", "#00b8ff", "#ffffff", "#7b2cbf"]}
        tweenDuration={8000}
      />

      {/* =========================================================
          HOME - Contenedor Principal
      ========================================================= */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative min-h-screen flex flex-col items-center justify-start text-center
        bg-gradient-to-br from-[#3b3d45] via-[#5c5f6a] to-[#7d808c] text-white overflow-hidden pt-16 sm:pt-20
        px-4 sm:px-6"
      >
        {/* 🎨 Estilos locales */}
        <style>
          {`
          :root{
            --color-rosa:#ff66b3;
            --color-dorado:#ffd85a;
            --color-turquesa:#42e2b8;
          }

          @keyframes gradientHome {
            0% { background-position: 0% 50%; }
            50% { background-position: 120% 50%; }
            100% { background-position: 0% 50%; }
          }

          .title-gloss::after{
            content:"";
            position:absolute;
            inset:0;
            background: linear-gradient(120deg, rgba(255,255,255,0) 30%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0));
            transform: translateX(-120%) skewX(-18deg);
            animation: glossRun 4.6s ease-in-out infinite 0.8s;
            pointer-events:none;
          }

          @keyframes glossRun {
            0% { transform: translateX(-120%) skewX(-18deg); opacity: 0; }
            25% { opacity: 0.3; }
            50% { transform: translateX(120%) skewX(-18deg); opacity: 0.2; }
            100% { opacity:0; }
          }

          .btn-festivo{
            position:relative;
            overflow:hidden;
            border-radius:9999px;
            padding:0.75rem 2rem;
            font-weight:600;
            background:linear-gradient(90deg,var(--color-rosa),var(--color-dorado),var(--color-turquesa));
            background-size:200% 200%;
            animation:metalGlow 6s ease-in-out infinite;
            color:#0b0a09;
            box-shadow:0 0 14px rgba(255,216,90,0.55);
            transition:transform .25s ease;
          }
          .btn-festivo:hover{
            transform:scale(1.05);
          }

          @keyframes metalGlow{
            0% { filter:brightness(1); }
            50% { filter:brightness(1.22); }
            100% { filter:brightness(1); }
          }

          .btn-outline-festivo{
            border:2px solid var(--color-dorado);
            color:var(--color-dorado);
            border-radius:9999px;
            padding:0.75rem 2rem;
            font-weight:600;
            transition:all .3s ease;
          }
          .btn-outline-festivo:hover{
            background:rgba(255,216,90,0.15);
            color:#111;
          }

          .card-glam{
            background:rgba(255,255,255,0.06);
            border:1px solid rgba(255,204,51,0.18);
            border-radius:24px;
            backdrop-filter:blur(12px);
            box-shadow:0 10px 28px rgba(0,0,0,0.22);
            transition:transform .35s ease, box-shadow .35s ease, border .35s ease;
          }
          .card-glam:hover{
            transform:translateY(-6px) scale(1.04);
            border-color:rgba(255,204,51,0.45);
            box-shadow:0 0 24px rgba(255,204,51,0.55), 0 16px 40px rgba(0,0,0,0.28);
          }
        `}
        </style>

        {/* 🌌 Overlay metálico */}
        <div className="metal-lux-overlay absolute inset-0 pointer-events-none z-[1]" />

        {/* 🌈 Halos de color */}
        <div className="absolute inset-0 overflow-hidden z-[2] pointer-events-none">
          <div className="absolute w-[45vw] h-[45vw] top-[8%] left-[12%] rounded-full bg-[radial-gradient(circle,rgba(255,29,142,0.22),transparent)] blur-3xl" />
          <div className="absolute w-[55vw] h-[55vw] bottom-[14%] right-[8%] rounded-full bg-[radial-gradient(circle,rgba(255,204,51,0.18),transparent)] blur-3xl" />
          <div className="absolute w-[40vw] h-[40vw] bottom-[30%] left-[45%] rounded-full bg-[radial-gradient(circle,rgba(0,184,255,0.18),transparent)] blur-3xl" />
        </div>

        {/* 🎇 Partículas */}
        <canvas ref={canvasRef} className="absolute inset-0 -z-10" />

        {/* =========================================================
            HERO SECTION
        ========================================================= */}
        <div className="relative z-[3] w-full max-w-6xl mx-auto px-4 sm:px-6">

          {/* LOGO — FESTIVO + HALO */}
          <div className="relative w-fit mx-auto mb-8">
            <div
              className="absolute -inset-6 rounded-full blur-2xl animate-pulse"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,29,142,0.32), rgba(255,204,51,0.22), rgba(0,184,255,0.26), transparent 70%)",
              }}
            />
            <motion.img
              src={logo_Yoquet}
              alt="Yoquet Diseños"
              className="relative w-40 sm:w-48 drop-shadow-[0_8px_24px_rgba(255,216,90,0.75)]"
              initial={{ scale: 0.88, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>

          {/* TÍTULO */}
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="relative title-gloss
              text-4xl sm:text-5xl md:text-6xl font-bold mb-3
              text-transparent bg-clip-text 
              bg-gradient-to-r from-[#ff1d8e] via-[#ffcc33] to-[#00b8ff]
              bg-[length:220%_auto] animate-[gradientHome_10s_ease_infinite]
              drop-shadow-[0_0_22px_rgba(255,204,51,0.75)]"
          >
            Yoquet Diseños
          </motion.h1>

          {/* Subtítulo */}
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-[#ffcc33] text-lg max-w-xl mx-auto mb-8 font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]"
          >
            🎉 Cotillón Premium — Color, Estilo y Brillo en Cada Detalle ✨
          </motion.p>

          {/* =========================================================
              LOGIN / LOGOUT
          ========================================================= */}
          {isLoggedIn ? (
            <>
              <motion.p
                className="text-[#ffcc33] text-lg mb-6 italic"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {mensaje},{" "}
                <span className="text-[#ff1d8e] font-semibold">{username}</span>{" "}
                💫
              </motion.p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
                <motion.button
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate("/productos")}
                  className="btn-festivo"
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

              <p className="text-sm text-[#e7e6e1]/80 mt-4 mb-4">
                Accedé a productos exclusivos para tus eventos más brillantes ✨
              </p>
            </>
          )}
        </div>

        {/* =========================================================
            CARRUSEL DE DESTACADOS
        ========================================================= */}
        {destacados?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="relative z-[3] w-full max-w-6xl mt-12 px-4 sm:px-6"
          >
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#ffcc33] mb-6">
              Destacados de la colección 💎
            </h2>

            <div className="relative">
              <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-[#3b3d45] to-transparent z-10" />
              <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-[#7d808c] to-transparent z-10" />

              <div
                ref={scrollRef}
                className="flex gap-6 overflow-x-auto scrollbar-none pb-4 snap-x snap-mandatory"
              >
                {destacados.map((p) => (
                  <motion.div
                    key={p.id}
                    whileHover={{ scale: 1.05 }}
                    className="card-glam min-w-[240px] sm:min-w-[280px] snap-start cursor-pointer group"
                    onClick={() => navigate(`/productos/${p.id}`)}
                  >
                    <div className="relative overflow-hidden rounded-t-[24px]">
                      <img
                        src={p.imagen}
                        alt={p.nombre}
                        className="w-full h-56 sm:h-64 object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.08]"
                        onError={(e) => {
                          e.currentTarget.src = logo_Yoquet; // fallback correcto
                        }}
                      />


                      <span
                        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-900"
                        style={{
                          background:
                            "linear-gradient(120deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.45) 45%, rgba(255,255,255,0) 100%)",
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

        {/* ====== FOOTER PROFESIONAL ====== */}
        <div className="relative z-[30] mt-20 mb-10 text-center text-white/70 text-xs">
          © {new Date().getFullYear()} Yoquet Diseños — Estilo que celebra 🎉
          <br />
          <span className="text-[10px] text-white/50 tracking-wide">
            Desarrollado con ❤️ por{" "}
            <span className="text-[#ffd85a] font-semibold">conurbaDEV</span>
          </span>
        </div>

        {/* ⭐ Firma visual conurbaDEV, fija y sutil */}
        <div className="fixed bottom-4 left-4 z-40 hidden xs:flex sm:flex items-center gap-2 px-3 py-1 conurba-chip text-[10px] uppercase tracking-[0.18em]">
          <span className="w-2 h-2 rounded-full bg-[#ffd85a] conurba-pulse-dot" />
          <span className="font-semibold text-white/80">conurbaDEV</span>
        </div>

      </motion.div>
    </>
  );
}
