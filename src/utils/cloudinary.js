export const optimizeImage = (
  url,
  {
    w = 600,
    h,
    crop = "fill",   // fill | fit | crop
    quality = "auto",
    format = "auto",
    dpr = "auto",
  } = {}
) => {
  if (!url || typeof url !== "string") return "/fallback.webp";
  if (!url.includes("res.cloudinary.com")) return url;
  if (!url.includes("/image/upload/")) return url;

  const parts = [
    `f_${format}`,
    `q_${quality}`,
    `dpr_${dpr}`,
    w ? `w_${w}` : null,
    h ? `h_${h}` : null,
    crop ? `c_${crop}` : null,
  ].filter(Boolean);

  return url.replace(
    "/image/upload/",
    `/image/upload/${parts.join(",")}/`
  );
};
