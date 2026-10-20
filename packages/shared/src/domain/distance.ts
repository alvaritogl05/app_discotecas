/**
 * Utilidades de distancia. Se usa solo para distancias APROXIMADAS entre
 * usuarios y locales. Nunca se publican coordenadas exactas de usuarios.
 */
const EARTH_RADIUS_KM = 6371;

export function haversineKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const toRad = (deg: number): number => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(a));
}

/** Distancia aproximada en metros (para check-in por proximidad, orientativa). */
export function distanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  return haversineKm(lat1, lon1, lat2, lon2) * 1000;
}

/**
 * ¿Está el usuario dentro del radio de check-in del local?
 * Es una comprobación orientativa y VOLUNTARIA, nunca una prueba de presencia
 * física: GPS/Red pueden desviarse cientos de metros.
 */
export function isWithinCheckinRadius(
  userLat: number,
  userLon: number,
  venueLat: number,
  venueLon: number,
  radiusMeters: number,
): boolean {
  return distanceMeters(userLat, userLon, venueLat, venueLon) <= radiusMeters;
}

/** Redondea una distancia para mostrarla sin exponer precisión sensible. */
export function approximateDistanceLabel(km: number): string {
  if (!Number.isFinite(km) || km < 0) return "";
  if (km < 1) return "a menos de 1 km";
  if (km < 10) return `a ${Math.round(km)} km`;
  return `a ${Math.round(km / 5) * 5} km`;
}
