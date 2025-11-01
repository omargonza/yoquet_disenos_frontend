import { createContext, useContext, useEffect, useState } from "react";

const AmbientContext = createContext();

export function AmbientProvider({ children }) {
  const [theme, setTheme] = useState("morning");
  const [autoMode, setAutoMode] = useState(true);
  const [transitioning, setTransitioning] = useState(false);
  const [particles, setParticles] = useState([]);

  // 🎨 Paleta de colores Yoquet Premium
  const palette = {
    morning: { from: "#fdf9ec", via: "#f7e9b8", to: "#f1d77d", glow: "rgba(255,240,180,0.25)" },
    afternoon: { from: "#fde3da", via: "#f6cfa8", to: "#e2a26d", glow: "rgba(255,197,120,0.25)" },
    night: { from: "#3b3d45", via: "#5c5f6a", to: "#7d808c", glow: "rgba(120,120,130,0.3)" },
    festival: { from: "#ff66b3", via: "#ffd85a", to: "#42e2b8", glow: "rgba(255,216,90,0.4)" },
  };

  // 🕒 Detección automática
  useEffect(() => {
    if (!autoMode || theme === "festival") return;
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) smoothSwitch("morning");
    else if (hour >= 12 && hour < 19) smoothSwitch("afternoon");
    else smoothSwitch("night");
  }, [autoMode]);

  // ✨ Cambio con transición
  const smoothSwitch = (newTheme) => {
    if (newTheme === theme) return;
    setTransitioning(true);

    const current = palette[newTheme];
    const gradient = `linear-gradient(135deg, ${current.from}, ${current.via}, ${current.to})`;

    document.body.style.transition =
      "background 1.8s ease-in-out, box-shadow 1.2s ease, color 1s ease";
    document.body.style.background = gradient;
    document.body.style.backgroundAttachment = "fixed";
    document.body.style.backgroundSize = "cover";
    document.body.style.boxShadow = `inset 0 0 120px ${current.glow}`;
    document.body.style.filter = "brightness(1.05) contrast(1.1)";

    if (newTheme === "festival") {
      document.body.style.animation = "festivalGlow 8s ease-in-out infinite alternate";
      startParticles();
    } else {
      document.body.style.animation = "none";
      stopParticles();
    }

    setTimeout(() => {
      setTheme(newTheme);
      setTransitioning(false);
    }, 1500);
  };

  const switchTheme = (newTheme) => {
    setAutoMode(false);
    smoothSwitch(newTheme);
  };

  /* -------------------------------------------------- */
  /* 🌠 Partículas luminosas flotantes e interactivas */
  const startParticles = () => {
    if (particles.length > 0) return;
    const newParticles = Array.from({ length: 40 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 3 + 1,
      color: ["#ff66b3", "#ffd85a", "#42e2b8", "#8b5cf6"][Math.floor(Math.random() * 4)],
      speed: Math.random() * 0.6 + 0.3,
      dx: (Math.random() - 0.5) * 0.6,
      dy: (Math.random() - 0.5) * 0.4,
    }));
    setParticles(newParticles);
  };

  const stopParticles = () => setParticles([]);

  // ✨ Movimiento constante
  useEffect(() => {
    if (particles.length === 0) return;
    let frame;
    const animate = () => {
      setParticles((prev) =>
        prev.map((p) => {
          let x = p.x + p.dx;
          let y = p.y + p.dy;
          if (y > window.innerHeight) y = -5;
          if (y < -5) y = window.innerHeight;
          if (x < 0) x = window.innerWidth;
          if (x > window.innerWidth) x = 0;
          return { ...p, x, y };
        })
      );
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [particles.length]);

  // 💥 Interacción: dispersión al hacer clic
  useEffect(() => {
    if (theme !== "festival") return;

    const handleClick = (e) => {
      const { clientX, clientY } = e;
      const burst = Array.from({ length: 10 }, () => ({
        x: clientX,
        y: clientY,
        size: Math.random() * 3 + 2,
        color: ["#ff66b3", "#ffd85a", "#42e2b8", "#8b5cf6"][Math.floor(Math.random() * 4)],
        dx: (Math.random() - 0.5) * 8,
        dy: (Math.random() - 0.5) * 8,
        opacity: 1,
      }));
      setParticles((prev) => [...prev, ...burst]);
      setTimeout(() => setParticles((prev) => prev.slice(0, 40)), 800);
    };

    const handleMouseMove = (e) => {
      // pequeñas luces que siguen el cursor
      const { clientX, clientY } = e;
      const trail = {
        x: clientX,
        y: clientY,
        size: Math.random() * 4 + 2,
        color: ["#ffd85a", "#ff66b3", "#42e2b8"][Math.floor(Math.random() * 3)],
        dx: 0,
        dy: 0.5,
        fade: true,
      };
      setParticles((prev) => [...prev.slice(-50), trail]);
    };

    window.addEventListener("click", handleClick);
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("click", handleClick);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [theme]);

  return (
    <AmbientContext.Provider
      value={{
        theme,
        palette,
        switchTheme,
        autoMode,
        setAutoMode,
        transitioning,
      }}
    >
      {/* 💫 Animación de fondo del modo festival */}
      <style>{`
        @keyframes festivalGlow {
          0% { filter: hue-rotate(0deg) brightness(1.05) saturate(1.2); }
          25% { filter: hue-rotate(45deg) brightness(1.1) saturate(1.3); }
          50% { filter: hue-rotate(90deg) brightness(1.15) saturate(1.4); }
          75% { filter: hue-rotate(180deg) brightness(1.1) saturate(1.3); }
          100% { filter: hue-rotate(360deg) brightness(1.05) saturate(1.2); }
        }
      `}</style>

      {/* 🌠 Render de partículas luminosas */}
      {theme === "festival" && (
        <div
          className="fixed inset-0 pointer-events-none z-[1] overflow-hidden"
          style={{ mixBlendMode: "screen" }}
        >
          {particles.map((p, i) => (
            <div
              key={i}
              className="absolute rounded-full blur-[2px]"
              style={{
                left: `${p.x}px`,
                top: `${p.y}px`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                backgroundColor: p.color,
                opacity: p.opacity ?? 0.7,
                boxShadow: `0 0 12px ${p.color}`,
                transform: `translate(-50%, -50%)`,
                transition: "opacity 0.8s ease-out",
              }}
            />
          ))}
        </div>
      )}

      {children}
    </AmbientContext.Provider>
  );
}

export const useAmbient = () => useContext(AmbientContext);

/* 🎨 Hook auxiliar para fondos dinámicos */
export function useAmbientBackground(extraClass = "") {
  const { palette, theme } = useAmbient();
  const { from, via, to } = palette[theme];
  return `bg-gradient-to-br from-[${from}] via-[${via}] to-[${to}] transition-all duration-700 ease-in-out ${extraClass}`;
}
