// src/admin/pages/ProductoEditarAdmin.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getProducto,
  updateProducto,
  getCategorias
} from "../../services/adminProductosApi";

export default function ProductoEditarAdmin() {
  const { id } = useParams();

  const [producto, setProducto] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    cargarProducto();
    cargarCategorias();
  }, []);

  async function cargarProducto() {
    try {
      const data = await getProducto(id);
      setProducto(data);
    } catch (err) {
      console.error("Error cargando producto", err);
    }
  }

  async function cargarCategorias() {
    try {
      const data = await getCategorias();
      setCategorias(data);
    } catch (err) {
      console.error("Error cargando categorías", err);
    }
  }

  async function guardarCambios(e) {
    e.preventDefault();
    setSaving(true);

    try {
      await updateProducto(id, producto);
      alert("Guardado correctamente");
    } catch (err) {
      alert("Error al guardar");
      console.error(err);
    }

    setSaving(false);
  }

  if (!producto) {
    return <div className="p-10 text-gray-700">Cargando producto...</div>;
  }

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-6">Editar Producto</h1>

      <form onSubmit={guardarCambios} className="grid gap-4 max-w-xl">

        {/* NOMBRE */}
        <label className="font-semibold">Nombre</label>
        <input
          className="p-2 border rounded"
          value={producto.nombre}
          onChange={e => setProducto({ ...producto, nombre: e.target.value })}
        />

        {/* DESCRIPCIÓN */}
        <label className="font-semibold">Descripción</label>
        <textarea
          className="p-2 border rounded"
          value={producto.descripcion}
          onChange={e =>
            setProducto({ ...producto, descripcion: e.target.value })
          }
        />

        {/* PRECIO */}
        <label className="font-semibold">Precio</label>
        <input
          type="number"
          className="p-2 border rounded"
          value={producto.precio}
          onChange={e =>
            setProducto({ ...producto, precio: e.target.value })
          }
        />

        {/* STOCK */}
        <label className="font-semibold">Stock</label>
        <input
          type="number"
          className="p-2 border rounded"
          value={producto.stock}
          onChange={e =>
            setProducto({ ...producto, stock: Number(e.target.value) })
          }
        />

        {/* CATEGORÍA */}
        <label className="font-semibold">Categoría</label>
        <select
          className="p-2 border rounded"
          value={producto.categoria_id}
          onChange={e =>
            setProducto({ ...producto, categoria_id: e.target.value })
          }
        >
          {Array.isArray(categorias) &&
            categorias.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.nombre}
              </option>
            ))}
        </select>

        {/* DESTACADO */}
        <label className="flex items-center gap-2 font-semibold">
          <input
            type="checkbox"
            checked={producto.destacado}
            onChange={e =>
              setProducto({ ...producto, destacado: e.target.checked })
            }
          />
          Destacado
        </label>

        {/* GUARDAR */}
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          type="submit"
          disabled={saving}
        >
          {saving ? "Guardando..." : "Guardar Cambios"}
        </button>
      </form>
    </div>
  );
}

