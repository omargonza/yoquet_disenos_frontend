import { useState, useEffect } from "react";
import { obtenerProductos } from "../services/adminProductosApi";

export function useAdminProductos() {
  const [productos, setProductos] = useState([]);
  const [count, setCount] = useState(0);
  const [pagina, setPagina] = useState(1);
  const [loading, setLoading] = useState(false);

  // NUEVO: paginación real DRF
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);

  useEffect(() => {
    cargarProductos(pagina);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagina]);

  async function cargarProductos(p) {
    try {
      setLoading(true);

      const data = await obtenerProductos(p);

      setProductos(Array.isArray(data?.results) ? data.results : []);
      setCount(Number(data?.count || 0));

      // DRF pagination: next/previous suelen ser URL o null
      setHasNext(Boolean(data?.next));
      setHasPrev(Boolean(data?.previous));
    } catch (err) {
      console.error("Error cargando productos admin:", err);
      setProductos([]);
      setCount(0);
      setHasNext(false);
      setHasPrev(p > 1); // fallback
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
    hasNext,
    hasPrev,
  };
}
