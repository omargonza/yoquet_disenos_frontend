import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import logo_Yoquet from "../assets_opt/optimized/logo_Yoquet.webp";

export default function Home() {
  const navigate = useNavigate();
  const [destacados, setDestacados] = useState([]);
  const scrollRef = useRef(null);

  const backendURL =
    (import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000").replace(
      /\/$/,
      ""
    );

  /* =============================================================
     1) Cargar Destacados (sin efectos)
  ============================================================= */
  useEffect(() => {
    const fetchDestacados = async () => {
      try {
        const res = await fetch(`${backendURL}/api/productos/destacados/`);
        const data = await res.json();
        setDestacados(data.results || data);
      } catch (err) {
        console.error("Error cargando destacados:", err);
      }
    };
    fetchDestacados();
  }, []);

  /* =============================================================
     2) Carrusel auto-scroll ULTRA liviano
  ============================================================= */
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let frame;
    const speed = 0.15;

    const anim = () => {
      el.scrollLeft += speed;
      if (el.scrollLeft >= el.scrollWidth - el.clientWidth) el.scrollLeft = 0;
      frame = requestAnimationFrame(anim);
    };

    frame = requestAnimationFrame(anim);
    return () => cancelAnimationFrame(frame);
  }, [destacados]);

  /* =============================================================
     UI PRINCIPAL — Versión ULTRA-LIVIANA
  ============================================================= */
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
      className="min-h-screen flex flex-col items-center 
                 text-center px-6 sm:px-8 pt-20 
                 bg-[#1d1e22] text-white overflow-hidden"
    >
      {/* =========================================================
          ESTILOS OPTIMIZADOS (sin gradientes complejos)
      ========================================================= */}
      <style>{`
        :root {
          --rosa: #ff66b3;
          --dorado: #ffd85a;
          --turquesa: #42e2b8;
        }

        .btn-festivo {
          padding: 0.8rem 2rem;
          border-radius: 9999px;
          font-weight: 600;
          color: #111;
          background: linear-gradient(90deg, var(--rosa), var(--dorado), var(--turquesa));
          transition: 0.25s ease;
        }

        .btn-festivo:hover {
          transform: scale(1.05);
        }

        .card {
          background: #ffffff10;
          border: 1px solid #ffffff22;
          border-radius: 20px;
          backdrop-filter: blur(6px);
          transition: 0.35s ease;
        }

        .card:hover {
          transform: translateY(-5px) scale(1.03);
          border-color: #ffd85a55;
        }
      `}</style>

      {/* =========================================================
          HERO
      ========================================================= */}
      <motion.img
        src={logo_Yoquet}
        className="w-44 sm:w-52 drop-shadow-[0_5px_16px_rgba(255,216,90,0.6)] mb-6"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      />

      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-4xl sm:text-5xl font-bold bg-gradient-to-r 
                   from-[var(--rosa)] via-[var(--dorado)] to-[var(--turquesa)]
                   bg-clip-text text-transparent mb-3"
      >
        Yoquet Diseños
      </motion.h1>

      <p className="text-[#ffd85a] text-lg max-w-xl mx-auto mb-8">
        🎉 Cotillón Premium — Color, Estilo y Brillo en Cada Detalle ✨
      </p>

      {/* =========================================================
          BOTÓN CATÁLOGO
      ========================================================= */}
      <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={() => navigate("/productos")}
        className="btn-festivo mt-4"
      >
        Ir al Catálogo 🛍️
      </motion.button>

      {/* =========================================================
          DESTACADOS
      ========================================================= */}
      {destacados.length > 0 && (
        <div className="w-full max-w-5xl mt-16">
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#ffd85a] mb-6">
            Destacados 💎
          </h2>

          <div className="relative">
            <div
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto scrollbar-none pb-4"
            >
              {destacados.map((p) => (
                <div
                  key={p.id}
                  onClick={() => navigate(`/productos/${p.id}`)}
                  className="card cursor-pointer min-w-[220px] mx-auto"
                >
                  <img
                    src={p.imagen}
                    alt={p.nombre}
                    className="w-full h-56 object-cover rounded-t-2xl"
                    onError={(e) => (e.currentTarget.src = logo_Yoquet)}
                  />
                  <div className="p-3 text-left">
                    <h3 className="text-lg font-semibold truncate">
                      {p.nombre}
                    </h3>
                    <p className="text-[#ff66b3] font-bold mt-1">
                      ${p.precio}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          FOOTER
      ========================================================= */}
      <div className="mt-20 mb-10 text-white/70 text-xs">
        © {new Date().getFullYear()} Yoquet Diseños — Estilo que celebra 🎉
        <br />
        <span className="text-[10px] text-white/50">
          Desarrollado con ❤️ por <span className="text-[#ffd85a] font-bold">
            conurbaDEV
          </span>
        </span>
      </div>
    </motion.div>
  );
}

