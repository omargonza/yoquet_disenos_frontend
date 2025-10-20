import { createContext, useContext, useEffect, useState } from "react";

const AmbientContext = createContext();

export function AmbientProvider({ children }) {
  const [theme, setTheme] = useState("morning");
  const [autoMode, setAutoMode] = useState(true);
  const [transitioning, setTransitioning] = useState(false);

  // 🎨 Paletas visuales según el ambiente
  const palette = {
    morning: { from: "#fff8e2", via: "#f9f0c3", to: "#e2c678" },
    afternoon: { from: "#f9d9c4", via: "#f6cfa8", to: "#d8a868" },
    night: { from: "#c5b389", via: "#9f8d5d", to: "#7f6e44" },
  };

  // 🕒 Detecta hora del día automáticamente
  useEffect(() => {
    if (!autoMode) return;
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) smoothSwitch("morning");
    else if (hour >= 12 && hour < 19) smoothSwitch("afternoon");
    else smoothSwitch("night");
  }, [autoMode]);

  // 🌅 Cambia el tema con fade visual global
  const smoothSwitch = (newTheme) => {
    if (newTheme === theme) return;
    setTransitioning(true);

    const current = palette[newTheme];
    const gradient = `linear-gradient(to bottom right, ${current.from}, ${current.via}, ${current.to})`;

    // fade visual suave aplicado al body global
    document.body.style.transition = "background 1.5s ease-in-out";
    document.body.style.background = gradient;

    setTimeout(() => {
      setTheme(newTheme);
      setTransitioning(false);
    }, 1500);
  };

  // 🎛 Cambio manual (desactiva auto)
  const switchTheme = (newTheme) => {
    setAutoMode(false);
    smoothSwitch(newTheme);
  };

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
      {children}
    </AmbientContext.Provider>
  );
}

export const useAmbient = () => useContext(AmbientContext);

/* ------------------------------------------------------------------ */
/* 💫 Hook de ayuda para sincronizar componentes con el ambiente */
export function useAmbientBackground(customClass = "") {
  const { palette, theme } = useAmbient();
  const colors = palette[theme];
  const background = `bg-gradient-to-br from-[${colors.from}] via-[${colors.via}] to-[${colors.to}]`;

  // devuelve la clase de fondo reactiva + personalizada
  return `${background} transition-all duration-700 ease-in-out ${customClass}`;
}
