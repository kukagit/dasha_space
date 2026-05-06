export function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load: " + src));
    img.src = src;
  });
}

export function drawSprite(ctx, img, cx, cy, size) {
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(
    img,
    Math.round(cx - size / 2),
    Math.round(cy - size / 2),
    size,
    size
  );
}
