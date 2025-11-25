import api from "../utils/api";   // <-- instancia correcta con interceptores

export async function obtenerCategorias() {
  const { data } = await api.get("/api/categorias/");
  return data;
}
