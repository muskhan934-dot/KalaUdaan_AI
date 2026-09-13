const languageNames = { en: "English", te: "Telugu", hi: "Hindi" };

export function generateProductDetails(input, lang = "en") {
  const craft = input.craft || "Handloom";
  const material = input.material || "Cotton";
  const region = input.region || "Telangana";
  const price = Number(input.price || 0);
  const titleByLang = {
    en: `Traditional ${region} ${material} ${craft}`,
    te: `సంప్రదాయ ${region} ${material} ${craft}`,
    hi: `पारंपरिक ${region} ${material} ${craft}`
  };
  const descriptionByLang = {
    en: `A handcrafted ${material.toLowerCase()} creation inspired by traditional ${region} techniques. Made with patience, skill and the maker's personal touch.`,
    te: `${region} సంప్రదాయ పద్ధతుల ప్రేరణతో ${material}తో చేతితో తయారు చేసిన కళాఖండం. నైపుణ్యం, ఓర్పు, కళాకారుడి ప్రత్యేక స్పర్శతో రూపొందించబడింది.`,
    hi: `${region} की पारंपरिक तकनीकों से प्रेरित ${material} का हस्तनिर्मित शिल्प। धैर्य, कौशल और कारीगर की व्यक्तिगत छाप के साथ बनाया गया है।`
  };
  const suggested = price > 0 ? [Math.max(499, Math.round(price * 0.95)), Math.round(price * 1.15)] : [1699, 2199];
  return { title: titleByLang[lang], description: descriptionByLang[lang], category: craft, materials: material, colors: input.colors || "Earth, Indigo, Gold", tags: [craft.toLowerCase(), material.toLowerCase(), region.toLowerCase(), "traditional", "artisan"], keywords: [craft, material, region, "handmade", "heritage"], suggestedRange: `₹${suggested[0].toLocaleString("en-IN")} – ₹${suggested[1].toLocaleString("en-IN")}`, occasions: ["Weddings", "Festivals", "Gifts"] };
}

export function generateTags(input) { return [input.craft, input.material, input.region, "handmade", "traditional", "artisan"].filter(Boolean); }
export function suggestPrice({ materialCost = 0, labourCost = 0, productionTime = 1, complexity = "medium", category = "Handloom", existingPrice = 0 }) {
  const complexityFactor = { low: 1, medium: 1.12, high: 1.28 }[complexity] || 1.12;
  const productionCost = Number(materialCost) + Number(labourCost) + Math.max(0, Number(productionTime)) * 35;
  const base = Math.max(productionCost * complexityFactor, Number(existingPrice) || 0);
  return { productionCost: Math.round(productionCost), minimum: Math.round(base * 1.18 / 10) * 10, recommended: Math.round(base * 1.45 / 10) * 10, premium: Math.round(base * 1.8 / 10) * 10, category };
}

export function translateContent(text, from, to) {
  if (!text || from === to) return text;
  const dictionaries = {
    te: { saree: "saree", cotton: "cotton", price: "price", rupees: "rupees", made: "made" },
    hi: { saree: "saree", cotton: "cotton", price: "price", rupees: "rupees", made: "made" }
  };
  if (from === "en" && to === "te") return text.replace(/cotton/gi, "కాటన్").replace(/saree/gi, "చీర").replace(/price/gi, "ధర");
  if (from === "en" && to === "hi") return text.replace(/cotton/gi, "कॉटन").replace(/saree/gi, "साड़ी").replace(/price/gi, "कीमत");
  return text;
}

export function detectVoiceProduct(text = "") {
  const q = text.toLowerCase();
  const material = /cotton|కాటన్|कॉटन/.test(q) ? "Cotton" : /terracotta|మట్టి|मिट्टी/.test(q) ? "Terracotta" : "Handmade";
  const priceMatch = q.match(/(?:price|ధర|कीमत)\s*(?:is|:)?\s*₹?\s*([\d,]+)/) || q.match(/([\d,]+)\s*(?:rupees|రూపాయలు|रुपये)/);
  return { material, price: priceMatch ? Number(priceMatch[1].replace(/,/g, "")) : "", language: /[అ-హ]/.test(text) ? "Telugu" : /[ऀ-ॿ]/.test(text) ? "Hindi" : "English", raw: text };
}

export function languageName(lang) { return languageNames[lang] || "English"; }


// Local, transparent verification screening for the prototype. This is NOT government certification.
export function screenSellerVerification(input = {}) {
  const checks = [
    { key: "name", label: "sellerNameCheck", pass: Boolean(input.name?.trim()) },
    { key: "craft", label: "craftCheck", pass: Boolean(input.craft?.trim()) },
    { key: "region", label: "regionCheck", pass: Boolean(input.region?.trim()) },
    { key: "experience", label: "experienceCheck", pass: Number(input.experience) >= 1 },
    { key: "document", label: "documentCheck", pass: Boolean(input.documentName) }
  ];
  const passed = checks.filter((c) => c.pass).length;
  const qualified = passed === checks.length;
  return {
    qualified,
    score: Math.round((passed / checks.length) * 100),
    checks,
    message: qualified ? "Screening complete. You can publish products." : "Complete the remaining verification checks before publishing."
  };
}
