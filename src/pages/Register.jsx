import { useState } from "react";
import { useToast } from "../context/ToastContext";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import logoYoquet from "../assets_opt/optimized/logo_Yoquet.webp";

const clean = (s) => String(s || "").replace(/[<>{}]/g, "").slice(0, 80);

const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
const validateUser = (u) => /^[a-zA-ZÀ-ÿ0-9._\s-]{3,40}$/.test(u);
const validatePass = (p) => String(p || "").length >= 6;

export default function Register() {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const payload = {
      username: clean(form.username),
      email: clean(form.email),
      password: form.password,
    };

    if (!validateUser(payload.username)) return showToast("Usuario inválido", "error");
    if (!validateEmail(payload.email)) return showToast("Email inválido", "error");
    if (!validatePass(payload.password)) return showToast("La contraseña debe tener al menos 6 caracteres", "error");

    try {
      setLoading(true);
      await api.post("/api/auth/register/", payload);
      showToast("Cuenta creada con éxito ✨", "success");
      navigate("/login", { replace: true });
    } catch (err) {
      console.error(err);
      showToast("Error creando cuenta", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-72px)]">
      <section className="container-yoquet pt-10 pb-14">
        <div className="card-yoquet p-7 sm:p-10 max-w-md mx-auto">
          <div className="text-center">
            <img
              src={logoYoquet}
              alt="Yoquet Diseños"
              className="w-40 mx-auto"
              loading="eager"
              decoding="async"
            />

            <h1 className="mt-5 text-3xl sm:text-4xl font-extrabold">
              <span
                style={{
                  background:
                    "linear-gradient(90deg, var(--color-rosa), var(--color-dorado), var(--color-turquesa))",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                }}
              >
                Crear cuenta
              </span>
            </h1>

            <p className="mt-2 text-sm" style={{ color: "var(--muted)", fontWeight: 700 }}>
              Registrate para finalizar compras más rápido.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <div>
              <label className="block text-sm font-extrabold mb-1" style={{ color: "var(--text)" }}>
                Usuario
              </label>
              <input
                type="text"
                required
                value={form.username}
                onChange={(e) => setForm((f) => ({ ...f, username: clean(e.target.value) }))}
                placeholder="Tu usuario"
                className="w-full px-4 py-3 rounded-2xl outline-none"
                style={{
                  background: "rgba(255,255,255,0.85)",
                  border: "1px solid rgba(61,43,31,0.12)",
                  color: "var(--text)",
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-extrabold mb-1" style={{ color: "var(--text)" }}>
                Email
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: clean(e.target.value) }))}
                placeholder="correo@ejemplo.com"
                className="w-full px-4 py-3 rounded-2xl outline-none"
                style={{
                  background: "rgba(255,255,255,0.85)",
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
                required
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                placeholder="Mínimo 6 caracteres"
                className="w-full px-4 py-3 rounded-2xl outline-none"
                style={{
                  background: "rgba(255,255,255,0.85)",
                  border: "1px solid rgba(61,43,31,0.12)",
                  color: "var(--text)",
                }}
              />
            </div>

            <button type="submit" disabled={loading} className="btn-yoquet w-full">
              {loading ? "Creando cuenta…" : "Registrarme ✨"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="btn-yoquet-ghost w-full"
            >
              Ya tengo cuenta
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
