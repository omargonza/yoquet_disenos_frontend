import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export default function PageTransition({ children }) {
  const location = useLocation();

  // Ultra liviano: solo fade + tiny slide.
  // Sin overlay. Sin reflejos. Sin tiempos largos.
  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.14, ease: "easeOut" }}
      className="relative"
    >
      {children}
    </motion.div>
  );
}
