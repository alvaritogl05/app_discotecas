import { describe, expect, it } from "vitest";
import { createsMatch, isTargetVisible, matchKey } from "../src/domain/matching";
import {
  approximateDistanceLabel,
  distanceMeters,
  haversineKm,
  isWithinCheckinRadius,
} from "../src/domain/distance";

describe("reglas de match mutuo", () => {
  it("match solo con interés mutuo", () => {
    expect(createsMatch("like", "like")).toBe(true);
    expect(createsMatch("like", "pass")).toBe(false);
    expect(createsMatch("pass", "like")).toBe(false);
    expect(createsMatch("pass", "pass")).toBe(false);
    expect(createsMatch("like", null)).toBe(false);
  });

  it("la clave de match es simétrica", () => {
    expect(matchKey("a", "b")).toBe(matchKey("b", "a"));
    expect(matchKey("a", "b")).toBe("a:b");
  });
});

describe("visibilidad en descubrimiento", () => {
  const base = {
    viewerId: "v1",
    targetId: "t1",
    targetDiscoverable: true,
    targetSharesAttendanceForThisContext: false,
    viewerHasDecided: false,
    targetBlockedViewer: false,
    viewerBlockedTarget: false,
  };

  it("visible por defecto entre usuarios elegibles", () => {
    expect(isTargetVisible(base)).toBe(true);
  });

  it("nunca se ve el propio perfil", () => {
    expect(isTargetVisible({ ...base, targetId: "v1" })).toBe(false);
  });

  it("no se repiten perfiles ya decididos", () => {
    expect(isTargetVisible({ ...base, viewerHasDecided: true })).toBe(false);
  });

  it("los bloqueos ocultan perfiles en ambos sentidos", () => {
    expect(isTargetVisible({ ...base, targetBlockedViewer: true })).toBe(false);
    expect(isTargetVisible({ ...base, viewerBlockedTarget: true })).toBe(false);
  });

  it("un perfil no descubrible solo aparece si comparte asistencia en ese contexto", () => {
    expect(isTargetVisible({ ...base, targetDiscoverable: false })).toBe(false);
    expect(
      isTargetVisible({
        ...base,
        targetDiscoverable: false,
        targetSharesAttendanceForThisContext: true,
      }),
    ).toBe(true);
  });
});

describe("distancia y check-in orientativo", () => {
  // Plaça de Catalunya y Sagrada Família (Barcelona)
  const cat = { lat: 41.3917, lon: 2.1649 };
  const sagrada = { lat: 41.4036, lon: 2.1744 };

  it("distancia razonable entre puntos conocidos (~1.5 km)", () => {
    const km = haversineKm(cat.lat, cat.lon, sagrada.lat, sagrada.lon);
    expect(km).toBeGreaterThan(1);
    expect(km).toBeLessThan(2.5);
  });

  it("distancia cero entre el mismo punto", () => {
    expect(haversineKm(41.4, 2.17, 41.4, 2.17)).toBe(0);
  });

  it("check-in por proximidad respeta el radio", () => {
    expect(isWithinCheckinRadius(cat.lat, cat.lon, cat.lat, cat.lon, 100)).toBe(true);
    expect(isWithinCheckinRadius(sagrada.lat, sagrada.lon, cat.lat, cat.lon, 200)).toBe(false);
    expect(isWithinCheckinRadius(sagrada.lat, sagrada.lon, cat.lat, cat.lon, 5000)).toBe(true);
  });

  it("etiqueta de distancia aproximada", () => {
    expect(approximateDistanceLabel(0.3)).toBe("a menos de 1 km");
    expect(approximateDistanceLabel(4.4)).toBe("a 4 km");
    expect(approximateDistanceLabel(12)).toBe("a 10 km");
  });

  it("metros coherentes con kilómetros", () => {
    expect(distanceMeters(cat.lat, cat.lon, cat.lat, cat.lon)).toBe(0);
  });
});
