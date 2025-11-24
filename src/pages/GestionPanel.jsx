import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import PendientesGrid from "../components/gestion/PendientesGrid.jsx";
import LoadingModal from "../components/gestion/LoadingModal.jsx";
import { obtenerPendientes, subirLote } from "../services/gestionApi.js";

export default function GestionPanel() {
    const [pendientes, setPendientes] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [progreso, setProgreso] = useState(0);

    const cargarPendientes = async () => {
        const res = await obtenerPendientes();
        setPendientes(res.data);
    };

    useEffect(() => {
        cargarPendientes();
    }, []);

    const procesarLote = async () => {
        if (!pendientes.length) return;

        setCargando(true);

        const nombres = pendientes.map(p => p.filename);
        await subirLote(nombres);

        setProgreso(100);
        await new Promise(r => setTimeout(r, 500));

        setCargando(false);
        cargarPendientes();
    };

    return (
        <div className="min-h-screen p-6 bg-gray-100">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-bold mb-6"
            >
                Panel de Gestión — Importador
            </motion.h1>

            <button
                onClick={procesarLote}
                className="mb-6 py-3 px-6 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700"
            >
                Subir todos
            </button>

            <PendientesGrid pendientes={pendientes} refrescar={cargarPendientes} />
            <LoadingModal visible={cargando} progreso={progreso} />
        </div>
    );
}
