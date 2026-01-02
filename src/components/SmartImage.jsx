import { useState } from "react";

/**
 * SmartImage
 * - Blur placeholder (Cloudinary LQIP)
 * - Fade-in cuando la imagen real carga
 * - Optimizado para grids grandes
 */
export default function SmartImage({
  src,
  blur,
  alt = "",
  className = "",
  eager = false,
  fallback = "/fallback.webp",
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Blur placeholder */}
      <img
        src={blur}
        aria-hidden
        className={`absolute inset-0 w-full h-full object-cover scale-110 transition-opacity duration-500 ${
          loaded ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* Imagen real */}
      <img
        src={src}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        fetchpriority={eager ? "high" : "auto"}
        onLoad={() => setLoaded(true)}
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = fallback;
          setLoaded(true);
        }}
        className={`relative z-10 w-full h-full object-cover transition-opacity duration-500 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
