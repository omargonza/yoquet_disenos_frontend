import api from "../utils/api";

// Ajustable sin tocar llamadas
const DEFAULT_PAGE_SIZE = 24;

// === LISTADO PAGINADO ===
export async function obtenerProductos(page = 1, { pageSize = DEFAULT_PAGE_SIZE, search = "" } = {}) {
  const params = new URLSearchParams();
  params.set("page", String(page));
  if (pageSize) params.set("page_size", String(pageSize));
  if (search) params.set("search", search);

  const res = await api.get(`/api/productos/?${params.toString()}`);
  return res.data;
}

// === OBTENER 1 PRODUCTO ===
export async function getProducto(id) {
  const res = await api.get(`/api/productos/${id}/`);
  return res.data;
}

// === ACTUALIZAR ===
export async function updateProducto(id, data) {
  const res = await api.put(`/api/productos/${id}/`, data);
  return res.data;
}

// === CATEGORÍAS ===
export async function getCategorias() {
  const res = await api.get(`/api/categorias/`);
  return res.data;
}
