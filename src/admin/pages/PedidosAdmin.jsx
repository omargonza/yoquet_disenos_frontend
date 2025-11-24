import AdminLayout from "../layout/AdminLayout";

export default function PedidosAdmin() {
  return (
    <AdminLayout>
      <h1 style={{ fontSize: "2rem", fontWeight: 700 }}>Pedidos</h1>

      <p style={{ marginTop: "10px" }}>
        Aquí podrás visualizar y gestionar los pedidos realizados.
      </p>
    </AdminLayout>
  );
}
