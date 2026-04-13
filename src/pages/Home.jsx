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
            {/* Hero - limpio, elegante, vendedor */}
            <section className="container-yoquet pt-8 sm:pt-12 pb-8">
                <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: "var(--border-soft)" }}>
                    <div className="flex flex-col lg:flex-row">
                        {/* Contenido del hero */}
                        <div className="flex-1 p-6 sm:p-10 lg:p-12">
                            <div className="max-w-lg">
                                <img
                                    src={logoYoquet}
                                    alt="Yoquet Diseños"
                                    className="h-12 w-12 mb-6"
                                    loading="eager"
                                    decoding="async"
                                />

                                <h1 className="text-3xl sm:text-4xl lg:text-5xl leading-tight mb-4" style={{ fontFamily: '"Playfair Display", serif' }}>
                                    <span style={{ color: "var(--text-primary)" }}>
                                        Yoquet Diseños
                                    </span>
                                </h1>

                                <p className="text-base sm:text-lg mb-2" style={{ color: "var(--text-secondary)", fontWeight: 500 }}>
                                    {titulo}
                                </p>
                                <p className="text-sm sm:text-base mb-6" style={{ color: "var(--text-secondary)" }}>
                                    {subtitulo}
                                </p>

                                <div className="flex flex-col sm:flex-row gap-3">
                                    <button className="btn-yoquet" onClick={() => navigate("/productos")}>
                                        Ver catálogo
                                    </button>
                                </div>

                                <p className="mt-6 text-xs" style={{ color: "var(--text-secondary)" }}>
                                    Envíos por zona • Atención rápida • Productos únicos
                                </p>
                            </div>
                        </div>

                        {/* Imagen decorativa - categorías */}
                        <div className="w-full lg:w-[380px] p-6 lg:p-8" style={{ background: "var(--surface-soft)" }}>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { t: "Cumpleaños", c: "rgba(232, 93, 147, 0.08)" },
                                    { t: "Souvenirs", c: "rgba(243, 200, 106, 0.15)" },
                                    { t: "Eventos", c: "rgba(255, 138, 122, 0.12)" },
                                    { t: "Personalizados", c: "rgba(122, 70, 106, 0.08)" },
                                ].map((x) => (
                                    <div
                                        key={x.t}
                                        className="p-4 rounded-lg"
                                        style={{
                                            background: x.c,
                                            border: "1px solid var(--border-soft)",
                                        }}
                                    >
                                        <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                                            {x.t}
                                        </div>
                                        <div className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
                                            Ver productos
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Destacados */}
            <section className="container-yoquet pb-12">
                <div className="flex items-end justify-between gap-3 mb-5">
                    <h2 className="text-2xl">Destacados</h2>
                    <button className="btn-yoquet-ghost text-sm" onClick={() => navigate("/productos")}>
                        Ver todo
                    </button>
                </div>

                <div>
                    {loading ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="card-yoquet">
                                    <div className="skeleton h-28 sm:h-36 w-full rounded-t-lg" />
                                    <div className="p-3 space-y-2">
                                        <div className="skeleton h-4 w-3/4" />
                                        <div className="skeleton h-3 w-1/3" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : destacados.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                            {destacados.map((p) => (
                                <button
                                    key={p.id}
                                    onClick={() => navigate(`/productos/${p.id}`)}
                                    className="card-yoquet flex flex-col group"
                                >
                                    <div className="relative aspect-[4/5] overflow-hidden rounded-t-xl">
                                        <img
                                            src={imgUrl(p.imagen)}
                                            alt={safeText(p.nombre)}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            loading="lazy"
                                            decoding="async"
                                            onError={(e) => (e.currentTarget.src = logoYoquet)}
                                        />
                                    </div>
                                    <div className="p-4 flex flex-col flex-1">
                                        <div className="text-sm font-medium line-clamp-2 leading-tight" style={{ color: "var(--text-primary)" }}>
                                            {safeText(p.nombre)}
                                        </div>
                                        <div className="mt-auto pt-4 flex items-center justify-between gap-3">
                                            <span className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
                                                ${p.precio}
                                            </span>
                                            <span className="text-xs font-medium" style={{ color: "var(--color-rosa)" }}>
                                                Ver más
                                            </span>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="card-yoquet p-6 text-center" style={{ color: "var(--text-secondary)" }}>
                            No hay destacados por el momento.
                        </div>
                    )}
                </div>

                <div className="mt-12 text-center text-xs" style={{ color: "var(--text-secondary)" }}>
                    © {new Date().getFullYear()} Yoquet Diseños — Estilo que celebra
                </div>
            </section>
        </main>
    );
}