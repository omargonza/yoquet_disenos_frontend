import React, { useState } from "react";

export default function SmartImage({
  src,
  blur,
  alt = "",
  className = "",
  eager = false,
  fallback = "/fallback.webp",
  onError,
}) {
  const [loaded, setLoaded] = useState(false);

  const safeBlur = blur || fallback;
  const safeSrc = src || fallback;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        src={safeBlur}
        aria-hidden="true"
        className={`absolute inset-0 w-full h-full object-cover scale-110 transition-opacity duration-500 ${
          loaded ? "opacity-0" : "opacity-100"
        }`}
      />

      <img
        src={safeSrc}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        fetchpriority={eager ? "high" : "auto"}
        onLoad={() => setLoaded(true)}
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = fallback;
          setLoaded(true);
          onError?.();
        }}
        className={`relative z-10 w-full h-full object-cover transition-opacity duration-500 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}

