// src/pages/Productos.jsx
import { useEffect, useState, useRef } from "react";
import api from "../utils/api";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useCarrito } from "../context/CarritoContext";
import { useToast } from "../context/ToastContext";
import axios from "axios";

/* ====== Iconos SVG livianos ====== */
const IconGrid = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
  </svg>
);
const IconList = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <circle cx="4" cy="6" r="1.5" />
    <circle cx="4" cy="12" r="1.5" />
    <circle cx="4" cy="18" r="1.5" />
  </svg>
);
const IconFilter = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <polygon points="3 4 21 4 14 14 14 21 10 19 10 14 3 4" />
  </svg>
);

/* ====== Variantes de animación ====== */
const contenedor = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
};
const item = {
  hidden: { opacity: 0, y: 25 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [vista, setVista] = useState("grid");
  const [loading, setLoading] = useState(true);

  // ✨ Efectos premium
  const [showParticles, setShowParticles] = useState(true);
  const [bezierFlight, setBezierFlight] = useState(null);

  const { carrito, agregarAlCarrito } = useCarrito();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const cartRef = useRef(null);
  const canvasMetalRef = useRef(null); // partículas metálicas
  const canvasColorRef = useRef(null); // partículas coloridas

  const backendURL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000/";

  /* ====== Carga con caché ====== */
  useEffect(() => {
    const cachedProducts = localStorage.getItem("productos_cache");
    const cachedTime = localStorage.getItem("productos_cache_time");
    const isRecent = cachedTime && Date.now() - parseInt(cachedTime, 10) < 3600 * 1000;

    if (cachedProducts && isRecent) {
      setProductos(JSON.parse(cachedProducts));
      setLoading(false);
    }

    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          axios.get(`${backendURL}/api/productos/`),
          axios.get(`${backendURL}/api/categorias/`),
        ]);

        const prodData = Array.isArray(prodRes.data) ? prodRes.data : prodRes.data.results || [];
        const catData = Array.isArray(catRes.data) ? catRes.data : catRes.data.results || [];

        setProductos(prodData);
        setCategorias(catData);

        localStorage.setItem("productos_cache", JSON.stringify(prodData));
        localStorage.setItem("productos_cache_time", Date.now().toString());
      } catch (error) {
        console.error("Error al cargar productos:", error);
        showToast("No se pudieron cargar los productos", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* ====== Vuelo parabólico 3D + traza luminosa ====== */
  const handleAddToCart = (producto, e) => {
    agregarAlCarrito(producto);
    showToast(`${producto.nombre} agregado 🛍️`, "success");

    const imgEl = e.target.closest(".producto-card")?.querySelector("img");
    if (!imgEl || !cartRef.current) return;

    const imgRect = imgEl.getBoundingClientRect();
    const cartRect = cartRef.current.getBoundingClientRect();

    // control “hacia arriba” para una parábola con sensación 3D
    const controlX = (imgRect.left + cartRect.left) / 2;
    const controlY = Math.min(imgRect.top, cartRect.top) - 200;

    setBezierFlight({
      src: producto.imagen,
      start: { x: imgRect.left, y: imgRect.top, w: imgRect.width, h: imgRect.height },
      control: { x: controlX, y: controlY },
      end: { x: cartRect.left, y: cartRect.top },
      startTime: performance.now(),
      duration: 1200,
    });

    // pulso en el carrito (premium)
    cartRef.current.classList.add("cart-pulse");
    setTimeout(() => cartRef.current.classList.remove("cart-pulse"), 900);
  };

  /* ====== Doble capa de partículas (metálicas + color) ====== */
  useEffect(() => {
    if (!showParticles) return;

    // ---------- Capa 1: metálicas ----------
    const canvasM = canvasMetalRef.current;
    const ctxM = canvasM?.getContext("2d");
    if (!canvasM || !ctxM) return;

    const metalColors = [
      "rgba(255,255,255,0.22)",
      "rgba(240,242,255,0.25)",
      "rgba(200,210,255,0.18)",
      "rgba(255,216,90,0.15)",
    ];
    let mParts = [];

    const resizeM = () => {
      canvasM.width = window.innerWidth;
      canvasM.height = window.innerHeight;
      mParts = Array.from({ length: 36 }, () => ({
        x: Math.random() * canvasM.width,
        y: Math.random() * canvasM.height,
        r: Math.random() * 1.8 + 0.6,
        dx: (Math.random() - 0.5) * 0.35,
        dy: Math.random() * 0.35 + 0.08,
        color: metalColors[Math.floor(Math.random() * metalColors.length)],
      }));
    };

    const drawM = () => {
      ctxM.clearRect(0, 0, canvasM.width, canvasM.height);
      mParts.forEach((p) => {
        ctxM.beginPath();
        ctxM.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctxM.fillStyle = p.color;
        ctxM.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.y > canvasM.height) p.y = 0;
        if (p.x > canvasM.width) p.x = 0;
        if (p.x < 0) p.x = canvasM.width;
      });
      requestAnimationFrame(drawM);
    };

    resizeM();
    drawM();
    window.addEventListener("resize", resizeM);

    // ---------- Capa 2: color ----------
    const canvasC = canvasColorRef.current;
    const ctxC = canvasC?.getContext("2d");
    if (!canvasC || !ctxC) return () => window.removeEventListener("resize", resizeM);

    const colorParts = [
      "rgba(255,102,179,0.25)", // rosa
      "rgba(139,92,246,0.22)",  // violeta
      "rgba(66,226,184,0.22)",  // turquesa
      "rgba(255,216,90,0.22)",  // dorado
    ];
    let cParts = [];

    const resizeC = () => {
      canvasC.width = window.innerWidth;
      canvasC.height = window.innerHeight;
      cParts = Array.from({ length: 26 }, () => ({
        x: Math.random() * canvasC.width,
        y: Math.random() * canvasC.height,
        r: Math.random() * 2.4 + 0.8,
        dx: (Math.random() - 0.5) * 0.25,
        dy: Math.random() * 0.25 + 0.06,
        color: colorParts[Math.floor(Math.random() * colorParts.length)],
      }));
    };

    const drawC = () => {
      ctxC.clearRect(0, 0, canvasC.width, canvasC.height);
      cParts.forEach((p) => {
        ctxC.beginPath();
        ctxC.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctxC.fillStyle = p.color;
        ctxC.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.y > canvasC.height) p.y = 0;
        if (p.x > canvasC.width) p.x = 0;
        if (p.x < 0) p.x = canvasC.width;
      });
      requestAnimationFrame(drawC);
    };

    resizeC();
    drawC();
    window.addEventListener("resize", resizeC);

    return () => {
      window.removeEventListener("resize", resizeM);
      window.removeEventListener("resize", resizeC);
    };
  }, [showParticles]);

  /* ====== Filtrado ====== */
  const productosFiltrados = categoriaSeleccionada
    ? productos.filter((p) => p.categoria?.id === categoriaSeleccionada.id)
    : productos;

  /* ====== Loading ====== */
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f0f10] text-[#d4b978] text-lg">
        Cargando catálogo...
      </div>
    );

  /* ====== UI principal ====== */
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
      className="relative min-h-screen text-[#f4f4f6] px-6 py-10 overflow-hidden"
    >
      {/* ====== Estilos premium locales ====== */}
      <style>{`
        @keyframes metalLux {
          0% { background-position: 0% 50%; opacity: 0.65; }
          50% { background-position: 100% 50%; opacity: 0.9; }
          100% { background-position: 0% 50%; opacity: 0.65; }
        }
        @keyframes cartPulse {
          0%   { transform: scale(1); box-shadow: 0 0 0 0 rgba(212,185,120,0.50); }
          50%  { transform: scale(1.16); box-shadow: 0 0 22px 10px rgba(212,185,120,0.25); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(212,185,120,0); }
        }
        .cart-pulse { animation: cartPulse 0.9s ease-out; }

        .trail {
          position: fixed;
          pointer-events: none;
          z-index: 120;
          height: 4px;
          border-radius: 9999px;
          filter: blur(2px);
          background: linear-gradient(90deg,
            rgba(255,216,90,0.9),
            rgba(255,102,179,0.85),
            rgba(66,226,184,0.9));
        }

        @keyframes sweepGloss {
          0% { transform: translateX(-120%) skewX(-18deg); opacity: 0; }
          40% { opacity: 0.55; }
          60% { opacity: 0.35; }
          100% { transform: translateX(120%) skewX(-18deg); opacity: 0; }
        }

        .glossy::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, rgba(255,255,255,0), rgba(255,255,255,0.55), rgba(255,255,255,0));
          transform: translateX(-120%) skewX(-18deg);
          animation: sweepGloss 3.8s ease-in-out infinite;
          pointer-events: none;
        }

        @media (max-width: 768px) {
          .metal-lux-overlay { opacity: 0.55 !important; filter: blur(1px) !important; }
          .header-auras { opacity: 0.50 !important; filter: blur(8px) !important; }
        }
      `}</style>

      {/* ====== Fondo festivo colorido ====== */}
      <div
        className="absolute inset-0 -z-20 animate-[metalLux_18s_ease-in-out_infinite]"
        style={{
          backgroundImage: `
            radial-gradient(circle at 15% 25%, rgba(255,102,179,0.18), transparent 60%),
            radial-gradient(circle at 85% 75%, rgba(66,226,184,0.18), transparent 60%),
            radial-gradient(circle at 55% 90%, rgba(255,216,90,0.16), transparent 60%),
            linear-gradient(135deg, #2b2d33, #3b3d45 35%, #5c5f6a 65%, #7d808c)
          `,
          backgroundSize: "200% 200%",
        }}
      />

      {/* capa luz metalizada */}
      <div
        className="metal-lux-overlay absolute inset-0 -z-10 mix-blend-overlay animate-[metalLux_22s_ease-in-out_infinite]"
        style={{
          backgroundImage: `
            linear-gradient(135deg, rgba(255,255,255,0.13), rgba(255,255,255,0) 40%),
            radial-gradient(circle at 35% 25%, rgba(255,255,255,0.18), transparent 60%),
            radial-gradient(circle at 80% 70%, rgba(255,255,255,0.1), transparent 70%)
          `,
          backgroundSize: "220% 220%",
          filter: "blur(2px)",
        }}
      />

      {/* canvases de partículas */}
      <canvas ref={canvasMetalRef} className="pointer-events-none absolute inset-0 -z-10" />
      <canvas ref={canvasColorRef} className="pointer-events-none absolute inset-0 -z-10" />

      {/* ====== Header vibrante ====== */}
      <header className="relative max-w-7xl mx-auto mb-12">
        {/* Auras de color detrás del título */}
        <div className="header-auras pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-16 -left-10 w-[36vw] h-[36vw] rounded-full bg-[radial-gradient(circle,rgba(255,102,179,0.24),transparent_70%)] blur-3xl" />
          <div className="absolute -bottom-20 right-0 w-[42vw] h-[42vw] rounded-full bg-[radial-gradient(circle,rgba(66,226,184,0.22),transparent_70%)] blur-3xl" />
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[28vw] h-[28vw] rounded-full bg-[radial-gradient(circle,rgba(255,216,90,0.22),transparent_70%)] blur-3xl" />
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Título grande animado */}
          <div className="text-center md:text-left relative">
            <motion.h2
              initial={{ y: 18, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="relative text-5xl md:text-6xl font-extrabold tracking-tight leading-tight text-transparent bg-clip-text bg-[linear-gradient(90deg,var(--color-rosa),var(--color-dorado),var(--color-turquesa))] [background-size:200%_auto] animate-[metalLux_8s_ease-in-out_infinite] drop-shadow-[0_6px_24px_rgba(0,0,0,0.18)]"
            >
              Nuestro Catálogo
              <span className="block text-base md:text-lg mt-2 text-white/80 font-medium">
                Piezas únicas, hechas con pasión y detalle ✨
              </span>
            </motion.h2>

            {/* Gloss bar que recorre el título */}
            <div className="absolute -inset-x-8 -inset-y-3 glossy rounded-2xl opacity-60" />
          </div>

          {/* Carrito + view toggles */}
          <div className="flex items-center gap-5">
            <div ref={cartRef} className="relative text-3xl select-none">
              🛍️
              {carrito.length > 0 && (
                <span className="absolute -top-2 -right-3 bg-[var(--color-rosa)] text-white text-xs font-bold rounded-full px-2 py-0.5 shadow-md">
                  {carrito.length}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-3 py-2 shadow-md">
              <Tooltip text="Vista galería">
                <button
                  onClick={() => setVista("grid")}
                  className={`p-2 rounded-full transition-all ${
                    vista === "grid"
                      ? "btn-festivo text-[#111] shadow-md"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  <IconGrid />
                </button>
              </Tooltip>
              <Tooltip text="Vista lista">
                <button
                  onClick={() => setVista("list")}
                  className={`p-2 rounded-full transition-all ${
                    vista === "list"
                      ? "btn-festivo text-[#111] shadow-md"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  <IconList />
                </button>
              </Tooltip>
            </div>
          </div>
        </div>
      </header>

      {/* ====== Filtros ====== */}
      <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-3 mb-10">
        <FilterButton
          active={!categoriaSeleccionada}
          onClick={() => setCategoriaSeleccionada(null)}
          text="Todas"
        />
        {categorias.map((cat) => (
          <FilterButton
            key={cat.id}
            active={categoriaSeleccionada?.id === cat.id}
            onClick={() => setCategoriaSeleccionada(cat)}
            text={cat.nombre}
          />
        ))}
      </div>

      {/* ====== Catálogo ====== */}
      <div className="relative max-w-7xl mx-auto">
        <motion.div
          variants={contenedor}
          initial="hidden"
          animate="show"
          className={`grid ${
            vista === "grid"
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
              : "grid-cols-1 gap-6"
          }`}
        >
          {productosFiltrados.map((producto) => (
            <motion.div
              key={producto.id}
              variants={item}
              whileHover={{ scale: 1.03, y: -2 }}
              onClick={() => navigate(`/productos/${producto.id}`)}
              className={`producto-card relative group cursor-pointer ${
                vista === "list" ? "flex items-center gap-6 p-4" : "p-4"
              }`}
            >
              {/* Card exterior con soft glass y borde glow sutil */}
              <div className="relative rounded-[22px] p-3 bg-white/8 border border-white/15 shadow-[0_10px_30px_rgba(0,0,0,0.15)] backdrop-blur-md transition-all duration-300 group-hover:border-white/25 w-full">
                {/* Imagen con halo + shine */}
                <div
                  className={`relative ${
                    vista === "list" ? "w-48 h-48 flex-shrink-0" : "w-full h-64"
                  } overflow-hidden rounded-[18px]`}
                >
                  <img
                    loading="lazy"
                    src={producto.imagen}
                    alt={producto.nombre}
                    className="w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
                  />
                  {/* halo suave */}
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_60%,rgba(255,255,255,0.12),transparent_60%)]" />
                  {/* brillo desplazándose */}
                  <div className="pointer-events-none absolute inset-0 group-hover:animate-shine" />
                </div>

                {/* Info */}
                <div className={`flex flex-col justify-between ${vista === "list" ? "flex-1 pl-4" : "mt-4"}`}>
                  <h3 className="text-lg font-semibold text-white truncate font-[Playfair_Display] drop-shadow">
                    {producto.nombre}
                  </h3>

                  <p className="text-sm text-white/80 line-clamp-2 mt-1">
                    {producto.descripcion}
                  </p>

                  <div className="flex justify-between items-center mt-3">
                    <span className="text-white font-bold text-lg tracking-wide drop-shadow-sm">
                      ${producto.precio}
                    </span>

                    <motion.button
                      whileHover={{ scale: 1.07 }}
                      whileTap={{ scale: 0.93 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(producto, e);
                      }}
                      className="btn-festivo text-sm"
                    >
                      Agregar
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ====== Toggle de efectos ====== */}
      <button
        onClick={() => setShowParticles(!showParticles)}
        className={`fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all duration-300 ${
          showParticles ? "btn-festivo animate-pulse" : "bg-white/10 border border-white/20 text-white"
        } hover:scale-110`}
        title={showParticles ? "Ocultar efectos" : "Activar efectos"}
      >
        {showParticles ? "✨" : "🌈"}
      </button>

      {/* ====== Vuelo parabólico con traza ====== */}
      <BezierFlight flight={bezierFlight} onEnd={() => setBezierFlight(null)} />
    </motion.div>
  );
}

/* =========================================================
   Vuelo parabólico Bézier + traza (premium)
   ========================================================= */
function BezierFlight({ flight, onEnd }) {
  const [t, setT] = useState(0);

  useEffect(() => {
    if (!flight) return;
    const { startTime, duration } = flight;
    let raf;
    const step = (now) => {
      const progress = Math.min(1, (now - startTime) / duration);
      setT(progress);
      if (progress < 1) raf = requestAnimationFrame(step);
      else onEnd?.();
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [flight, onEnd]);

  if (!flight) return null;

  const { src, start, control, end } = flight;

  // Quadratic Bézier
  const bx = (1 - t) ** 2 * start.x + 2 * (1 - t) * t * control.x + t ** 2 * end.x;
  const by = (1 - t) ** 2 * start.y + 2 * (1 - t) * t * control.y + t ** 2 * end.y;

  // cambio de tamaño hacia miniatura
  const w = start.w * (1 - t) + 44 * t;
  const h = start.h * (1 - t) + 44 * t;

  // vector para el ángulo y trazo
  const prevT = Math.max(0, t - 0.02);
  const px = (1 - prevT) ** 2 * start.x + 2 * (1 - prevT) * prevT * control.x + prevT ** 2 * end.x;
  const py = (1 - prevT) ** 2 * start.y + 2 * (1 - prevT) * prevT * control.y + prevT ** 2 * end.y;
  const dx = bx - px;
  const dy = by - py;
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);

  return (
    <>
      <motion.img
        src={src}
        style={{
          position: "fixed",
          top: by,
          left: bx,
          width: w,
          height: h,
          borderRadius: 12,
          transform: `translate(-50%,-50%) rotate(${angle / 5}deg)`,
          zIndex: 125,
          boxShadow: "0 0 28px rgba(255,255,255,0.45)",
          pointerEvents: "none",
        }}
        initial={{ opacity: 1 }}
        animate={{ opacity: t < 0.95 ? 1 : 0 }}
        transition={{ duration: 0.12 }}
      />

      <div
        className="trail"
        style={{
          top: py,
          left: px,
          width: Math.max(10, Math.sqrt(dx * dx + dy * dy)),
          transform: `translate(-50%,-50%) rotate(${angle}deg)`,
          opacity: 0.9 - t * 0.9,
        }}
      />
    </>
  );
}

/* =========================================================
   Botón de filtro y Tooltip
   ========================================================= */
function FilterButton({ active, onClick, text }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`px-5 py-2 rounded-full text-sm font-semibold transition-all border flex items-center gap-2 ${
        active
          ? "btn-festivo text-[#111] shadow-md"
          : "bg-white/10 text-white border-white/25 hover:bg-white/20"
      }`}
    >
      <IconFilter />
      {text}
    </motion.button>
  );
}

function Tooltip({ text, children }) {
  return (
    <div className="relative group select-none">
      {children}
      <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-[#111318] text-[#f6f6f6] text-xs rounded-md px-2 py-1 shadow-md transition-all duration-300 whitespace-nowrap">
        {text}
      </span>
    </div>
  );
}
