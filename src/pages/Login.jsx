import { useState, useRef, useEffect } from "react";
import { useToast } from "../context/ToastContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import logo_Yoquet from "../assets/logo_Yoquet.png";
import login from "../assets/login.jpg";

import axios from "axios";

export default function Login() {
  const { showToast } = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  const backendBase = (import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000")
    .replace(/\/$/, "");

  const backendURL = backendBase;

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

      showToast(`🎉 ¡Bienvenido, ${username || "artista"}!`, "celebration");
      showToast("Inicio de sesión exitoso", "success");

      setTimeout(() => navigate("/productos"), 1200);
    } catch (err) {
      console.error(err);
      setError("Usuario o contraseña incorrectos");
      showToast("Usuario o contraseña incorrectos", "error");
      setLoading(false);
    }
  };

  // ✨ Partículas festivas (mezcla de dorado, rosa y turquesa)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const colors = [
      "rgba(255, 216, 90, 0.35)", // dorado
      "rgba(255, 102, 179, 0.32)", // rosa
      "rgba(66, 226, 184, 0.32)",  // turquesa
      "rgba(255,255,255,0.20)",    // luz
    ];

    let particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = Array.from({ length: 48 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2.2 + 0.7,
        dx: (Math.random() - 0.5) * 0.35,
        dy: Math.random() * 0.25 + 0.08,
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
    <div className="flex flex-col md:flex-row min-h-screen relative overflow-hidden text-white bg-gradient-to-br from-[#1b1c1f] via-[#2d2f36] to-[#4b4d55]">

      {/* 🎨 ESTILOS FESTIVOS */}
      <style>{`
        :root {
          --color-rosa: #ff66b3;
          --color-dorado: #ffd85a;
          --color-turquesa: #42e2b8;
        }

        @keyframes metalGlow {
          0% { opacity: 0.45; transform: scale(1); }
          50% { opacity: 0.75; transform: scale(1.06); }
          100% { opacity: 0.45; transform: scale(1); }
        }

        @keyframes shineSweep {
          0% { transform: translateX(-130%) rotate(8deg); opacity: 0; }
          45% { opacity: 0.55; }
          100% { transform: translateX(140%) rotate(8deg); opacity: 0; }
        }

        .btn-festivo {
          @apply px-5 py-2 rounded-full font-semibold text-white shadow-md transition-all relative overflow-hidden;
          background: linear-gradient(90deg, var(--color-rosa), var(--color-dorado), var(--color-turquesa));
          background-size: 180% 180%;
          animation: metalGlow 5s ease-in-out infinite;
        }

        .btn-festivo::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, rgba(255,255,255,0), rgba(255,255,255,0.7), rgba(255,255,255,0));
          transform: translateX(-150%);
          animation: shineSweep 4s infinite;
        }
      `}</style>

      {/* ✨ CANVAS DE EFECTOS */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none -z-10" />

      {/* 🌈 HALOS FESTIVOS DETRÁS DEL LOGO */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.35 }}
        transition={{ duration: 1.2 }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,102,179,0.28),transparent_70%),radial-gradient(circle_at_75%_70%,rgba(255,216,90,0.28),transparent_70%),radial-gradient(circle_at_50%_90%,rgba(66,226,184,0.28),transparent_70%)] blur-3xl"
      />

      {/* 🔐 COLUMNA IZQUIERDA: FORMULARIO */}
      <div className="flex flex-col justify-center w-full md:w-1/2 px-8 sm:px-14 lg:px-20 py-12 bg-black/40 backdrop-blur-xl border-r border-white/10 relative z-10">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="w-full max-w-sm mx-auto"
        >

          {/* 🌟 LOGO FESTIVO */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-fit mx-auto mb-6"
          >
            {/* halo suave */}
            <div className="absolute -inset-6 rounded-full bg-[radial-gradient(circle,rgba(255,216,90,0.35),rgba(255,102,179,0.2),rgba(66,226,184,0.25),transparent)] blur-2xl animate-pulse" />

            <img
              src={logo_Yoquet}
              alt="Yoquet Logo"
              className="relative w-44 h-auto object-contain drop-shadow-[0_8px_24px_rgba(255,216,90,0.6)]"
            />
          </motion.div>

          {/* TÍTULO */}
          <h2 className="text-center text-3xl font-bold mb-2 bg-gradient-to-r from-[var(--color-dorado)] via-[var(--color-rosa)] to-[var(--color-turquesa)] bg-clip-text text-transparent animate-[metalGlow_10s_infinite]">
            ¡Bienvenido!
          </h2>
          <p className="text-center text-[#e4dccc] mb-6">
            Iniciá sesión para seguir creando 🎉
          </p>

          {/* FORMULARIO */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm mb-1 text-[#ffeccb] font-medium">Usuario</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 bg-[#1c1b1f]/60 border border-[#ffd85a]/40 rounded-md text-[#fffaf2] focus:ring-2 focus:ring-[var(--color-rosa)] outline-none placeholder-[#bfae95] text-sm"
                placeholder="usuario@ejemplo.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-[#ffeccb] font-medium">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-[#1c1b1f]/60 border border-[#ffd85a]/40 rounded-md text-[#fffaf2] focus:ring-2 focus:ring-[var(--color-rosa)] outline-none placeholder-[#bfae95] text-sm"
                placeholder="••••••••"
                required
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.96 }}
              type="submit"
              disabled={loading}
              className="btn-festivo w-full"
            >
              {loading ? "Cargando..." : "Iniciar Sesión ✨"}
            </motion.button>
          </form>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[#ff8fa3] bg-[#2b1a1d]/70 border border-[#ff66b3]/30 rounded-md text-sm text-center py-2 mt-4"
            >
              {error}
            </motion.p>
          )}

          <p className="text-center text-[#e9e4dc] text-sm mt-8">
            ¿Olvidaste tu contraseña?{" "}
            <span className="text-[var(--color-rosa)] cursor-pointer hover:text-[var(--color-dorado)]">
              Recuperar
            </span>
          </p>

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
      </div>

      {/* 🎨 COLUMNA DERECHA: IMAGEN */}
      <motion.div
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.1 }}
        className="hidden md:flex w-1/2 items-center justify-center relative overflow-hidden"
      >
        <img
          src={login}
          alt="Fondo"
          className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-screen"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-black/70 via-transparent to-black/70" />
      </motion.div>

    </div>
  );
}
