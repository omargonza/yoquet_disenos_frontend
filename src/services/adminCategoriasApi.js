import api from "./api";

export async function obtenerCategorias() {
  const { data } = await api.get("/api/categorias/");
  return data;
}
