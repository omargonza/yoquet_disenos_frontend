import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import logoYoquet from "../assets_opt/optimized/logo_Yoquet.webp";

export default function Empaquetando() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate("/despedida", { replace: true }), 1400);
    return () => clearTimeout(timer);
  }, [navigate]);

  const fecha = useMemo(() => new Date().toLocaleDateString(), []);

  return (
    <main className="min-h-[calc(100vh-72px)]">
      <section className="container-yoquet pt-10 pb-14">
        <div className="card-yoquet p-7 sm:p-10 max-w-xl mx-auto text-center">
          <style>{`
            @keyframes yoquetBar {
              0% { transform: translateX(-65%); }
              100% { transform: translateX(0%); }
            }
            @keyframes yoquetPulse {
              0%,100% { transform: scale(1); }
              50% { transform: scale(1.03); }
            }
          `}</style>

          <img
            src={logoYoquet}
            alt="Yoquet Diseños"
            className="w-36 sm:w-44 mx-auto"
            loading="eager"
            decoding="async"
            style={{ animation: "yoquetPulse 1.6s ease-in-out infinite" }}
          />

          <h1 className="mt-6 text-3xl sm:text-4xl">
            <span
              style={{
                background:
                  "linear-gradient(90deg, var(--color-rosa), var(--color-dorado), var(--color-turquesa))",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              Empaquetando tu pedido
            </span>
          </h1>

          <p className="mt-2 text-sm sm:text-base" style={{ color: "var(--muted)", fontWeight: 700 }}>
            Cuidando cada detalle para que llegue perfecto. {fecha}
          </p>

          {/* Barra de progreso (CSS-only) */}
          <div
            className="mt-7 h-3 rounded-full overflow-hidden"
            style={{
              background: "rgba(61,43,31,0.10)",
              border: "1px solid rgba(61,43,31,0.10)",
            }}
          >
            <div
              className="h-full w-full"
              style={{
                background:
                  "linear-gradient(90deg, var(--color-rosa), var(--color-dorado), var(--color-turquesa))",
                animation: "yoquetBar 1.2s ease-in-out forwards",
              }}
            />
          </div>

          {/* “Confetti” sutil */}
          <div
            className="mt-6 p-4 rounded-3xl text-xs font-bold"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,102,179,0.10), rgba(255,216,90,0.10), rgba(66,226,184,0.10))",
              border: "1px solid rgba(61,43,31,0.10)",
              color: "var(--muted)",
            }}
          >
            Preparando tu comprobante y el estado del pedido…
          </div>

          <div className="mt-6 flex justify-center gap-3 flex-wrap">
            <button className="btn-yoquet" onClick={() => navigate("/despedida", { replace: true })}>
              Continuar
            </button>
            <button className="btn-yoquet-ghost" onClick={() => navigate("/productos")}>
              Volver al catálogo
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
