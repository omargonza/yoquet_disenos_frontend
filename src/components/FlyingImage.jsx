import { motion } from "framer-motion";

export default function FlyingImage({ imageSrc, startRect, endRect }) {
  const dx = endRect.x - startRect.x;
  const dy = endRect.y - startRect.y;

  return (
    <motion.img
      src={imageSrc}
      initial={{
        x: 0,
        y: 0,
        width: startRect.width,
        height: startRect.height,
        opacity: 1,
        scale: 1,
      }}
      animate={{
        x: dx,
        y: dy,
        width: 40,
        height: 40,
        opacity: 0,
        scale: 0.5,
      }}
      transition={{
        duration: 0.6,
        ease: "easeOut",
      }}
      className="fixed pointer-events-none z-[9999] rounded-lg"
      style={{
        left: startRect.x,
        top: startRect.y,
        willChange: "transform, opacity",
      }}
    />
  );
}
