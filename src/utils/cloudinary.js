const isCloudinary = (url) => typeof url === "string" && url.includes("res.cloudinary.com");
const isHttp = (url) => typeof url === "string" && /^https?:\/\//i.test(url);

export const optimizeImage = (url, opts = 600) => {
  // Si no hay URL → null (que luego convertimos a fallback)
  if (!url) return null;

  // Si es un asset local (/fallback.webp) o no es cloudinary → devolvé tal cual
  if (!isHttp(url) || !isCloudinary(url)) return url;

  // Soporta 2 firmas:
  // 1) optimizeImage(url, 600)
  // 2) optimizeImage(url, { w, h, crop, quality, format })
  let w, h, crop, quality, format;

  if (typeof opts === "number") {
    w = opts;
  } else if (opts && typeof opts === "object") {
    w = opts.w;
    h = opts.h;
    crop = opts.crop;
    quality = opts.quality;
    format = opts.format;
  }

  const parts = ["f_auto", "q_auto"];
  if (w) parts.push(`w_${w}`);
  if (h) parts.push(`h_${h}`);
  if (crop) parts.push(`c_${crop}`);
  if (quality) parts.push(`q_${quality}`);
  if (format) parts.push(`f_${format}`);

  // Insertamos transforms justo después de /upload/
  // Ej: /upload/.... -> /upload/f_auto,q_auto,w_600,h_448,c_fill/....
  return url.replace("/upload/", `/upload/${parts.join(",")}/`);
};
