import api from "../../src/utils/api";

// === LISTADO PAGINADO ===
export async function obtenerProductos(page = 1) {
  const res = await api.get(`/api/productos/?page=${page}`);
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
