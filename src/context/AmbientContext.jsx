import { createContext, useContext, useState, useEffect } from "react";

const AmbientContext = createContext();

/**
 * 🌈 AmbientProvider versión ULTRA LIVIANA
 * - Solo mantiene un tema fijo "festival"
 * - Cambia el fondo general del body
 * - No tiene partículas, ni cálculos por hora
 * - 100% seguro y sin consumo extra
 */
export function AmbientProvider({ children }) {
  const theme = "festival";

  const palette = {
    festival: {
      from: "#633cff",  // violeta eléctrico
      via: "#ff66b3",   // rosa premium
      to: "#ffd85a",    // dorado suave
      glow: "rgba(255,105,180,0.35)",
    },
  };

  // Aplicar el fondo cuando carga la app
  useEffect(() => {
    const { from, via, to, glow } = palette.festival;

    const gradient = `linear-gradient(135deg, ${from}, ${via}, ${to})`;

    document.body.style.background = gradient;
    document.body.style.backgroundAttachment = "fixed";
    document.body.style.backgroundSize = "cover";
    document.body.style.boxShadow = `inset 0 0 120px ${glow}`;
    document.body.style.transition =
      "background 1.2s ease-in-out, box-shadow 1s ease";

    return () => {
      // Limpieza opcional si alguna vez cambiás diseño
      document.body.style.background = "";
      document.body.style.boxShadow = "";
    };
  }, []);

  return (
    <AmbientContext.Provider value={{ theme, palette }}>
      {children}
    </AmbientContext.Provider>
  );
}

export const useAmbient = () => useContext(AmbientContext);

/** Hook auxiliar para fondos basados en la paleta */
export function useAmbientBackground(extra = "") {
  const { palette } = useAmbient();
  const { from, via, to } = palette.festival;

  return `bg-gradient-to-br from-[${from}] via-[${via}] to-[${to}] ${extra}`;
}
