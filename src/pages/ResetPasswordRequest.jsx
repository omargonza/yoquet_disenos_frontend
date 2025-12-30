import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useToast } from "../context/ToastContext";
import logoYoquet from "../assets_opt/optimized/logo_Yoquet.webp";

const clean = (s) => String(s || "").replace(/[<>{}]/g, "").slice(0, 120);
const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

export default function ResetPasswordRequest() {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const safeEmail = clean(email);
    if (!validateEmail(safeEmail)) return showToast("Email inválido", "error");

    try {
      setLoading(true);
      await api.post("/api/auth/password-reset/", { email: safeEmail });
      showToast("Si el correo existe, enviamos un enlace", "success");
    } catch (err) {
      console.error(err);
      showToast("Error al solicitar el reinicio", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-72px)]">
      <section className="container-yoquet pt-10 pb-14">
        <div className="card-yoquet p-7 sm:p-10 max-w-md mx-auto text-center">
          {/* LOGO */}
          <img
            src={logoYoquet}
            alt="Yoquet Diseños"
            className="w-40 mx-auto"
            loading="eager"
            decoding="async"
          />

          {/* TÍTULO */}
          <h1 className="mt-5 text-3xl sm:text-4xl font-extrabold">
            <span
              style={{
                background:
                  "linear-gradient(90deg, var(--color-rosa), var(--color-dorado), var(--color-turquesa))",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              Recuperar contraseña
            </span>
          </h1>

          <p className="mt-2 text-sm font-bold" style={{ color: "var(--muted)" }}>
            Ingresá tu correo y te enviamos el enlace para restablecerla.
          </p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4 text-left">
            <div>
              <label className="block text-sm font-extrabold mb-1" style={{ color: "var(--text)" }}>
                Email
              </label>
              <input
                type="email"
                required
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(clean(e.target.value))}
                className="w-full px-4 py-3 rounded-2xl outline-none"
                style={{
                  background: "rgba(255,255,255,0.85)",
                  border: "1px solid rgba(61,43,31,0.12)",
                  color: "var(--text)",
                }}
              />
            </div>

            <button disabled={loading} className="btn-yoquet w-full" type="submit">
              {loading ? "Enviando…" : "Enviar enlace"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="btn-yoquet-ghost w-full"
            >
              Ir a iniciar sesión
            </button>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-yoquet-ghost w-full"
            >
              ← Volver
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
