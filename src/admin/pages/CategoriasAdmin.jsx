import AdminLayout from "../layout/AdminLayout";

export default function CategoriasAdmin() {
  return (
    <AdminLayout>
      <h1 style={{ fontSize: "2rem", fontWeight: 700 }}>Categorías</h1>

      <p style={{ marginTop: "10px" }}>
        Aquí vas a poder administrar las categorías de productos.
      </p>
    </AdminLayout>
  );
}
