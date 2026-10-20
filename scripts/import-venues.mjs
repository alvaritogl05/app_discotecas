#!/usr/bin/env node
/**
 * Importa establecimientos REALES de OpenStreetMap (Overpass API) a la base
 * de datos de Supabase, generando un fichero SQL idempotente.
 *
 * Fuente: © OpenStreetMap contributors — licencia ODbL.
 * La atribución y la licencia quedan registradas en `venue_sources`.
 * Google Places NO se usa: sus condiciones prohíben persistir sus datos.
 *
 * Uso:
 *   1) node scripts/fetch-overpass.mjs      # descarga scripts/out/overpass_bcn.json
 *   2) node scripts/import-venues.mjs       # genera supabase/seed/venues_barcelona.sql
 *   3) Aplica el SQL con Supabase CLI:      supabase db push
 *      o pégalo en el SQL Editor del panel de Supabase.
 *
 * El script no envía datos a ningún servidor: solo genera el SQL local.
 */
import fs from "node:fs/promises";
import path from "node:path";

const SOURCE = {
  name: "OpenStreetMap",
  url: "https://www.openstreetmap.org/",
  license: "ODbL-1.0",
};

/**
 * Área de lanzamiento: Barcelona y alrededores metropolitanos.
 * El bbox evita importar locales de otras provincias que el área de OSM
 * pudiera incluir.
 */
const BBOX = {
  latMin: 41.25,
  latMax: 41.55,
  lonMin: 1.9,
  lonMax: 2.35,
};

const INPUT = path.join(import.meta.dirname, "out", "overpass_bcn.json");
const OUTPUT_DIR = path.join(import.meta.dirname, "..", "supabase", "seed");
const OUTPUT = path.join(OUTPUT_DIR, "venues_barcelona.sql");

/** Normaliza las etiquetas OSM a nuestros tipos. */
function mapCategory(tags) {
  if (tags.amenity === "nightclub") return "nightclub";
  if (tags.amenity === "pub") return "pub";
  if (tags.amenity === "bar") return "bar";
  if (tags.amenity === "music_venue") return "concert_hall";
  return "other";
}

const GENRE_KEYWORDS = {
  electronic: /electronic|dance/i,
  house: /house/i,
  techno: /techno/i,
  reggaeton: /reggaeton/i,
  hip_hop: /hip.?hop/i,
  pop: /\bpop\b/i,
  latin: /latin/i,
  funk: /funk/i,
  disco: /disco/i,
  rock: /rock/i,
};

function mapGenres(tags, category) {
  const raw = `${tags.music ?? ""} ${tags.genres ?? ""} ${tags.genre ?? ""}`;
  const found = [];
  for (const [genre, re] of Object.entries(GENRE_KEYWORDS)) {
    if (re.test(raw)) found.push(genre);
  }
  // Los locales de ocio nocturno sin música declarada quedan sin géneros:
  // no inventamos datos.
  if (found.length === 0 && category === "pub") return [];
  return found;
}

function sqlString(value) {
  if (value === null || value === undefined || value === "") return "null";
  return `'${String(value).replace(/'/g, "''")}'`;
}

function sqlArray(values) {
  if (!values || values.length === 0) return "'{}'";
  return `'{${values.map((v) => `"${v}"`).join(",")}}'`;
}

const raw = await fs.readFile(INPUT, "utf8").catch(() => null);
if (!raw) {
  console.error(`No se encuentra ${INPUT}. Ejecuta antes: node scripts/fetch-overpass.mjs`);
  process.exit(1);
}

const elements = JSON.parse(raw);
const importedAt = new Date().toISOString();
const lines = [
  "-- ====================================================================",
  "-- Establecimientos importados de OpenStreetMap (fuente verificable)",
  "-- Generado por scripts/import-venues.mjs",
  `-- Fecha de importación: ${importedAt}`,
  "-- Fuente: © OpenStreetMap contributors — licencia ODbL-1.0",
  "-- Idempotente: puedes ejecutarlo varias veces (upsert por osm_id).",
  "-- ====================================================================",
  "",
  "begin;",
  "",
];

let count = 0;
const seen = new Set();

for (const element of elements) {
  const tags = element.tags ?? {};
  const name = tags.name;
  const lat = element.lat ?? element.center?.lat;
  const lon = element.lon ?? element.center?.lon;
  if (!name || typeof lat !== "number" || typeof lon !== "number") continue;
  // Solo el área metropolitana de lanzamiento (Barcelona y alrededores).
  if (lat < BBOX.latMin || lat > BBOX.latMax || lon < BBOX.lonMin || lon > BBOX.lonMax) {
    continue;
  }
  if (seen.has(element.id)) continue;
  seen.add(element.id);

  const category = mapCategory(tags);
  const genres = mapGenres(tags, category);
  const address = [tags["addr:street"], tags["addr:housenumber"]]
    .filter(Boolean)
    .join(" ")
    .trim();
  // Ciudad: la de OSM si existe; si no, se infiere con cautela por posición.
  const CITY_CORE = { latMin: 41.35, latMax: 41.46, lonMin: 2.06, lonMax: 2.23 };
  const inCore =
    lat >= CITY_CORE.latMin && lat <= CITY_CORE.latMax && lon >= CITY_CORE.lonMin && lon <= CITY_CORE.lonMax;
  const city = tags["addr:city"] ?? (inCore ? "Barcelona" : "Área metropolitana");
  const website = tags.website ?? tags["contact:website"] ?? null;
  const instagram = tags.instagram
    ? `https://instagram.com/${String(tags.instagram).replace(/^@/, "")}`
    : null;

  lines.push(
    [
      // venues (upsert por osm_id)
      `insert into public.venues (osm_id, name, address, latitude, longitude, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours)`,
      `values (${sqlString(element.id)}, ${sqlString(name)}, ${sqlString(address)}, ${lat}, ${lon}, ${sqlString(city)}, ${sqlString(tags["addr:suburb"] ?? null)}, ${sqlString(category)}, ${sqlArray(genres)}, ${sqlString(website)}, ${sqlString(instagram)}, ${sqlString(tags.phone ?? tags["contact:phone"] ?? null)}, ${sqlString(tags.opening_hours ?? null)})`,
      `on conflict (osm_id) do update set`,
      `  name = excluded.name, address = excluded.address, latitude = excluded.latitude,`,
      `  longitude = excluded.longitude, city = excluded.city, zone = excluded.zone,`,
      `  category = excluded.category, music_genres = excluded.music_genres,`,
      `  website_url = excluded.website_url, instagram_url = excluded.instagram_url,`,
      `  phone = excluded.phone, opening_hours = excluded.opening_hours;`,
      // venue_sources (trazabilidad)
      `insert into public.venue_sources (venue_id, source_name, source_url, license, raw_tags)`,
      `select v.id, ${sqlString(SOURCE.name)}, ${sqlString(SOURCE.url)}, ${sqlString(SOURCE.license)}, ${sqlString(JSON.stringify(tags))}::jsonb`,
      `from public.venues v where v.osm_id = ${sqlString(element.id)};`,
      "",
    ].join("\n"),
  );
  count += 1;
}

lines.push("commit;", "");

await fs.mkdir(OUTPUT_DIR, { recursive: true });
await fs.writeFile(OUTPUT, lines.join("\n"), "utf8");

console.log(`Generado ${OUTPUT} con ${count} establecimientos.`);
console.log(`Fuente: ${SOURCE.name} (${SOURCE.license}). Atribución incluida.`);
