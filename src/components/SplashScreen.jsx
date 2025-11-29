import { motion } from "framer-motion";
import { useEffect } from "react";
import logo_Yoquet from "../assets_opt/logo_Yoquet.png";

export default function SplashScreen({ onFinish }) {
  // Duración total muy corta
  useEffect(() => {
    const timer = setTimeout(() => onFinish?.(), 1100);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="fixed inset-0 flex flex-col items-center justify-center
                 bg-[#2b2d33] text-white font-[Poppins] z-[9999]"
    >

      {/* LOGO */}
      <motion.img
        src={logo_Yoquet}
        alt="Yoquet Diseños"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45 }}
        className="w-36 sm:w-44 mb-3"
      />

      {/* TÍTULO */}
      <motion.h1
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.35 }}
        className="text-lg sm:text-xl font-semibold bg-gradient-to-r
                   from-[#ff66b3] via-[#ffd85a] to-[#42e2b8]
                   text-transparent bg-clip-text tracking-wide"
      >
        Yoquet Diseños
      </motion.h1>
    </motion.div>
  );
}
