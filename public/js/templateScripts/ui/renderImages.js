export function renderImages(images, containerId) {
  const container = document.getElementById(containerId);
  if (!images || images.length === 0) return;

  const urls = Array.isArray(images) ? images : JSON.parse(images);
  urls.forEach((url) => {
    const img = document.createElement("img");
    img.classList.add("templateImage");
    img.src = url;
    container.appendChild(img);
  });
}
