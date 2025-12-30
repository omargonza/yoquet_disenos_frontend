import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import api from "../utils/api";
import logoYoquet from "../assets_opt/optimized/logo_Yoquet.webp";

const clean = (s) => String(s || "").replace(/[<>{}]/g, "").slice(0, 80);

export default function ResetPasswordConfirm() {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [pass1, setPass1] = useState("");
  const [pass2, setPass2] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const p1 = clean(pass1);
    const p2 = clean(pass2);

    if (p1 !== p2) return showToast("Las contraseñas no coinciden", "error");
    if (p1.length < 6) return showToast("Mínimo 6 caracteres", "error");

    try {
      setLoading(true);

      await api.post("/api/auth/password-reset-confirm/", {
        uid,
        token,
        password: p1,
      });

      showToast("Contraseña actualizada", "success");
      setTimeout(() => navigate("/login", { replace: true }), 900);
    } catch (err) {
      console.error(err);
      showToast("Enlace inválido o expirado", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-72px)]">
      <section className="container-yoquet pt-10 pb-14">
        <div className="card-yoquet p-7 sm:p-10 max-w-md mx-auto text-center">
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
              Nueva contraseña
            </span>
          </h1>

          <p className="mt-2 text-sm font-bold" style={{ color: "var(--muted)" }}>
            Elegí una contraseña segura y confirmala.
          </p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4 text-left">
            <div>
              <label className="block text-sm font-extrabold mb-1" style={{ color: "var(--text)" }}>
                Nueva contraseña
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={pass1}
                onChange={(e) => setPass1(clean(e.target.value))}
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
                Confirmar contraseña
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={pass2}
                onChange={(e) => setPass2(clean(e.target.value))}
                className="w-full px-4 py-3 rounded-2xl outline-none"
                style={{
                  background: "rgba(255,255,255,0.85)",
                  border: "1px solid rgba(61,43,31,0.12)",
                  color: "var(--text)",
                }}
              />
            </div>

            <button disabled={loading} className="btn-yoquet w-full" type="submit">
              {loading ? "Procesando…" : "Actualizar contraseña"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="btn-yoquet-ghost w-full"
            >
              Ir a iniciar sesión
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
