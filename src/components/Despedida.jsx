import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";

export default function Despedida() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [countdown, setCountdown] = useState(6);
  const [closing, setClosing] = useState(false);
  const canvasRef = useRef(null);

  const backendURL =
    import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000";

  useEffect(() => {
    showToast("Gracias por elegir Yoquet Diseños 💎", "celebration");

    const timer = setInterval(
      () => setCountdown((prev) => (prev > 0 ? prev - 1 : 0)),
      1000
    );

    const startClosing = setTimeout(() => setClosing(true), 5200);
    const redirect = setTimeout(() => navigate("/"), 6000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirect);
      clearTimeout(startClosing);
    };
  }, [navigate]);

  // ✨ Fondo de partículas metálicas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const colors = [
      "rgba(255,102,179,0.25)",
      "rgba(255,216,90,0.25)",
      "rgba(66,226,184,0.25)",
      "rgba(255,255,255,0.2)",
    ];
    let particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = Array.from({ length: 30 }, () => ({
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden text-white font-[Poppins] bg-gradient-to-br from-[#2b2d33] via-[#4a4c55] to-[#7d808c]"
    >
      {/* 🎨 Animaciones base */}
      <style>{`
        :root {
          --color-rosa: #ff66b3;
          --color-dorado: #ffd85a;
          --color-turquesa: #42e2b8;
        }
        @keyframes metalLux {
          0% { background-position: 0% 50%; opacity: 0.55; }
          50% { background-position: 100% 50%; opacity: 0.9; }
          100% { background-position: 0% 50%; opacity: 0.55; }
        }
        @keyframes aurora {
          0% { transform: translate(0,0) scale(1); opacity: 0.25; }
          50% { transform: translate(20px,-15px) scale(1.2); opacity: 0.35; }
          100% { transform: translate(0,0) scale(1); opacity: 0.25; }
        }
        @keyframes sweepGloss {
          0% { transform: translateX(-120%) skewX(-20deg); opacity: 0; }
          30% { opacity: 0.7; }
          100% { transform: translateX(120%) skewX(-20deg); opacity: 0; }
        }
        @media (max-width: 640px) {
          h1 { font-size: 1.8rem !important; }
          p { font-size: 0.95rem !important; }
        }
      `}</style>

      {/* 🌌 Fondo metalizado */}
      <div
        className="absolute inset-0 pointer-events-none mix-blend-overlay animate-[metalLux_18s_ease-in-out_infinite]"
        style={{
          backgroundImage: `
            linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(212,185,120,0.08) 40%, rgba(255,255,255,0.1) 70%, transparent 100%),
            radial-gradient(circle at 25% 25%, rgba(255,255,255,0.18) 0%, transparent 60%),
            radial-gradient(circle at 80% 70%, rgba(255,255,255,0.12) 0%, transparent 70%)
          `,
          backgroundSize: "250% 250%",
          filter: "blur(2px)",
        }}
      ></div>

      {/* 🌈 Auras */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[50vw] h-[50vw] top-[10%] left-[15%] rounded-full bg-[radial-gradient(circle,rgba(255,216,90,0.2)_0%,transparent_70%)] animate-[aurora_22s_ease-in-out_infinite]" />
        <div className="absolute w-[40vw] h-[40vw] bottom-[10%] right-[10%] rounded-full bg-[radial-gradient(circle,rgba(255,102,179,0.25)_0%,transparent_70%)] animate-[aurora_25s_ease-in-out_infinite_reverse]" />
        <div className="absolute w-[35vw] h-[35vw] bottom-[25%] left-[40%] rounded-full bg-[radial-gradient(circle,rgba(66,226,184,0.25)_0%,transparent_70%)] animate-[aurora_27s_ease-in-out_infinite]" />
      </div>

      {/* ✨ Partículas */}
      <canvas ref={canvasRef} className="absolute inset-0 -z-10 pointer-events-none" />

      {/* 💎 Logo */}
      <motion.img
        src="https://res.cloudinary.com/dfkyxmjnx/image/upload/v1730060034/yoquet/logo-yoquet-metalico.svg"
        alt="Yoquet Diseños"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: [1, 1.05, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
        className="w-32 sm:w-40 mb-6 drop-shadow-[0_0_25px_rgba(255,255,255,0.25)]"
      />

      {/* 🕊️ Mensaje */}
      <motion.h1
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-[linear-gradient(90deg,var(--color-rosa),var(--color-dorado),var(--color-turquesa))] bg-[length:200%_auto] animate-[metalLux_10s_ease-in-out_infinite] drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] mb-4"
      >
        ¡Gracias por tu visita!
        <span className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0),rgba(255,255,255,0.35),rgba(255,255,255,0))] animate-[sweepGloss_6s_infinite]" />
      </motion.h1>

      <motion.p
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 1 }}
        className="text-[#e9e4d4] text-lg max-w-lg mb-10 leading-relaxed"
      >
        En cada diseño hay un gesto, una historia, una emoción.
        <span className="block mt-2 text-[#ffd85a] font-medium italic">
          Gracias por formar parte de este arte cotidiano 🌟
        </span>
      </motion.p>

      {/* 🪩 Botón volver */}
      <motion.button
        whileHover={{
          scale: 1.07,
          boxShadow: "0 0 25px rgba(255,216,90,0.4)",
          backgroundPosition: "100%",
        }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/")}
        className="relative px-10 py-3 bg-gradient-to-r from-[#ff66b3] via-[#ffd85a] to-[#42e2b8] bg-[length:200%_auto] text-[#181818] font-semibold rounded-full shadow-[0_4px_20px_rgba(255,216,90,0.3)] transition-all duration-500"
      >
        <motion.div
          initial={{ opacity: 0.3, scale: 0.9 }}
          animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.9, 1.05, 0.9] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute w-[180px] h-[180px] rounded-full bg-[#ffd85a]/20 blur-2xl -z-10"
        />
        Volver al inicio ✨
      </motion.button>

      {/* ⏳ Cuenta regresiva */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-sm text-[#d0c5a7] mt-8 italic"
      >
        Serás redirigido en{" "}
        <motion.span
          animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="text-[#ffd85a] font-semibold"
        >
          {countdown}
        </motion.span>{" "}
        segundos...
      </motion.p>

      <AnimateClosing active={closing} />
    </motion.div>
  );
}

// 🌟 Cortina brillante de cierre
function AnimateClosing({ active }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: active ? 1 : 0 }}
      transition={{ duration: 1.2, ease: "easeInOut" }}
      className="fixed inset-0 pointer-events-none z-[999] overflow-hidden"
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: active ? "0%" : "100%" }}
        transition={{ duration: 1.4, ease: [0.77, 0, 0.175, 1] }}
        className="absolute inset-0 bg-[linear-gradient(135deg,#2b2d33,#4a4c55,#7d808c)]"
      >
        <motion.div
          initial={{ x: "-60%", opacity: 0 }}
          animate={{ x: "160%", opacity: [0.1, 0.8, 0] }}
          transition={{ duration: 1.2, ease: "easeInOut", delay: 0.2 }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          style={{
            mixBlendMode: "soft-light",
            transform: "skewX(-25deg)",
          }}
        />
      </motion.div>
    </motion.div>
  );
}
