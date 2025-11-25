import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../utils/api";
import { useToast } from "../context/ToastContext";

export default function AdminPanel() {
  const { showToast } = useToast();

  const [productos, setProductos] = useState([]);
  const [nuevoNombre, setNuevoNombre] = useState("");

  // =============================
  // Cargar productos
  // =============================
  const cargarProductos = async () => {
    try {
      const res = await api.get("/api/productos/");
      setProductos(res.data.results || []);
    } catch (err) {
      showToast("Error al cargar productos", "error");
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  // =============================
  // Agregar producto
  // =============================
  const handleAdd = async () => {
    if (!nuevoNombre.trim()) return;

    try {
      await api.post("/api/productos/", { nombre: nuevoNombre });
      showToast("Producto agregado correctamente", "success");

      setNuevoNombre("");
      cargarProductos();
    } catch (err) {
      showToast("Error al agregar producto", "error");
    }
  };

  // =============================
  // Eliminar producto
  // =============================
  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/productos/${id}/`);
      showToast("Producto eliminado", "success");

      setProductos((prev) => prev.filter((p) => p.id !== id));
    } catch {
      showToast("Error al eliminar producto", "error");
    }
  };

  // =============================
  // UI
  // =============================
  return (
    <motion.div
      className="p-8 min-h-screen bg-gradient-to-br from-[#faf7f1] via-[#f4efe6] to-[#f9f4e9]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold text-[#b08c4e] mb-6 text-center">
        🛠️ Panel Administrador
      </h2>

      <div className="flex justify-center gap-3 mb-6">
        <input
          type="text"
          value={nuevoNombre}
          onChange={(e) => setNuevoNombre(e.target.value)}
          placeholder="Nuevo producto..."
          className="border border-[#e7dcc5] rounded-lg px-4 py-2 
                     focus:ring-2 focus:ring-[#d4b978] outline-none text-[#4b3f2f]"
        />
        <button
          onClick={handleAdd}
          className="bg-gradient-to-r from-[#d4b978] to-[#b9994b] 
                     text-[#3f2e13] px-5 py-2 rounded-lg font-semibold 
                     hover:scale-105 transition-transform"
        >
          ➕ Agregar
        </button>
      </div>

      <div className="max-w-3xl mx-auto bg-white/70 border border-[#e7dcc5] rounded-xl shadow-md p-6">
        <table className="w-full text-sm text-[#4b3f2f]">
          <thead>
            <tr className="border-b border-[#e7dcc5] text-[#b08c4e] font-semibold">
              <th className="py-2">ID</th>
              <th>Nombre</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p) => (
              <motion.tr
                key={p.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-b border-[#e7dcc5]/50 hover:bg-[#faf7f1]"
              >
                <td className="py-2 text-center">{p.id}</td>
                <td className="text-center">{p.nombre}</td>
                <td className="text-center">
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                  >
                    🗑️ Eliminar
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
