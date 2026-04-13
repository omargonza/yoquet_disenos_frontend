import { useNavigate } from "react-router-dom";
import { useCarrito } from "../context/CarritoContext";
import { useState, useEffect } from "react";
import logoYoquet from "../assets_opt/optimized/logo_Yoquet.webp";

export default function CartButton() {
  const { totalItems } = useCarrito();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <button
      onClick={() => navigate("/carrito")}
      aria-label="Ir al carrito"
      className="fixed bottom-6 right-6 z-[950] focus:outline-none"
      style={{ 
        WebkitTapHighlightColor: "transparent",
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(12px)',
        transition: 'opacity 0.5s ease, transform 0.5s ease',
      }}
    >
      {/* HALO VISIBLE - mucho más intenso */}
      <div
        className="absolute rounded-2xl"
        style={{
          background: 'radial-gradient(circle at center, rgba(232, 93, 147, 0.5) 0%, rgba(232, 93, 147, 0.3) 35%, rgba(232, 93, 147, 0.1) 60%, transparent 80%)',
          filter: 'blur(10px)',
          width: '160%',
          height: '160%',
          top: '-30%',
          left: '-30%',
          zIndex: -1,
        }}
      />
      
      {/* BOTÓN PRINCIPAL */}
      <div
        className="relative flex items-center justify-center w-14 h-14 rounded-2xl overflow-hidden"
        style={{
          background: "#FFFFFF",
          boxShadow: "0 10px 32px rgba(232, 93, 147, 0.35), 0 4px 12px rgba(45, 36, 48, 0.15)",
          border: '1px solid rgba(232, 93, 147, 0.15)',
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-3px)';
          e.currentTarget.style.boxShadow = '0 14px 40px rgba(232, 93, 147, 0.45), 0 6px 16px rgba(45, 36, 48, 0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 10px 32px rgba(232, 93, 147, 0.35), 0 4px 12px rgba(45, 36, 48, 0.15)';
        }}
      >
        {/* HIGHLIGHT SUPERIOR */}
        <div
          className="absolute top-0 left-2 right-2 h-1.5 opacity-50"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.4) 100%)',
            borderRadius: '8px 8px 0 0',
          }}
        />
        
        <img
          src={logoYoquet}
          alt="Yoquet"
          className="w-9 h-9 object-contain"
          style={{ opacity: 0.98 }}
        />
        
        {totalItems > 0 && (
          <span
            className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold"
            style={{
              background: "#E85D93",
              color: "#FFFFFF",
              boxShadow: "0 2px 6px rgba(232, 93, 147, 0.5)",
            }}
          >
            {totalItems}
          </span>
        )}
      </div>
    </button>
  );
}