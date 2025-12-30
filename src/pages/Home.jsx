import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import logoYoquet from "../assets_opt/optimized/logo_Yoquet.webp";

function safeText(v) {
  return String(v || "").replace(/</g, "").replace(/>/g, "").slice(0, 80);
}

function imgUrl(url) {
  if (!url || typeof url !== "string") return logoYoquet;
  const clean = url.replace(/["'<>]/g, "");
  // acepta absoluto o relativo
  if (clean.startsWith("http://") || clean.startsWith("https://") || clean.startsWith("/")) return clean;
  return logoYoquet;
}

export default function Home() {
  const navigate = useNavigate();
  const [destacados, setDestacados] = useState([]);
  const [loading, setLoading] = useState(true);

  const titulo = useMemo(() => "Cotillón artesanal, lindo y listo para celebrar", []);
  const subtitulo = useMemo(
    () => "Diseños premium para cumpleaños, eventos y sorpresas. Comprá rápido, sin vueltas.",
    []
  );

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const res = await api.get("/api/productos/destacados/", { timeout: 20000 });
        const data = res.data?.results || res.data || [];
        if (mounted) setDestacados(Array.isArray(data) ? data.slice(0, 10) : []);
      } catch {
        // silencioso
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => (mounted = false);
  }, []);

  return (
    <main className="min-h-[calc(100vh-72px)]">
      {/* HERO */}
      <section className="container-yoquet pt-10 sm:pt-14 pb-10">
        <div
          className="card-yoquet p-6 sm:p-10"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.94), rgba(255,255,255,0.84))",
          }}
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 text-center md:text-left">
              <img
                src={logoYoquet}
                alt="Yoquet Diseños"
                className="w-40 sm:w-44 mx-auto md:mx-0"
                loading="eager"
                decoding="async"
              />

              <h1 className="mt-5 text-4xl sm:text-5xl">
                <span
                  style={{
                    background: "linear-gradient(90deg, var(--color-rosa), var(--color-dorado), var(--color-turquesa))",
                    WebkitBackgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  Yoquet Diseños
                </span>
              </h1>

              <p className="mt-3 text-base sm:text-lg" style={{ color: "var(--muted)", fontWeight: 600 }}>
                {titulo}
              </p>
              <p className="mt-2 text-sm sm:text-base" style={{ color: "var(--muted)" }}>
                {subtitulo}
              </p>

              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                <button className="btn-yoquet" onClick={() => navigate("/productos")}>
                  Ver catálogo
                </button>
                <button className="btn-yoquet-ghost" onClick={() => navigate("/productos")}>
                  Mirar destacados
                </button>
              </div>

              {/* Confianza / micro-copy */}
              <div className="mt-5 text-xs sm:text-sm" style={{ color: "var(--muted)" }}>
                Envíos y coordinación por zona. Atención rápida. Catálogo grande, navegación liviana.
              </div>
            </div>

            {/* “Confetti” decorativo (0 peso real: solo CSS) */}
            <div className="w-full md:w-[360px]">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { t: "Cumpleaños", c: "rgba(255,102,179,0.14)" },
                  { t: "Souvenirs", c: "rgba(255,216,90,0.16)" },
                  { t: "Eventos", c: "rgba(66,226,184,0.16)" },
                  { t: "Personalizados", c: "rgba(139,92,246,0.14)" },
                ].map((x) => (
                  <div
                    key={x.t}
                    className="p-4 rounded-2xl"
                    style={{
                      background: x.c,
                      border: "1px solid rgba(61,43,31,0.10)",
                    }}
                  >
                    <div className="text-sm font-extrabold" style={{ color: "var(--text)" }}>
                      {x.t}
                    </div>
                    <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                      Ideas listas para festejar.
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DESTACADOS */}
      <section className="container-yoquet pb-14">
        <div className="flex items-end justify-between gap-3">
          <h2 className="text-2xl sm:text-3xl">Destacados</h2>
          <button className="btn-yoquet-ghost" onClick={() => navigate("/productos")}>
            Ver todo
          </button>
        </div>

        <div className="mt-5">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="card-yoquet p-3">
                  <div className="skeleton h-28 w-full" />
                  <div className="skeleton h-4 w-3/4 mt-3" />
                  <div className="skeleton h-4 w-1/2 mt-2" />
                </div>
              ))}
            </div>
          ) : destacados.length > 0 ? (
            <div className="flex gap-4 overflow-x-auto scrollbar-none pb-2">
              {destacados.map((p) => (
                <button
                  key={p.id}
                  onClick={() => navigate(`/productos/${p.id}`)}
                  className="card-yoquet text-left min-w-[210px] max-w-[210px] p-3"
                  style={{ transition: "transform .12s ease", cursor: "pointer" }}
                  onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.99)")}
                  onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  <img
                    src={imgUrl(p.imagen)}
                    alt={safeText(p.nombre)}
                    className="w-full h-36 object-cover rounded-2xl"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => (e.currentTarget.src = logoYoquet)}
                  />
                  <div className="mt-3">
                    <div className="font-extrabold text-sm truncate" style={{ color: "var(--text)" }}>
                      {safeText(p.nombre)}
                    </div>
                    <div className="font-extrabold mt-1" style={{ color: "var(--color-rosa)" }}>
                      ${p.precio}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="card-yoquet p-5" style={{ color: "var(--muted)" }}>
              No hay destacados por el momento.
            </div>
          )}
        </div>

        <div className="mt-10 text-center text-xs" style={{ color: "var(--muted)" }}>
          © {new Date().getFullYear()} Yoquet Diseños — Estilo que celebra.
        </div>
      </section>
    </main>
  );
}
