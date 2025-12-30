import { useState } from "react";
import { useToast } from "../context/ToastContext";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import logoYoquet from "../assets_opt/optimized/logo_Yoquet.webp";
import loginImg from "../assets_opt/optimized/login.webp";

const cleanText = (txt) => String(txt || "").replace(/[<>{}]/g, "").slice(0, 120);

export default function Login() {
  const { showToast } = useToast();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/productos";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/api/auth/login/", {
        username: cleanText(username),
        password,
      });

      login(res.data.access, res.data.refresh);

      showToast(`Bienvenido, ${cleanText(username)}`, "success");
      navigate(from, { replace: true });
    } catch {
      setError("Usuario o contraseña incorrectos");
      showToast("Credenciales incorrectas", "error");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-72px)]">
      <section className="container-yoquet pt-10 pb-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* FORM */}
          <div className="card-yoquet p-6 sm:p-8">
            <div className="flex items-center justify-center">
              <img
                src={logoYoquet}
                alt="Yoquet Diseños"
                className="w-40 sm:w-44"
                loading="eager"
                decoding="async"
              />
            </div>

            <h2 className="mt-6 text-3xl sm:text-4xl text-center">
              <span
                style={{
                  background:
                    "linear-gradient(90deg, var(--color-rosa), var(--color-dorado), var(--color-turquesa))",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                }}
              >
                ¡Bienvenido!
              </span>
            </h2>
            <p className="mt-2 text-center text-sm" style={{ color: "var(--muted)", fontWeight: 700 }}>
              Iniciá sesión para comprar rápido y sin fricción.
            </p>

            <form onSubmit={handleSubmit} className="mt-7 space-y-4">
              <div>
                <label className="block text-sm font-extrabold mb-1" style={{ color: "var(--text)" }}>
                  Usuario
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(cleanText(e.target.value))}
                  placeholder="usuario@ejemplo.com"
                  autoComplete="username"
                  required
                  className="w-full px-4 py-3 rounded-2xl outline-none"
                  style={{
                    background: "rgba(255,255,255,0.82)",
                    border: "1px solid rgba(61,43,31,0.12)",
                    color: "var(--text)",
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-extrabold mb-1" style={{ color: "var(--text)" }}>
                  Contraseña
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  className="w-full px-4 py-3 rounded-2xl outline-none"
                  style={{
                    background: "rgba(255,255,255,0.82)",
                    border: "1px solid rgba(61,43,31,0.12)",
                    color: "var(--text)",
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-yoquet w-full"
                style={{
                  opacity: loading ? 0.75 : 1,
                  pointerEvents: loading ? "none" : "auto",
                }}
              >
                {loading ? "Ingresando…" : "Iniciar sesión"}
              </button>

              {error && (
                <div
                  className="mt-2 p-3 rounded-2xl text-sm font-bold text-center"
                  style={{
                    background: "rgba(255, 59, 48, 0.10)",
                    border: "1px solid rgba(255, 59, 48, 0.18)",
                    color: "#b42318",
                  }}
                >
                  {error}
                </div>
              )}

              <div className="pt-2 text-center text-sm" style={{ color: "var(--muted)" }}>
                ¿No tenés cuenta?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="font-extrabold"
                  style={{ color: "var(--color-turquesa)" }}
                >
                  Registrarme
                </button>
              </div>

              <div className="text-center text-sm" style={{ color: "var(--muted)" }}>
                ¿Olvidaste tu contraseña?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="font-extrabold"
                  style={{ color: "var(--color-rosa)" }}
                >
                  Recuperarla
                </button>
              </div>
            </form>

            <div className="mt-10 text-center text-xs" style={{ color: "var(--muted)" }}>
              © {new Date().getFullYear()} Yoquet Diseños
              <div className="text-[10px]" style={{ opacity: 0.8 }}>
                Desarrollado por conurbaDEV
              </div>
            </div>
          </div>

          {/* PANEL VISUAL (liviano, claro, divertido) */}
          <div className="hidden lg:block">
            <div
              className="card-yoquet overflow-hidden h-full"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,102,179,0.10), rgba(255,216,90,0.10), rgba(66,226,184,0.10))",
              }}
            >
              <img
                src={loginImg}
                alt="Decorativo Yoquet"
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
                style={{ opacity: 0.82 }}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
