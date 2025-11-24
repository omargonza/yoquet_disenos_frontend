import { useState } from "react";
import { subirArchivo } from "../../services/gestionApi.js";


export default function ProductoCard({ item, refrescar }) {
    const [loading, setLoading] = useState(false);

    const handleUpload = async () => {
        setLoading(true);
        await subirArchivo(item.filename);
        await refrescar();
        setLoading(false);
    };

    return (
        <div className="bg-white rounded-xl shadow p-3 hover:shadow-lg transition">
            <img
                src={`/media/${item.relative_path}`}
                className="rounded-xl w-full h-32 object-cover"
            />

            <p className="mt-2 text-sm font-semibold break-all">
                {item.filename}
            </p>

            <button
                onClick={handleUpload}
                disabled={loading}
                className="w-full mt-2 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
            >
                {loading ? "Procesando..." : "Subir"}
            </button>
        </div>
    );
}
