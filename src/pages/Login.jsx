import { useState, useRef, useEffect } from "react";
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
  const navigate = useNavigate();
  const canvasRef = useRef(null);

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
      showToast(`¡Bienvenido de nuevo, ${username || "artista"}!`, "celebration");
      showToast("Inicio de sesión exitoso", "success");
      setTimeout(() => navigate("/productos"), 2000);
    } catch (err) {
      console.error(err);
      setError("Usuario o contraseña incorrectos");
      showToast("Usuario o contraseña incorrectos", "error");
      setLoading(false);
    }
  };

  // 🌌 Partículas metálicas del fondo
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
      particles = Array.from({ length: 35 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 0.5,
        dx: (Math.random() - 0.5) * 0.4,
        dy: Math.random() * 0.4 + 0.1,
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
    <div className="flex flex-col md:flex-row min-h-screen relative overflow-hidden text-white bg-gradient-to-br from-[#2b2d33] via-[#4a4c55] to-[#7d808c]">
      {/* 🎨 Estilos locales */}
      <style>{`
        :root{
          --color-rosa:#ff66b3;
          --color-dorado:#ffd85a;
          --color-turquesa:#42e2b8;
        }
        @keyframes metalLux {
          0% { background-position: 0% 50%; opacity: 0.6; }
          50% { background-position: 100% 50%; opacity: 0.9; }
          100% { background-position: 0% 50%; opacity: 0.6; }
        }
        @keyframes sweepGloss {
          0% { transform: translateX(-120%) skewX(-15deg); opacity: 0; }
          50% { opacity: 0.3; }
          100% { transform: translateX(120%) skewX(-15deg); opacity: 0; }
        }
        .btn-festivo {
          @apply px-5 py-2 rounded-full font-semibold text-white shadow-md transition-all relative overflow-hidden;
          background: linear-gradient(90deg, var(--color-rosa), var(--color-dorado), var(--color-turquesa));
        }
        .btn-festivo:hover { transform: scale(1.05); box-shadow: 0 6px 16px rgba(0,0,0,0.15); }
      `}</style>

      {/* ✨ Overlay metálico */}
      <div
        className="absolute inset-0 pointer-events-none mix-blend-overlay animate-[metalLux_18s_ease-in-out_infinite]"
        style={{
          backgroundImage: `
            linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(212,185,120,0.08) 40%, rgba(255,255,255,0.1) 70%, transparent 100%),
            radial-gradient(circle at 35% 25%, rgba(255,255,255,0.18) 0%, transparent 60%),
            radial-gradient(circle at 80% 70%, rgba(255,255,255,0.1) 0%, transparent 70%)
          `,
          backgroundSize: "250% 250%",
          filter: "blur(2px)",
        }}
      />

      {/* ✨ Partículas metálicas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none -z-10" />

      {/* 🌈 Halos coloridos sutiles */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 1.2 }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,102,179,0.35),transparent_70%),radial-gradient(circle_at_80%_70%,rgba(255,216,90,0.35),transparent_70%),radial-gradient(circle_at_50%_90%,rgba(66,226,184,0.35),transparent_70%)] blur-3xl"
      />

      {/* 📄 Columna izquierda: Formulario */}
      <div className="flex flex-col justify-center w-full md:w-1/2 px-8 sm:px-14 lg:px-20 py-12 bg-black/50 backdrop-blur-lg border-r border-white/10 relative z-10">
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
          <h2 className="relative text-center text-3xl font-bold mb-1 text-transparent bg-clip-text bg-[linear-gradient(90deg,var(--color-rosa),var(--color-dorado),var(--color-turquesa))] bg-[length:200%_auto] animate-[metalLux_10s_ease-in-out_infinite] drop-shadow-[0_4px_14px_rgba(0,0,0,0.25)]">
            Iniciá sesión
            <span className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0),rgba(255,255,255,0.35),rgba(255,255,255,0))] animate-[sweepGloss_4s_infinite]" />
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
              className="btn-festivo w-full justify-center"
            >
              {loading ? "Cargando..." : "Iniciar Sesión 🔐"}
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

      {/* 🎨 COLUMNA DERECHA */}
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
