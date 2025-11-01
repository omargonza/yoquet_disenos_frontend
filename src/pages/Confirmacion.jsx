import { motion } from "framer-motion";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Confirmacion() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate("/empaquetando"), 2000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#3b3d45] via-[#5c5f6a] to-[#7d808c] text-[#f8f8f8] font-[Poppins] overflow-hidden"
    >
      {/* ✨ Fondo con reflejo metálico */}
      <motion.div
        className="absolute inset-0 pointer-events-none mix-blend-overlay"
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%"],
          opacity: [0.4, 0.8, 0.4],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        style={{
          backgroundImage:
            "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(212,185,120,0.1), rgba(255,255,255,0.05))",
          backgroundSize: "250% 250%",
        }}
      />

      {/* 🧾 Ticket */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative bg-white/80 backdrop-blur-xl text-[#3d2b1f] rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] w-[90%] max-w-md p-8 border border-[#e7dcc5]"
      >
        <h1 className="text-2xl font-bold text-center mb-4 bg-gradient-to-r from-[#ff66b3] via-[#ffd85a] to-[#42e2b8] bg-clip-text text-transparent">
          Confirmación de compra
        </h1>
        <p className="text-sm text-center text-[#5a4a3c] mb-6">
          ¡Tu pedido fue procesado con éxito!  
          Estamos generando tu comprobante digital 💎
        </p>

        {/* 🧮 Ticket visual */}
        <div className="border-t border-b border-dashed border-[#b08c4e]/40 py-4 text-sm leading-relaxed">
          <p>Cliente: <span className="font-semibold">Lucía Fernández</span></p>
          <p>N° de orden: <span className="font-semibold">#YOQ-{Math.floor(Math.random() * 90000 + 10000)}</span></p>
          <p>Fecha: <span className="font-semibold">{new Date().toLocaleDateString()}</span></p>
          <p>Estado: <span className="text-[#b08c4e] font-semibold">Pagado ✅</span></p>
        </div>

        {/* 🧾 QR decorativo */}
        <div className="flex justify-center mt-6">
          <motion.div
            animate={{ rotate: [0, 3, -3, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-24 h-24 rounded-xl bg-[conic-gradient(from_180deg,#ffd85a_0deg,#ff66b3_120deg,#42e2b8_240deg,#ffd85a_360deg)] flex items-center justify-center"
          >
            <div className="w-16 h-16 bg-[#3b3d45] rounded-md flex items-center justify-center text-xs text-[#ffd85a] font-bold">
              QR
            </div>
          </motion.div>
        </div>

        {/* ✨ Efecto de brillo */}
        <motion.div
          animate={{
            x: ["-120%", "120%"],
            opacity: [0, 0.5, 0],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
        />
      </motion.div>
    </motion.div>
  );
}
