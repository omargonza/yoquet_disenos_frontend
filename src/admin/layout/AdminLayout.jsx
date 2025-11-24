import { Outlet, Link } from "react-router-dom";
import AdminTopBar from "./AdminTopBar";

export default function AdminLayout() {
    return (
        <div className="min-h-screen flex">

            {/* SIDEBAR */}
            <nav className="flex flex-col gap-4">

                <a
                    href="/"
                    className="text-sm text-blue-600 font-semibold border-b pb-2 mb-4"
                >
                    ← Volver a la tienda
                </a>

                <a href="/admin" className="hover:text-blue-600">Dashboard</a>
                <a href="/admin/productos" className="hover:text-blue-600">Productos</a>
                <a href="/admin/categorias" className="hover:text-blue-600">Categorias</a>
                <a href="/admin/pedidos" className="hover:text-blue-600">Pedidos</a>
            </nav>

            <aside className="bg-white w-64 border-r border-gray-200 p-6 fixed h-full shadow-sm">
                <h2 className="text-xl font-bold mb-6">Administrador</h2>

                <nav className="flex flex-col gap-4 text-gray-700">
                    <Link to="/admin" className="hover:text-blue-600">Dashboard</Link>
                    <Link to="/admin/productos" className="hover:text-blue-600">Productos</Link>
                    <Link to="/admin/categorias" className="hover:text-blue-600">Categorías</Link>
                    <Link to="/admin/pedidos" className="hover:text-blue-600">Pedidos</Link>
                </nav>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 ml-64 bg-gray-50 min-h-screen">
                <AdminTopBar />
                <div className="p-8">
                    <Outlet />
                </div>
            </main>

        </div>
    );
}
