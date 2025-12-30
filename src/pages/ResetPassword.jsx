
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import api from "../utils/api";
import logoYoquet from "../assets_opt/optimized/logo_Yoquet.webp";

const clean = (s) => String(s || "").replace(/[<>{}]/g, "").slice(0, 80);

export default function ResetPassword() {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (password !== confirmar) {
      showToast("Las contraseñas no coinciden", "error");
      return;
    }

    if (String(password).length < 6) {
      showToast("La contraseña debe tener al menos 6 caracteres", "error");
      return;
    }

    setLoading(true);

    try {
      await api.post("/api/auth/password-reset-confirm/", {
        uid: clean(uid),
        token: clean(token),
        password,
      });

      showToast("Contraseña actualizada", "success");

      // En tu App: /reset/success
      setTimeout(() => navigate("/reset/success", { replace: true }), 900);
    } catch (error) {
      console.error(error);
      showToast("Enlace inválido o expirado", "error");
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
                Restablecer contraseña
              </span>
            </h1>

            <p className="mt-2 text-sm font-bold" style={{ color: "var(--muted)" }}>
              Ingresá una nueva contraseña para recuperar acceso a tu cuenta.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <div>
              <label className="block text-sm font-extrabold mb-1" style={{ color: "var(--text)" }}>
                Nueva contraseña
              </label>
              <input
                type="password"
                required
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                placeholder="Repetí la contraseña"
                value={confirmar}
                onChange={(e) => setConfirmar(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl outline-none"
                style={{
                  background: "rgba(255,255,255,0.85)",
                  border: "1px solid rgba(61,43,31,0.12)",
                  color: "var(--text)",
                }}
              />
            </div>

            <button type="submit" disabled={loading} className="btn-yoquet w-full">
              {loading ? "Procesando…" : "Guardar contraseña"}
            </button>

            <button type="button" onClick={() => navigate("/login")} className="btn-yoquet-ghost w-full">
              Ir a iniciar sesión
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

