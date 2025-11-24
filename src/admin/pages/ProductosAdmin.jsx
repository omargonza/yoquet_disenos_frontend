import { Link } from "react-router-dom";
import { useAdminProductos } from "../../hooks/useAdminProductos";

export default function ProductosAdmin() {
  const { productos, count, pagina, setPagina, loading } = useAdminProductos();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Productos</h2>

      {loading && <p>Cargando...</p>}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {productos.map((prod) => (
          <Link
            key={prod.id}
            to={`/admin/productos/${prod.id}`}
            className="bg-white border rounded p-3 shadow hover:shadow-lg transition"
          >
            <img
              src={prod.imagen}
              alt={prod.nombre}
              className="w-full h-40 object-cover rounded"
            />
            <h3 className="mt-2 font-semibold">{prod.nombre}</h3>
            <p className="text-sm text-gray-600">{prod.categoria_nombre}</p>
          </Link>
        ))}
      </div>

      <div className="flex gap-4 mt-6">
        <button
          onClick={() => setPagina(pagina - 1)}
          disabled={pagina === 1}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Anterior
        </button>

        <button
          onClick={() => setPagina(pagina + 1)}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Siguiente
        </button>
      </div>

      <p className="mt-3 text-sm text-gray-500">
        Total productos: {count}
      </p>
    </div>
  );
}
