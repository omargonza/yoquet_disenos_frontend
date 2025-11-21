import { motion } from "framer-motion";

/**
 * FlyingImage Ultra-Light
 * Animación optimizada al máximo para móviles.
 */
export default function FlyingImage({ imageSrc, startRect, endRect }) {
  const x = endRect.x - startRect.x;
  const y = endRect.y - startRect.y;

  return (
    <motion.img
      src={imageSrc}
      initial={{
        x: startRect.x,
        y: startRect.y,
        width: startRect.width,
        height: startRect.height,
        opacity: 1,
        scale: 1,
      }}
      animate={{
        x,
        y,
        width: 40,
        height: 40,
        opacity: 0,
        scale: 0.5,
      }}
      transition={{
        duration: 0.65,
        ease: "easeOut",
      }}
      className="fixed pointer-events-none z-[9999] rounded-lg"
      style={{
        willChange: "transform, opacity",
      }}
    />
  );
}
