export const optimizeImage = (url, width = 600) => {
  if (!url) return null;

  if (!url.includes("res.cloudinary.com")) return url;

  return url.replace(
    "/upload/",
    `/upload/f_auto,q_auto,w_${width}/`
  );
};
