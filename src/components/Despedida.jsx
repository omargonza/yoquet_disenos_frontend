import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import logoYoquet from "../assets_opt/optimized/logo_Yoquet.webp";

export default function Despedida() {
  const navigate = useNavigate();
  const fecha = useMemo(() => new Date().toLocaleDateString(), []);

  const handleShare = async () => {
    const text = "¡Compré en Yoquet Diseños! Cotillón artesanal hermoso.";
    const url = window.location.origin;

    // Web Share API (si existe). Si no, fallback a copiar.
    try {
      if (navigator.share) {
        await navigator.share({ title: "Yoquet Diseños", text, url });
        return;
      }
    } catch {
      // usuario canceló o no soportado: seguimos con fallback
    }

    try {
      await navigator.clipboard.writeText(url);
      // Si querés, podés disparar un toast acá (si lo usás en esta pantalla)
      alert("Link copiado para compartir.");
    } catch {
      alert("No se pudo copiar el link.");
    }
  };

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
              ¡Gracias por tu compra!
            </span>
          </h1>

          <p className="mt-2 text-sm sm:text-base" style={{ color: "var(--muted)", fontWeight: 700 }}>
            Pedido registrado el {fecha}. Si necesitás ayuda, escribinos y lo resolvemos rápido.
          </p>

          <div
            className="mt-6 p-5 rounded-3xl text-left"
            style={{
              background: "rgba(255,255,255,0.65)",
              border: "1px solid rgba(61,43,31,0.10)",
              color: "var(--text)",
            }}
          >
            <div className="text-sm font-extrabold">¿Qué sigue?</div>
            <ul className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text)" }}>
              <li>• Estamos preparando tu pedido con el máximo cuidado.</li>
              <li>• Te contactamos si falta algún dato de envío.</li>
              <li>• Mientras tanto, podés seguir viendo el catálogo.</li>
            </ul>
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
            Tip: si te gustó, compartí el link y ayudás a que Yoquet llegue a más personas.
          </div>

          <div className="mt-6 flex justify-center gap-3 flex-wrap">
            <button className="btn-yoquet" onClick={() => navigate("/productos")}>
              Seguir comprando
            </button>
            <button className="btn-yoquet-ghost" onClick={() => navigate("/carrito")}>
              Ver carrito
            </button>
            <button className="btn-yoquet-ghost" onClick={handleShare}>
              Compartir
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
