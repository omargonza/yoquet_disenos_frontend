import { useEffect, useMemo, useState } from "react";

import PendientesGrid from "../components/gestion/PendientesGrid.jsx";
import LoadingModal from "../components/gestion/LoadingModal.jsx";
import { obtenerPendientes, subirLote } from "../services/gestionApi.js";

export default function GestionPanel() {
  const [pendientes, setPendientes] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [progreso, setProgreso] = useState(0);
  const [error, setError] = useState("");

  const total = pendientes.length;

  const cargarPendientes = async () => {
    try {
      setError("");
      const res = await obtenerPendientes();
      // Asumimos array directo; si viene {results: []} lo soportamos también
      const data = Array.isArray(res.data) ? res.data : (res.data?.results || []);
      setPendientes(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setError("No se pudieron cargar los pendientes.");
      setPendientes([]);
    }
  };

  useEffect(() => {
    cargarPendientes();
  }, []);

  const nombres = useMemo(() => pendientes.map((p) => p.filename).filter(Boolean), [pendientes]);

  const procesarLote = async () => {
    if (!nombres.length || cargando) return;

    try {
      setError("");
      setCargando(true);
      setProgreso(10);

      await subirLote(nombres);

      setProgreso(100);
      await new Promise((r) => setTimeout(r, 450));
      await cargarPendientes();
    } catch (e) {
      console.error(e);
      setError("Falló el procesamiento del lote.");
    } finally {
      setCargando(false);
      setTimeout(() => setProgreso(0), 250);
    }
  };

  return (
    <main className="min-h-[calc(100vh-72px)]">
      <section className="container-yoquet pt-8 pb-14">
        {/* Header */}
        <div className="card-yoquet p-6 sm:p-7">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl font-extrabold">
                <span
                  style={{
                    background:
                      "linear-gradient(90deg, var(--color-rosa), var(--color-dorado), var(--color-turquesa))",
                    WebkitBackgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  Panel de Gestión
                </span>
              </h1>

              <p className="mt-1 text-sm font-bold" style={{ color: "var(--muted)" }}>
                Importador de catálogo. Pendientes detectados automáticamente.
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="chip is-active">Pendientes: {total}</span>
                <button className="chip" onClick={cargarPendientes}>
                  Refrescar
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:items-end gap-2">
              <button
                onClick={procesarLote}
                disabled={!nombres.length || cargando}
                className="btn-yoquet"
                style={{
                  opacity: !nombres.length || cargando ? 0.6 : 1,
                  pointerEvents: !nombres.length || cargando ? "none" : "auto",
                }}
              >
                {cargando ? "Procesando…" : "Subir todos"}
              </button>

              <div className="text-xs font-bold" style={{ color: "var(--muted)" }}>
                {nombres.length ? `Archivos: ${nombres.length}` : "No hay archivos para subir"}
              </div>
            </div>
          </div>

          {error && (
            <div
              className="mt-5 p-3 rounded-2xl text-sm font-bold"
              style={{
                background: "rgba(255,102,179,0.10)",
                border: "1px solid rgba(61,43,31,0.10)",
                color: "var(--text)",
              }}
            >
              {error}
            </div>
          )}
        </div>

        {/* Grid */}
        <div className="mt-6 card-yoquet p-4 sm:p-6">
          {total === 0 ? (
            <div className="p-6 text-center">
              <div className="text-lg font-extrabold" style={{ color: "var(--text)" }}>
                No hay pendientes
              </div>
              <p className="mt-1 text-sm font-bold" style={{ color: "var(--muted)" }}>
                Cuando haya archivos nuevos, van a aparecer acá.
              </p>

              <div className="mt-5 flex justify-center">
                <button className="btn-yoquet-ghost" onClick={cargarPendientes}>
                  Volver a buscar
                </button>
              </div>
            </div>
          ) : (
            <PendientesGrid pendientes={pendientes} refrescar={cargarPendientes} />
          )}
        </div>

        {/* Modal */}
        <LoadingModal visible={cargando} progreso={progreso} />
      </section>
    </main>
  );
}
