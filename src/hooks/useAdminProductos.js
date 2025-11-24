import { useState, useEffect } from "react";
import { obtenerProductos } from "../services/adminProductosApi";

export function useAdminProductos() {
  const [productos, setProductos] = useState([]);
  const [count, setCount] = useState(0);
  const [pagina, setPagina] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarProductos(pagina);
  }, [pagina]);

  async function cargarProductos(p) {
    try {
      setLoading(true);

      const data = await obtenerProductos(p);

      setProductos(data.results || []);
      setCount(data.count || 0);
    } catch (err) {
      console.error("Error cargando productos admin:", err);
    } finally {
      setLoading(false);
    }
  }

  return {
    productos,
    count,
    pagina,
    setPagina,
    loading,
  };
}
