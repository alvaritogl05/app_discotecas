// Consulta Overpass API para obtener locales de nightlife REALES en Barcelona.
// Fuente: OpenStreetMap contributors (ODbL). Requiere atribución.
// Uso: node scripts/fetch-overpass.mjs  (lo usa import-venues.mjs)
import fs from "node:fs/promises";

const QUERY = `[out:json][timeout:120];
area["name"="Barcelona"]["boundary"="administrative"]->.b;
(
  node["amenity"="nightclub"](area.b);
  way["amenity"="nightclub"](area.b);
  node["amenity"="bar"]["outdoor_seating"="yes"]["addr:street"](area.b);
);
out center tags;`;

const ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchOverpass(url) {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      // Overpass exige un User-Agent identificable.
      "User-Agent": "AppDiscotecas/0.1 (open-source nightlife app; contact: admin@localhost)",
    },
    body: "data=" + encodeURIComponent(QUERY),
    signal: AbortSignal.timeout(180_000),
  });
  const text = await res.text();
  if (!res.ok || text.trimStart().startsWith("<")) {
    throw new Error(`HTTP ${res.status}: ${text.slice(0, 120)}`);
  }
  return JSON.parse(text);
}

let data = null;
for (const url of ENDPOINTS) {
  for (let attempt = 1; attempt <= 3 && !data; attempt++) {
    try {
      data = await fetchOverpass(url);
      console.log(`OK ${url} (intento ${attempt})`);
    } catch (e) {
      console.log(`FAIL ${url} intento ${attempt}: ${e.message}`);
      await sleep(5000 * attempt);
    }
  }
  if (data) break;
}

if (!data) {
  console.error("Sin respuesta de Overpass en ningún endpoint.");
  process.exit(1);
}

const named = (data.elements || []).filter((e) => e.tags?.name);
await fs.mkdir("scripts/out", { recursive: true });
await fs.writeFile("scripts/out/overpass_bcn.json", JSON.stringify(named, null, 2));
console.log(`Elementos: ${(data.elements || []).length}; con nombre: ${named.length}`);
