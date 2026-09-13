const CRAFT_HINTS = [
  { keys: ["saree", "sari", "ikat", "loom", "handloom", "textile", "weave", "weaving"], craft: "Handloom", material: "Cotton", region: "Telangana" },
  { keys: ["pottery", "pot", "vase", "clay", "terracotta", "ceramic"], craft: "Pottery", material: "Terracotta", region: "Andhra Pradesh" },
  { keys: ["wood", "carving", "woodcraft", "wooden"], craft: "Wood Craft", material: "Sheesham Wood", region: "Rajasthan" },
  { keys: ["jewel", "jewellery", "jewelry", "necklace", "earring", "bracelet"], craft: "Jewellery", material: "Brass", region: "Gujarat" },
  { keys: ["kalamkari", "painting", "blockprint"], craft: "Kalamkari", material: "Cotton", region: "Andhra Pradesh" },
  { keys: ["embroider", "embroidery", "stitch", "needle"], craft: "Embroidery", material: "Cotton", region: "Karnataka" }
];
function colorName(r, g, b) {
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  if (max < 65) return "Charcoal";
  if (max - min < 22) return max > 190 ? "Cream" : "Earth";
  if (r > g * 1.35 && r > b * 1.3) return r > 170 ? "Rust" : "Maroon";
  if (g > r * 1.15 && g > b * 1.05) return "Green";
  if (b > r * 1.2 && b > g * 1.05) return "Indigo";
  if (r > 150 && b > 100 && g < 120) return "Magenta";
  if (r > 145 && g > 105 && b < 90) return "Gold";
  return "Earth";
}
export async function analyzeProductImage(file, dataUrl) {
  const name = String(file?.name || "").toLowerCase();
  const hint = CRAFT_HINTS.find((item) => item.keys.some((key) => name.includes(key)));
  const result = { source: "local-image-analysis", filename: file?.name || "uploaded-image", type: file?.type || "image/*", size: Number(file?.size || 0), width: 0, height: 0, aspectRatio: 1, dominantColor: "Earth", craft: hint?.craft || "Handloom", material: hint?.material || "Cotton", region: hint?.region || "Telangana", confidence: hint ? "filename + image metadata" : "image metadata + safe default" };
  if (!dataUrl) return result;
  await new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      result.width = img.naturalWidth || 0; result.height = img.naturalHeight || 0; result.aspectRatio = result.height ? result.width / result.height : 1;
      try {
        const size = 72, canvas = document.createElement("canvas"); canvas.width = size; canvas.height = size;
        const ctx = canvas.getContext("2d", { willReadFrequently: true }); if (!ctx) return resolve();
        ctx.drawImage(img, 0, 0, size, size); const pixels = ctx.getImageData(0, 0, size, size).data; let r=0,g=0,b=0,count=0;
        for (let i=0;i<pixels.length;i+=16) { if (pixels[i+3] < 30) continue; r+=pixels[i]; g+=pixels[i+1]; b+=pixels[i+2]; count++; }
        if (count) result.dominantColor = colorName(Math.round(r/count), Math.round(g/count), Math.round(b/count));
      } catch {}
      resolve();
    };
    img.onerror = () => resolve(); img.src = dataUrl;
  });
  return result;
}
