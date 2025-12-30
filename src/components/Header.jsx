import { Link, NavLink, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { ShoppingBag, Search, User, LogOut } from "lucide-react";
import { useCarrito } from "../context/CarritoContext";
import { useAuth } from "../context/AuthContext";
import logoYoquet from "../assets_opt/optimized/logo_Yoquet.webp";

function cx(...arr) {
  return arr.filter(Boolean).join(" ");
}

export default function Header({ categorias = [], onSearch }) {
  const navigate = useNavigate();
  const { totalItems } = useCarrito();

  // AuthContext PRO (según el que te pasé)
  const { isAuthed, logout } = useAuth();

  const [q, setQ] = useState("");

  const cats = useMemo(
    () => (Array.isArray(categorias) ? categorias.slice(0, 10) : []),
    [categorias]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.(q.trim());
  };

  return (
    <header className="sticky top-0 z-[900]">
      <div
        className="w-full"
        style={{
          background: "rgba(255,250,246,0.88)",
          borderBottom: "1px solid rgba(61,43,31,0.10)",
          backdropFilter: "saturate(140%) blur(6px)",
        }}
      >
        <div className="container-yoquet py-3 flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3 min-w-[220px]">
            <img
              src={logoYoquet}
              alt="Yoquet Diseños"
              className="h-10 w-10 rounded-2xl object-cover"
              loading="eager"
              decoding="async"
              style={{ border: "1px solid rgba(61,43,31,0.10)" }}
            />
            <div className="leading-tight">
              <div className="font-extrabold" style={{ color: "var(--text)" }}>
                Yoquet Diseños
              </div>
              <div className="text-[11px]" style={{ color: "var(--muted)" }}>
                Cotillón artesanal premium
              </div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-2 ml-2">
            <NavLink
              to="/"
              className={({ isActive }) =>
                cx("px-3 py-2 rounded-full font-extrabold text-sm", isActive ? "chip is-active" : "btn-yoquet-ghost")
              }
            >
              Inicio
            </NavLink>

            <NavLink
              to="/productos"
              className={({ isActive }) =>
                cx("px-3 py-2 rounded-full font-extrabold text-sm", isActive ? "chip is-active" : "btn-yoquet-ghost")
              }
            >
              Catálogo
            </NavLink>
          </nav>

          <div className="flex-1" />

          {/* Buscador (ultra liviano) */}
          <form onSubmit={handleSubmit} className="hidden sm:flex items-center gap-2">
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-full"
              style={{
                background: "rgba(255,255,255,0.82)",
                border: "1px solid rgba(61,43,31,0.10)",
              }}
            >
              <Search size={16} style={{ color: "var(--muted)" }} />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar…"
                className="outline-none bg-transparent text-sm w-40 md:w-60"
                style={{ color: "var(--text)" }}
              />
            </div>
          </form>

          {/* Carrito */}
          <button
            onClick={() => navigate("/carrito")}
            className="btn-yoquet-ghost relative"
            aria-label="Ir al carrito"
            title="Carrito"
          >
            <ShoppingBag size={18} />
            <span className="hidden sm:inline">Carrito</span>

            {totalItems > 0 && (
              <span
                className="absolute -top-1 -right-1 h-5 min-w-5 px-1 rounded-full text-[11px] font-extrabold flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, var(--color-rosa), #ff1d8e)",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.55)",
                }}
              >
                {totalItems}
              </span>
            )}
          </button>

          {/* Cuenta */}
          {isAuthed ? (
            <button
              onClick={() => {
                logout();
                navigate("/", { replace: true });
              }}
              className="btn-yoquet-ghost"
              aria-label="Cerrar sesión"
              title="Cerrar sesión"
            >
              <LogOut size={18} />
              <span className="hidden md:inline">Salir</span>
            </button>
          ) : (
            <button onClick={() => navigate("/login")} className="btn-yoquet-ghost" aria-label="Iniciar sesión">
              <User size={18} />
              <span className="hidden md:inline">Cuenta</span>
            </button>
          )}
        </div>

        {/* Chips de categorías */}
        {cats.length > 0 && (
          <div className="container-yoquet pb-3 flex gap-2 overflow-x-auto scrollbar-none">
            <button className="chip is-active" onClick={() => navigate("/productos")}>
              Ver todo
            </button>

            {cats.map((c) => (
              <button
                key={c.id}
                className="chip"
                onClick={() => navigate("/productos", { state: { categoriaId: c.id } })}
                title={c.nombre}
              >
                {c.nombre}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}

