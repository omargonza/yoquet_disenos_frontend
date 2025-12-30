import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import logoYoquet from "../assets_opt/optimized/logo_Yoquet.webp";

export default function ResetSuccess() {
  const navigate = useNavigate();

  return (
    <main className="min-h-[calc(100vh-72px)]">
      <section className="container-yoquet pt-12 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="card-yoquet p-8 sm:p-10 max-w-md mx-auto text-center"
        >
          {/* LOGO */}
          <img
            src={logoYoquet}
            alt="Yoquet Diseños"
            className="w-40 mx-auto"
            loading="eager"
            decoding="async"
          />

          {/* TÍTULO */}
          <h1 className="mt-6 text-3xl sm:text-4xl font-extrabold">
            <span
              style={{
                background:
                  "linear-gradient(90deg, var(--color-rosa), var(--color-dorado), var(--color-turquesa))",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              ¡Contraseña actualizada!
            </span>
          </h1>

          {/* TEXTO */}
          <p
            className="mt-3 text-sm sm:text-base font-bold"
            style={{ color: "var(--muted)" }}
          >
            Tu contraseña fue restablecida correctamente.
            <br />
            Ya podés iniciar sesión con total seguridad 🔐
          </p>

          {/* ICONO SIMPLE (CSS only, liviano) */}
          <div
            className="mx-auto mt-6 w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,102,179,0.18), rgba(255,216,90,0.18), rgba(66,226,184,0.18))",
              border: "1px solid rgba(61,43,31,0.12)",
              color: "var(--color-chocolate)",
              fontWeight: 800,
              fontSize: "1.1rem",
            }}
          >
            OK
          </div>

          {/* CTA */}
          <div className="mt-8 flex flex-col gap-3">
            <button
              onClick={() => navigate("/login", { replace: true })}
              className="btn-yoquet w-full"
            >
              Iniciar sesión
            </button>

            <button
              onClick={() => navigate("/", { replace: true })}
              className="btn-yoquet-ghost w-full"
            >
              Volver al inicio
            </button>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
