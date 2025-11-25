import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

export default function LogoutButton() {
  const { logout } = useAuth();

  return (
    <motion.button
      onClick={logout}
      whileTap={{ scale: 0.90 }}
      className="
        w-12 h-12 rounded-full flex items-center justify-center
        bg-gradient-to-br from-[#ff66b3] to-[#ffd85a]
        shadow-xl text-black text-2xl font-bold
        hover:opacity-90 transition-all
      "
      title="Cerrar sesión"
    >
      ⎋
    </motion.button>
  );
}
