import { useNavigate } from "react-router-dom";
import { useCarrito } from "../context/CarritoContext";
import { ShoppingBag } from "lucide-react";

export default function CartButton() {
  const { totalItems } = useCarrito();
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/carrito")}
      aria-label="Ir al carrito"
      className="fixed bottom-6 right-6 z-[950] focus:outline-none"
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      <div
        className="relative flex items-center justify-center w-14 h-14 rounded-full"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,102,179,1), rgba(255,216,90,1), rgba(66,226,184,1))",
          border: "1px solid rgba(255,255,255,0.55)",
          boxShadow: "0 14px 30px rgba(255,102,179,0.18)",
          transition: "transform .12s ease, box-shadow .12s ease",
        }}
      >
        <ShoppingBag size={26} color="#1b140f" />
        {totalItems > 0 && (
          <span
            className="absolute -top-1.5 -right-1.5 flex items-center justify-center
            min-w-5 h-5 px-1 rounded-full text-[11px] font-extrabold"
            style={{
              background: "linear-gradient(135deg, #ff1d8e, var(--color-rosa))",
              color: "white",
              border: "1px solid rgba(255,255,255,0.55)",
              boxShadow: "0 10px 18px rgba(255,29,142,0.18)",
            }}
          >
            {totalItems}
          </span>
        )}
      </div>
    </button>
  );
}
