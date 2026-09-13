export function parseBuyerRequest(query = "") {
  const q = query.toLowerCase();
  const budgetMatch = q.match(/(?:under|below|less than|within)\s*₹?\s*([\d,]+)/);
  const budget = budgetMatch ? Number(budgetMatch[1].replace(/,/g, "")) : null;
  const occasion = ["wedding", "weddings", "festival", "festivals", "gift", "gifts", "daily wear", "home decor", "traditional", "corporate gifts"].find((x) => q.includes(x));
  const material = ["cotton", "brass", "terracotta", "wood", "silk"].find((x) => q.includes(x));
  const craft = ["saree", "handloom", "ikat", "pottery", "jewellery", "jewelry", "wood", "kalamkari", "embroidery"].find((x) => q.includes(x));
  const color = ["blue", "red", "maroon", "gold", "cream", "indigo", "magenta"].find((x) => q.includes(x));
  return { budget, occasion, material, craft, color };
}

export function recommendProducts(products, query, activity = {}) {
  const parsed = parseBuyerRequest(query);
  const source = products || [];
  const ranked = source.map((p) => {
    let score = 0;
    const hay = `${p.title?.en || ""} ${p.craft || ""} ${p.region || ""} ${(p.tags || []).join(" ")} ${(p.colors || []).join(" ")}`.toLowerCase();
    if (parsed.budget && p.price <= parsed.budget) score += 5;
    if (parsed.occasion && (p.occasion || []).some((o) => o.toLowerCase().includes(parsed.occasion.replace(/s$/, "")))) score += 4;
    if (parsed.material && hay.includes(parsed.material)) score += 3;
    if (parsed.craft && hay.includes(parsed.craft.replace("saree", "handloom"))) score += 3;
    if (parsed.color && hay.includes(parsed.color)) score += 2;
    if ((activity.wishlist || []).includes(p.id)) score += 4;
    if ((activity.viewed || []).includes(p.id)) score += 2;
    return { product: p, score };
  }).sort((a, b) => b.score - a.score || a.product.price - b.product.price);
  const strong = ranked.filter((x) => x.score > 0).slice(0, 4).map((x) => x.product);
  return strong.length ? strong : source.slice(0, 4);
}

export function visualMatch(products, filename = "") {
  const q = filename.toLowerCase();
  return products.filter((p) => `${p.craft} ${p.region} ${(p.tags || []).join(" ")}`.toLowerCase().split(" ").some((word) => q.includes(word))).slice(0, 4).length ? products.filter((p) => `${p.craft} ${p.region} ${(p.tags || []).join(" ")}`.toLowerCase().split(" ").some((word) => q.includes(word))).slice(0, 4) : products.slice(0, 4);
}
