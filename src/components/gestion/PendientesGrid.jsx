import ProductoCard from "./ProductoCard.jsx";

export default function PendientesGrid({ pendientes, refrescar }) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {pendientes.map(item => (
                <ProductoCard key={item.filename} item={item} refrescar={refrescar} />
            ))}
        </div>
    );
}
