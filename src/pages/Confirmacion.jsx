import { motion } from "framer-motion";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Confirmacion() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate("/empaquetando"), 1800);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-screen px-6 text-center 
                 bg-[#3b3d45] text-white"
    >
      {/* TARJETA PRINCIPAL */}
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white/85 text-[#3d2b1f] rounded-2xl shadow-xl 
                   border border-[#e7dcc5] w-full max-w-md p-8"
      >
        <h1 className="text-2xl font-bold mb-4 
                       bg-gradient-to-r from-[#ff66b3] via-[#ffd85a] to-[#42e2b8] 
                       bg-clip-text text-transparent">
          Compra confirmada
        </h1>

        <p className="text-sm text-[#5a4a3c] mb-6 leading-relaxed">
          ¡Tu pedido se registró correctamente!  
          Preparando el comprobante digital ✨
        </p>

        {/* TICKET SIMPLE */}
        <div className="border-t border-b border-dashed border-[#b08c4e]/40 py-4 text-sm leading-relaxed">
          <p>
            Estado:{" "}
            <span className="font-semibold text-[#b08c4e]">Pagado ✔️</span>
          </p>
          <p>
            Fecha:{" "}
            <span className="font-semibold">
              {new Date().toLocaleDateString()}
            </span>
          </p>
        </div>

        {/* ÍCONO DECORATIVO LIVIANO */}
        <div className="flex justify-center mt-6">
          <motion.div
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            className="w-20 h-20 rounded-xl flex items-center justify-center 
                       bg-gradient-to-br from-[#ff66b3] via-[#ffd85a] to-[#42e2b8]"
          >
            <span className="text-[#3b3d45] font-bold text-sm">OK</span>
          </motion.div>
        </div>
      </motion.div>

      {/* TEXTO ANIMADO SUTIL Y LIVIANO */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="mt-8 text-sm text-[#f0e4c3]/80"
      >
        Redirigiendo…
      </motion.p>
    </motion.div>
  );
}
