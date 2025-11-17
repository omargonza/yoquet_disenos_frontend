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
     Cargar destacados
  ========================================================= */
  useEffect(() => {
    const fetchDestacados = async () => {
      try {
        const res = await fetch(`${backendURL}/api/productos/destacados/`);
        const data = await res.json();
        setDestacados(data.results || data);
      } catch (err) {
        console.log("Error cargando destacados:", err);
      }
    };
    fetchDestacados();
  }, []);

  /* =========================================================
     Carrusel auto-scroll
  ========================================================= */
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let frame;
    const speed = 0.25;

    const anim = () => {
      el.scrollLeft += speed;
      if (el.scrollLeft >= el.scrollWidth - el.clientWidth) el.scrollLeft = 0;
      frame = requestAnimationFrame(anim);
    };

    frame = requestAnimationFrame(anim);

    return () => cancelAnimationFrame(frame);
  }, [destacados]);

  /* =========================================================
     Login + saludo según hora
  ========================================================= */
  useEffect(() => {
    const hora = new Date().getHours();
    if (hora < 12) setMensaje("🔥 Buenos días, el brillo arranca temprano");
    else if (hora < 18) setMensaje("💎 Buenas tardes, seguimos creando magia");
    else setMensaje("🌙 Buenas noches, el glamour no descansa");


  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/despedida");
  };

  /* =========================================================
     Fondo partículas metálicas
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

    let parts = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      parts = Array.from({ length: 32 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 0.6,
        dx: (Math.random() - 0.5) * 0.4,
        dy: Math.random() * 0.4 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      parts.forEach((p) => {
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
      {/* 🎊 Confetti metálico */}
      <Confetti
        width={width}
        height={height}
        numberOfPieces={70}
        recycle={false}
        gravity={0.2}
        colors={["#ff1d8e", "#ffcc33", "#00b8ff", "#ffffff", "#7b2cbf"]}
      />

      {/* =========================================================
         HOME
      ========================================================= */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative min-h-screen flex flex-col items-center justify-start 
        text-center px-6 sm:px-8 pt-24
        bg-gradient-to-br from-[#3b3d45] via-[#5c5f6a] to-[#7d808c] text-white overflow-hidden"
      >
        <style>{`
          :root {
            --color-rosa:#ff66b3;
            --color-dorado:#ffd85a;
            --color-turquesa:#42e2b8;
          }

          @keyframes gradientHome {
            0% { background-position: 0% 50%; }
            50% { background-position: 120% 50%; }
            100% { background-position: 0% 50%; }
          }

          .title-gloss::after {
            content:"";
            position:absolute;
            inset:0;
            background: linear-gradient(120deg, rgba(255,255,255,0) 30%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0));
            transform: translateX(-120%) skewX(-18deg);
            animation: glossRun 4.6s ease-in-out infinite 0.8s;
          }

          @keyframes glossRun {
            0% { transform: translateX(-120%); opacity: 0; }
            50% { transform: translateX(120%); opacity: .25; }
            100% { opacity:0; }
          }

          .btn-festivo {
            border-radius:9999px;
            padding:.8rem 2rem;
            font-weight:600;
            background:linear-gradient(90deg,var(--color-rosa),var(--color-dorado),var(--color-turquesa));
            color:#111;
            box-shadow:0 0 16px rgba(255,216,90,0.55);
            transition:transform .25s ease;
          }

          .btn-festivo:hover { transform:scale(1.05); }

          .btn-outline-festivo {
            border:2px solid var(--color-dorado);
            color:var(--color-dorado);
            padding:.8rem 2rem;
            border-radius:9999px;
            font-weight:600;
          }
          .btn-outline-festivo:hover {
            background:rgba(255,216,90,0.15);
            color:#111;
          }

          .card-glam {
            background:rgba(255,255,255,0.06);
            border:1px solid rgba(255,204,51,0.15);
            border-radius:24px;
            backdrop-filter:blur(10px);
            transition:.35s;
          }
          .card-glam:hover {
            transform:translateY(-5px) scale(1.04);
            border-color:rgba(255,204,51,0.45);
          }
        `}</style>

        {/* Partículas */}
        <canvas ref={canvasRef} className="absolute inset-0 -z-10" />

        {/* ======================================================
            HERO (centrado)
        ====================================================== */}
        <div className="relative z-[3] w-full max-w-4xl mx-auto flex flex-col items-center text-center">
          {/* LOGO */}
          <motion.img
            src={logo_Yoquet}
            className="w-44 sm:w-52 drop-shadow-[0_8px_24px_rgba(255,216,90,0.75)] mb-8"
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          />

          {/* TÍTULO */}
          <motion.h1
            initial={{ y: 25, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="title-gloss relative 
              text-4xl sm:text-5xl md:text-6xl font-bold mb-3 
              text-transparent bg-clip-text 
              bg-gradient-to-r from-[#ff1d8e] via-[#ffcc33] to-[#00b8ff]
              bg-[length:220%_auto] animate-[gradientHome_10s_ease_infinite]"
          >
            Yoquet Diseños
          </motion.h1>

          <motion.p
            className="text-[#ffcc33] text-lg max-w-xl mx-auto mb-8 font-medium"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            🎉 Cotillón Premium — Color, Estilo y Brillo en Cada Detalle ✨
          </motion.p>

          {/* BOTONES PRINCIPALES (SIEMPRE MOSTRAR CATÁLOGO) */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/productos")}
              className="btn-festivo"
            >
              Ir al Catálogo 🛍️
            </motion.button>

          
          </div>

        </div>

        {/* ======================================================
            DESTACADOS CENTRADOS
        ====================================================== */}
        {destacados.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="relative z-[3] w-full max-w-5xl mt-16 px-4 sm:px-6 
            flex flex-col items-center text-center"
          >
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#ffcc33] mb-8 text-center">
              Destacados de la colección 💎
            </h2>

            <div className="relative w-full">
              <div
                ref={scrollRef}
                className="flex gap-6 overflow-x-auto scrollbar-none pb-4 snap-x snap-mandatory"
              >
                {destacados.map((p) => (
                  <motion.div
                    key={p.id}
                    whileHover={{ scale: 1.05 }}
                    className="card-glam min-w-[240px] sm:min-w-[280px] snap-start mx-auto cursor-pointer group"
                    onClick={() => navigate(`/productos/${p.id}`)}
                  >
                    <div className="relative overflow-hidden rounded-t-[24px]">
                      <img
                        src={p.imagen}
                        alt={p.nombre}
                        className="w-full h-56 sm:h-64 object-cover transition-transform duration-[900ms] group-hover:scale-[1.08]"
                        onError={(e) => (e.currentTarget.src = logo_Yoquet)}
                      />
                    </div>

                    <div className="p-4 text-left">
                      <h3 className="text-[#ffcc33] font-semibold line-clamp-1">
                        {p.nombre}
                      </h3>
                      <p className="text-[#ff1d8e] font-medium mt-1">${p.precio}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ======================================================
           FOOTER CENTRADO
        ====================================================== */}
        <div className="relative z-[30] mt-28 mb-10 text-center text-white/70 text-xs flex flex-col items-center">
          © {new Date().getFullYear()} Yoquet Diseños — Estilo que celebra 🎉
          <br />
          <span className="text-[10px] text-white/50 tracking-wide">
            Desarrollado con ❤️ por{" "}
            <span className="text-[#ffd85a] font-semibold">conurbaDEV</span>
          </span>
        </div>

        {/* CHIP conurbaDEV centrado abajo */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 
        hidden xs:flex sm:flex items-center gap-2 px-3 py-1 conurba-chip 
        text-[10px] uppercase tracking-[0.18em]">
          <span className="w-2 h-2 rounded-full bg-[#ffd85a] conurba-pulse-dot" />
          <span className="font-semibold text-white/80">conurbaDEV</span>
        </div>
      </motion.div>
    </>
  );
}
