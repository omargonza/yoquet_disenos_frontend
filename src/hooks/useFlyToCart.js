import { useState } from "react";

/**
 * Hook que gestiona las animaciones de imágenes volando al carrito 🛒
 * Se usa junto con el componente <FlyingImage />
 */
export function useFlyToCart() {
  const [flyingItems, setFlyingItems] = useState([]);

  const flyToCart = (imageSrc, startRect, endRect) => {
    const id = Date.now();
    const flight = { id, imageSrc, startRect, endRect };
    setFlyingItems((prev) => [...prev, flight]);

    // Limpiar el vuelo tras 1s
    setTimeout(() => {
      setFlyingItems((prev) => prev.filter((f) => f.id !== id));
    }, 1000);
  };

  return { flyingItems, flyToCart };
}
