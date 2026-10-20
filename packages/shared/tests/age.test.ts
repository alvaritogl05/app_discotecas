import { describe, expect, it } from "vitest";
import {
  ageErrorMessage,
  calculateAge,
  maxBirthDateFor18,
  modesAreCompatible,
  parseBirthDate,
  validateAge,
} from "../src/validation/age";

describe("parseBirthDate", () => {
  it("acepta fechas válidas", () => {
    expect(parseBirthDate("2000-06-15")).toBeInstanceOf(Date);
  });

  it("rechaza formato incorrecto", () => {
    expect(parseBirthDate("15/06/2000")).toBeNull();
    expect(parseBirthDate("2000-6-5")).toBeNull();
    expect(parseBirthDate("hoy")).toBeNull();
  });

  it("rechaza fechas de calendario inexistentes", () => {
    expect(parseBirthDate("2000-02-30")).toBeNull();
    expect(parseBirthDate("2001-02-29")).toBeNull(); // 2001 no es bisiesto
    expect(parseBirthDate("2000-02-29")).toBeInstanceOf(Date); // 2000 sí lo es
  });
});

describe("calculateAge", () => {
  const today = new Date("2026-10-20T12:00:00Z");

  it("calcula la edad antes del cumpleaños", () => {
    expect(calculateAge("2000-11-01", today)).toBe(25);
  });

  it("calcula la edad después del cumpleaños", () => {
    expect(calculateAge("2000-10-20", today)).toBe(26);
    expect(calculateAge("2000-10-19", today)).toBe(26);
  });

  it("devuelve NaN con fecha inválida", () => {
    expect(Number.isNaN(calculateAge("no-una-fecha", today))).toBe(true);
  });
});

describe("validateAge (control de edad +18)", () => {
  const today = new Date("2026-10-20T12:00:00Z");

  it("rechaza a menores de 18 años", () => {
    expect(validateAge("2010-01-01", today)).toEqual({ ok: false, error: "underage" });
    expect(validateAge("2008-10-21", today)).toEqual({ ok: false, error: "underage" });
  });

  it("acepta a alguien que cumple 18 justo hoy", () => {
    expect(validateAge("2008-10-20", today)).toEqual({ ok: true, age: 18 });
  });

  it("acepta a mayores de edad", () => {
    expect(validateAge("1995-05-05", today)).toEqual({ ok: true, age: 31 });
  });

  it("rechaza fechas futuras", () => {
    expect(validateAge("2030-01-01", today)).toEqual({ ok: false, error: "future" });
  });

  it("rechaza formatos inválidos", () => {
    expect(validateAge("ayer", today)).toEqual({ ok: false, error: "invalid_format" });
  });

  it("rechaza edades implausibles", () => {
    expect(validateAge("1800-01-01", today)).toEqual({ ok: false, error: "too_old" });
  });

  it("mensaje de error en español para menores", () => {
    expect(ageErrorMessage("underage")).toContain("18 años");
    expect(ageErrorMessage(undefined)).toBeNull();
  });
});

describe("maxBirthDateFor18", () => {
  it("devuelve la fecha límite para cumplir 18 hoy", () => {
    expect(maxBirthDateFor18(new Date("2026-10-20T12:00:00Z"))).toBe("2008-10-20");
  });
});

describe("modesAreCompatible", () => {
  it("romantic + romantic => compatible", () => {
    expect(modesAreCompatible("romantic", "romantic")).toBe(true);
  });
  it("social + social => compatible", () => {
    expect(modesAreCompatible("social", "social")).toBe(true);
  });
  it("romantic + social => incompatible", () => {
    expect(modesAreCompatible("romantic", "social")).toBe(false);
  });
  it("both es compatible con cualquiera", () => {
    expect(modesAreCompatible("both", "romantic")).toBe(true);
    expect(modesAreCompatible("both", "social")).toBe(true);
    expect(modesAreCompatible("social", "both")).toBe(true);
  });
});
