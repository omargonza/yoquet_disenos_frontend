import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import logoYoquet from "../assets_opt/optimized/logo_Yoquet.webp";

export default function Confirmacion() {
  const navigate = useNavigate();

  const fecha = useMemo(() => new Date().toLocaleDateString(), []);

  useEffect(() => {
    const timer = setTimeout(() => navigate("/empaquetando", { replace: true }), 1200);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <main className="min-h-[calc(100vh-72px)]">
      <section className="container-yoquet pt-10 pb-14">
        <div className="card-yoquet p-7 sm:p-10 max-w-xl mx-auto text-center">
          <img
            src={logoYoquet}
            alt="Yoquet Diseños"
            className="w-40 sm:w-44 mx-auto"
            loading="eager"
            decoding="async"
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
              Compra confirmada
            </span>
          </h1>

          <p className="mt-2 text-sm sm:text-base" style={{ color: "var(--muted)", fontWeight: 700 }}>
            Tu pedido se registró correctamente. Estamos preparando el comprobante.
          </p>

          <div
            className="mt-6 p-5 rounded-3xl text-left"
            style={{
              background: "rgba(255,255,255,0.65)",
              border: "1px dashed rgba(61,43,31,0.22)",
              color: "var(--text)",
            }}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-extrabold">Estado</div>
              <div className="text-sm font-extrabold" style={{ color: "var(--color-turquesa)" }}>
                Pagado ✓
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between gap-3">
              <div className="text-sm font-extrabold">Fecha</div>
              <div className="text-sm font-extrabold">{fecha}</div>
            </div>
          </div>

          <div
            className="mt-6 p-4 rounded-3xl text-xs font-bold"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,102,179,0.10), rgba(255,216,90,0.10), rgba(66,226,184,0.10))",
              border: "1px solid rgba(61,43,31,0.10)",
              color: "var(--muted)",
            }}
          >
            Redirigiendo a “Empaquetando”…
          </div>

          <div className="mt-6 flex justify-center gap-3 flex-wrap">
            <button className="btn-yoquet" onClick={() => navigate("/empaquetando", { replace: true })}>
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
