import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

export default function SplashScreen({ onFinish }) {
  const canvasRef = useRef(null);

  // ✨ Partículas metálicas flotantes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const colors = [
      "rgba(255,215,120,0.3)",
      "rgba(255,102,179,0.25)",
      "rgba(66,226,184,0.25)",
      "rgba(180,220,250,0.2)",
    ];

    let particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = Array.from({ length: 40 }, () => ({
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

  // 🔄 Duración de la animación del splash
  useEffect(() => {
    const timer = setTimeout(() => onFinish?.(), 3000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#2b2d33] via-[#4a4c55] to-[#7d808c] overflow-hidden text-white font-[Poppins] z-[9999]"
    >
      {/* 🎨 Animaciones locales */}
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
        @keyframes pulseLight {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.08); }
        }
        @keyframes sweepGloss {
          0% { transform: translateX(-120%) skewX(-20deg); opacity: 0; }
          30% { opacity: 0.8; }
          100% { transform: translateX(120%) skewX(-20deg); opacity: 0; }
        }
      `}</style>

      {/* 🌈 Fondo con reflejos metálicos */}
      <div
        className="absolute inset-0 animate-[metalLux_18s_ease-in-out_infinite]"
        style={{
          backgroundImage: `
            linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(212,185,120,0.08) 40%, rgba(255,255,255,0.1) 70%, transparent 100%),
            radial-gradient(circle at 30% 30%, rgba(255,102,179,0.25), transparent 70%),
            radial-gradient(circle at 70% 70%, rgba(255,216,90,0.25), transparent 70%),
            radial-gradient(circle at 50% 90%, rgba(66,226,184,0.25), transparent 70%)
          `,
          backgroundSize: "250% 250%",
          mixBlendMode: "soft-light",
          filter: "blur(1.5px)",
        }}
      />

      {/* ✨ Partículas */}
      <canvas ref={canvasRef} className="absolute inset-0 -z-10 pointer-events-none" />

      {/* 💎 Logo principal */}
      <motion.img
        src="https://res.cloudinary.com/dfkyxmjnx/image/upload/v1730060034/yoquet/logo-yoquet-metalico.svg"
        alt="Yoquet Diseños"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: [1, 1.06, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
        className="w-44 sm:w-56 mb-8 drop-shadow-[0_0_25px_rgba(255,255,255,0.35)] animate-[pulseLight_3s_infinite]"
      />

      {/* 💫 Título animado */}
      <h1 className="relative text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-[linear-gradient(90deg,var(--color-rosa),var(--color-dorado),var(--color-turquesa))] bg-[length:200%_auto] animate-[metalLux_10s_ease-in-out_infinite] drop-shadow-[0_0_15px_rgba(0,0,0,0.4)]">
        Yoquet Diseños
        <span className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0),rgba(255,255,255,0.35),rgba(255,255,255,0))] animate-[sweepGloss_5s_infinite]" />
      </h1>

      {/* 🌟 Subtítulo */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 1 }}
        className="mt-6 text-[#ffd85a] text-lg tracking-wide font-medium"
      >
        Brillá en cada detalle ✨
      </motion.p>
    </motion.div>
  );
}
