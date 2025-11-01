import { motion } from "framer-motion";

/**
 * Imagen que vuela visualmente hacia el carrito
 * con traza dorada y fade-out suave
 */
export default function FlyingImage({ imageSrc, startRect, endRect }) {
  const x = endRect.x - startRect.x;
  const y = endRect.y - startRect.y;

  return (
    <>
      {/* Imagen voladora */}
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
          scale: 0.4,
          rotate: 20,
        }}
        transition={{
          duration: 0.9,
          ease: [0.25, 0.8, 0.5, 1],
        }}
        className="fixed pointer-events-none z-[9999] rounded-lg border border-[#d4b978]/50 shadow-[0_0_20px_rgba(212,185,120,0.5)]"
      />

      {/* Traza luminosa */}
      <motion.div
        initial={{
          x: startRect.x,
          y: startRect.y,
          width: startRect.width,
          height: 3,
          opacity: 0.8,
          rotate: 15,
        }}
        animate={{
          x,
          y,
          width: 0,
          opacity: 0,
        }}
        transition={{
          duration: 0.9,
          ease: [0.25, 0.8, 0.5, 1],
        }}
        className="fixed pointer-events-none z-[9998] bg-gradient-to-r from-[#ffd85a] via-[#ff66b3] to-[#42e2b8] rounded-full blur-sm"
      />
    </>
  );
}
