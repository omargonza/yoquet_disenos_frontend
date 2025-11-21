import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function ResetSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-6 
                    bg-gradient-to-br from-[#3b3d45] via-[#5c5f6a] to-[#7d808c] text-white">

      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white/10 backdrop-blur-xl p-10 rounded-3xl border border-white/20 
                   shadow-xl text-center max-w-md w-full"
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r 
                      from-[#ff66b3] via-[#ffd85a] to-[#42e2b8] 
                      bg-clip-text text-transparent mb-4">
          ¡Contraseña actualizada! 🔐
        </h1>

        <p className="text-white/80 mb-6">
          Tu contraseña fue restablecida correctamente.  
          Ahora podés iniciar sesión con total seguridad.
        </p>

        <button
          onClick={() => navigate("/login")}
          className="px-6 py-3 rounded-full font-semibold text-black 
                     bg-gradient-to-r from-[#ff66b3] via-[#ffd85a] to-[#42e2b8]
                     shadow-lg hover:scale-[1.05] transition-all">
          Ir al Login ✨
        </button>
      </motion.div>

    </div>
  );
}
