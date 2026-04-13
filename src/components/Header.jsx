import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useMemo, useState } from "react";
import { Search, User, LogOut, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCarrito } from "../context/CarritoContext";
import { useAuth } from "../context/AuthContext";
import logoYoquet from "../assets_opt/optimized/logo_Yoquet.webp";

function cx(...arr) {
    return arr.filter(Boolean).join(" ");
}

export default function Header({ categorias = [] }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { totalItems, justAdded } = useCarrito();
    const { isAuthed, logout } = useAuth();

    const [q, setQ] = useState("");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const cats = useMemo(
        () => (Array.isArray(categorias) ? categorias.slice(0, 8) : []),
        [categorias]
    );

    const selectedCatId = useMemo(() => {
        const sp = new URLSearchParams(location.search);
        const v = sp.get("cat");
        return v ? Number(v) : null;
    }, [location.search]);

    const goCatalogo = (catId = null) => {
        setMobileMenuOpen(false);
        if (catId == null) navigate("/productos");
        else navigate(`/productos?cat=${Number(catId)}`);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const text = q.trim();
        setMobileMenuOpen(false);

        if (!location.pathname.startsWith("/productos")) {
            navigate(`/productos?q=${encodeURIComponent(text)}`);
            return;
        }

        const sp = new URLSearchParams(location.search);
        if (text) sp.set("q", text);
        else sp.delete("q");
        navigate(`/productos?${sp.toString()}`);
    };

    return (
        <header className="sticky top-0 z-[900]">
            <div
                className="w-full"
                style={{
                    background: "rgba(255, 255, 255, 0.98)",
                    borderBottom: "1px solid var(--border-soft)",
                    backdropFilter: "blur(16px)",
                }}
            >
                <div className="container-yoquet py-2.5 sm:py-3 flex items-center gap-2 sm:gap-3">
                    {/* Botón menú mobile */}
                    <button
                        className="sm:hidden p-1.5 -ml-1.5"
                        onClick={() => setMobileMenuOpen((prev) => !prev)}
                        aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
                        type="button"
                    >
                        {mobileMenuOpen ? (
                            <X size={20} style={{ color: "var(--text-primary)" }} />
                        ) : (
                            <Menu size={20} style={{ color: "var(--text-primary)" }} />
                        )}
                    </button>

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <img
                            src={logoYoquet}
                            alt="Yoquet Diseños"
                            className="h-8 w-8 rounded-md object-cover"
                            loading="eager"
                            decoding="async"
                        />
                        <div className="hidden xs:block leading-tight">
                            <div
                                className="font-semibold text-[15px]"
                                style={{ color: "var(--text-primary)" }}
                            >
                                Yoquet
                            </div>
                        </div>
                    </Link>

                    {/* Navegación desktop */}
                    <nav className="hidden sm:flex items-center gap-0.5 ml-2">
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                cx(
                                    "px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-rosa-light text-rosa"
                                        : "text-texto-secondary hover:text-texto-primary hover:bg-surface-soft"
                                )
                            }
                        >
                            Inicio
                        </NavLink>

                        <NavLink
                            to="/productos"
                            className={({ isActive }) =>
                                cx(
                                    "px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-rosa-light text-rosa"
                                        : "text-texto-secondary hover:text-texto-primary hover:bg-surface-soft"
                                )
                            }
                        >
                            Tienda
                        </NavLink>
                    </nav>

                    <div className="flex-1" />

                    {/* Search desktop */}
                    <form onSubmit={handleSubmit} className="hidden lg:flex items-center gap-2">
                        <div
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                            style={{
                                background: "var(--bg-main)",
                                border: "1px solid var(--border-soft)",
                            }}
                        >
                            <Search size={14} style={{ color: "var(--text-secondary)" }} />
                            <input
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                placeholder="Buscar..."
                                className="bg-transparent text-xs w-32 outline-none"
                                style={{ color: "var(--text-primary)" }}
                            />
                        </div>
                    </form>

                    {/* Acciones */}
                    <div className="flex items-center gap-1">
                        <motion.button
                            onClick={() => navigate("/carrito")}
                            className="relative p-2 rounded-lg transition-colors hover:bg-surface-soft"
                            aria-label="Carrito"
                            type="button"
                            animate={
                                justAdded
                                    ? {
                                        scale: [1, 1.18, 0.96, 1.08, 1],
                                        y: [0, -4, 0, -2, 0],
                                        rotate: [0, -7, 6, -3, 0],
                                    }
                                    : {
                                        scale: 1,
                                        y: 0,
                                        rotate: 0,
                                    }
                            }
                            transition={{
                                duration: 0.62,
                                times: [0, 0.2, 0.45, 0.72, 1],
                                ease: "easeOut",
                            }}
                        >
                            {/* Bolsita de cumpleaños más simple y linda */}
                            <svg
                                width="19"
                                height="19"
                                viewBox="0 0 24 24"
                                fill="none"
                                style={{ color: "var(--text-primary)", overflow: "visible" }}
                            >
                                {/* asas */}
                                <path
                                    d="M9 8.2C9 6.7 10.1 5.6 12 5.6C13.9 5.6 15 6.7 15 8.2"
                                    stroke="currentColor"
                                    strokeWidth="1.7"
                                    strokeLinecap="round"
                                />

                                {/* cuerpo de la bolsa */}
                                <path
                                    d="M7.2 8.4H16.8L15.9 19.1C15.84 19.86 15.21 20.45 14.45 20.45H9.55C8.79 20.45 8.16 19.86 8.1 19.1L7.2 8.4Z"
                                    fill="currentColor"
                                    opacity="0.12"
                                />
                                <path
                                    d="M7.2 8.4H16.8L15.9 19.1C15.84 19.86 15.21 20.45 14.45 20.45H9.55C8.79 20.45 8.16 19.86 8.1 19.1L7.2 8.4Z"
                                    stroke="currentColor"
                                    strokeWidth="1.7"
                                    strokeLinejoin="round"
                                />

                                {/* listón / detalle festivo */}
                                <path
                                    d="M12 11.2V15.4"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                />
                                <path
                                    d="M10.35 12.7L12 11.2L13.65 12.7"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>

                            {totalItems > 0 && (
                                <motion.span
                                    className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold flex items-center justify-center"
                                    style={{
                                        background: "var(--color-rosa)",
                                        color: "#fff",
                                        boxShadow: "0 6px 14px rgba(232, 93, 147, 0.28)",
                                    }}
                                    animate={
                                        justAdded
                                            ? {
                                                scale: [1, 1.35, 1],
                                                y: [0, -2, 0],
                                            }
                                            : {
                                                scale: 1,
                                                y: 0,
                                            }
                                    }
                                    transition={{
                                        duration: 0.38,
                                        times: [0, 0.45, 1],
                                        ease: "easeOut",
                                    }}
                                >
                                    {totalItems}
                                </motion.span>
                            )}

                            <AnimatePresence>
                                {justAdded && (
                                    <>
                                        <motion.span
                                            initial={{ opacity: 0, scale: 0.6, x: 0, y: 0 }}
                                            animate={{ opacity: [0, 1, 0], scale: [0.6, 1, 0.7], x: -10, y: -12 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.55, ease: "easeOut" }}
                                            className="pointer-events-none absolute top-[1px] left-[1px] w-1.5 h-1.5 rounded-full"
                                            style={{ background: "#E85D93" }}
                                        />
                                        <motion.span
                                            initial={{ opacity: 0, scale: 0.6, x: 0, y: 0 }}
                                            animate={{ opacity: [0, 1, 0], scale: [0.6, 1, 0.7], x: 10, y: -10 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.55, ease: "easeOut", delay: 0.04 }}
                                            className="pointer-events-none absolute top-[2px] right-[2px] w-1.5 h-1.5 rounded-full"
                                            style={{ background: "#F3C86A" }}
                                        />
                                    </>
                                )}
                            </AnimatePresence>
                        </motion.button>

                        {isAuthed ? (
                            <button
                                onClick={() => {
                                    logout();
                                    navigate("/", { replace: true });
                                }}
                                className="hidden sm:flex p-2 rounded-lg transition-colors hover:bg-surface-soft"
                                aria-label="Cerrar sesión"
                                type="button"
                            >
                                <LogOut size={16} style={{ color: "var(--text-secondary)" }} />
                            </button>
                        ) : (
                            <button
                                onClick={() => navigate("/login")}
                                className="hidden sm:flex p-2 rounded-lg transition-colors hover:bg-surface-soft"
                                aria-label="Iniciar sesión"
                                type="button"
                            >
                                <User size={16} style={{ color: "var(--text-secondary)" }} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Categorías desktop */}
                {cats.length > 0 && !mobileMenuOpen && (
                    <div className="hidden sm:flex container-yoquet pb-2.5 gap-2 overflow-x-auto scrollbar-none">
                        <button
                            type="button"
                            className={selectedCatId ? "chip" : "chip is-active"}
                            onClick={() => goCatalogo(null)}
                        >
                            Todo
                        </button>

                        {cats.map((c) => {
                            const active = Number(c.id) === Number(selectedCatId);
                            return (
                                <button
                                    key={c.id}
                                    type="button"
                                    className={active ? "chip is-active" : "chip"}
                                    onClick={() => goCatalogo(c.id)}
                                >
                                    {c.nombre}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Menú mobile */}
            {mobileMenuOpen && (
                <div
                    className="sm:hidden menu-mobile-panel relative z-[950] mt-2 px-1"
                    style={{ display: "block" }}
                >
                    <div className="container-yoquet py-1">
                        <div className="menu-mobile-sheet">
                            <form onSubmit={handleSubmit} className="menu-mobile-search menu-item">
                                <Search size={16} className="menu-mobile-search-icon" />
                                <input
                                    value={q}
                                    onChange={(e) => setQ(e.target.value)}
                                    placeholder="Buscar productos"
                                    className="menu-mobile-search-input"
                                />
                            </form>

                            <div className="menu-mobile-group">
                                <Link
                                    to="/"
                                    className="menu-mobile-link menu-item"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <span>Inicio</span>
                                </Link>

                                <Link
                                    to="/productos"
                                    className="menu-mobile-link menu-item"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <span>Tienda</span>
                                </Link>

                                <Link
                                    to="/carrito"
                                    className="menu-mobile-link menu-item"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <span>Carrito</span>
                                    {totalItems > 0 && (
                                        <span className="menu-mobile-badge">{totalItems}</span>
                                    )}
                                </Link>
                            </div>

                            {cats.length > 0 && (
                                <div className="menu-mobile-section menu-item">
                                    <div className="menu-mobile-section-label">Categorías</div>

                                    <div className="menu-mobile-chips">
                                        <button
                                            type="button"
                                            className={
                                                selectedCatId ? "menu-mobile-chip" : "menu-mobile-chip is-active"
                                            }
                                            onClick={() => goCatalogo(null)}
                                        >
                                            Todo
                                        </button>

                                        {cats.map((c) => {
                                            const active = Number(c.id) === Number(selectedCatId);
                                            return (
                                                <button
                                                    key={c.id}
                                                    type="button"
                                                    className={
                                                        active
                                                            ? "menu-mobile-chip is-active"
                                                            : "menu-mobile-chip"
                                                    }
                                                    onClick={() => goCatalogo(c.id)}
                                                >
                                                    {c.nombre}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            <div className="menu-mobile-section menu-item">
                                {isAuthed ? (
                                    <button
                                        onClick={() => {
                                            logout();
                                            navigate("/", { replace: true });
                                            setMobileMenuOpen(false);
                                        }}
                                        className="menu-mobile-link menu-mobile-link-muted"
                                        type="button"
                                    >
                                        <LogOut size={16} />
                                        <span>Cerrar sesión</span>
                                    </button>
                                ) : (
                                    <Link
                                        to="/login"
                                        className="menu-mobile-link menu-mobile-link-muted"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <span>Iniciar sesión</span>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}