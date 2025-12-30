import { motion } from "framer-motion";
import logo_Yoquet from "../assets_opt/logo_Yoquet.png";

export default function SplashScreen() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{
        background:
          "radial-gradient(circle at 18% 18%, rgba(255,102,179,0.12) 0%, transparent 55%)," +
          "radial-gradient(circle at 82% 22%, rgba(255,216,90,0.12) 0%, transparent 55%)," +
          "radial-gradient(circle at 55% 90%, rgba(66,226,184,0.12) 0%, transparent 60%)," +
          "var(--color-crema)",
      }}
    >
      <div className="flex flex-col items-center">
        <motion.img
          src={logo_Yoquet}
          alt="Yoquet Diseños"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.22 }}
          className="w-40 sm:w-44"
        />
        <div
          className="mt-3 text-sm font-extrabold"
          style={{
            background: "linear-gradient(90deg, var(--color-rosa), var(--color-dorado), var(--color-turquesa))",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          Preparando el cotillón…
        </div>
      </div>
    </motion.div>
  );
}
