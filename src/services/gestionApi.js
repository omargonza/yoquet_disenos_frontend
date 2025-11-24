// src/services/gestionApi.js
import api from "../../src/utils/api";

// /api/gestion/pendientes/
export function obtenerPendientes() {
  return api.get("/gestion/pendientes/");
}

// /api/gestion/escanear/
export function subirArchivo(filename) {
  return api.post("/gestion/escanear/", { filename });
}

// /api/gestion/escanear/
export function subirLote(lista) {
  return api.post("/gestion/escanear/", { archivos: lista });
}
