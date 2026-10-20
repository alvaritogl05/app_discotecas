import { LIMITS, type DiscoveryMode } from "../constants";

/**
 * Cálculo de edad seguro a partir de una fecha de nacimiento (YYYY-MM-DD).
 * Se usa la fecha "hoy" dada explícitamente para poder testear sin dependencias.
 */
export function calculateAge(birthDate: string, today = new Date()): number {
  const birth = parseBirthDate(birthDate);
  if (!birth) return Number.NaN;
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age -= 1;
  }
  return age;
}

/** Valida formato estricto YYYY-MM-DD y fecha real de calendario. */
export function parseBirthDate(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [y, m, d] = value.split("-").map(Number) as [number, number, number];
  const date = new Date(Date.UTC(y, m - 1, d));
  if (
    date.getUTCFullYear() !== y ||
    date.getUTCMonth() !== m - 1 ||
    date.getUTCDate() !== d
  ) {
    return null;
  }
  return date;
}

export interface AgeValidationResult {
  ok: boolean;
  age?: number;
  error?: "invalid_format" | "future" | "too_old" | "underage";
}

/**
 * Control de edad: la plataforma es exclusiva para mayores de edad.
 * Comprobación orientativa en cliente; la autoridad real es la validación
 * en servidor (RPC + RLS) que no depende del valor que envíe el cliente.
 */
export function validateAge(birthDate: string, today = new Date()): AgeValidationResult {
  const parsed = parseBirthDate(birthDate);
  if (!parsed) return { ok: false, error: "invalid_format" };
  if (parsed.getTime() > today.getTime()) return { ok: false, error: "future" };
  const age = calculateAge(birthDate, today);
  if (!Number.isFinite(age) || age > LIMITS.MAX_AGE) return { ok: false, error: "too_old" };
  if (age < LIMITS.MIN_AGE) return { ok: false, error: "underage" };
  return { ok: true, age };
}

/** Fecha máxima de nacimiento para cumplir 18 años hoy (YYYY-MM-DD). */
export function maxBirthDateFor18(today = new Date()): string {
  const y = today.getFullYear() - LIMITS.MIN_AGE;
  const m = String(today.getMonth() + 1).padStart(2, "0");
  const d = String(today.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

const AGE_ERROR_MESSAGES: Record<string, string> = {
  invalid_format: "Introduce una fecha válida (AAAA-MM-DD).",
  future: "La fecha de nacimiento no puede estar en el futuro.",
  too_old: "Revisa la fecha de nacimiento introducida.",
  underage: "Debes ser mayor de 18 años para usar App Discotecas.",
};

export function ageErrorMessage(error?: string): string | null {
  if (!error) return null;
  return AGE_ERROR_MESSAGES[error] ?? null;
}

/** ¿Coinciden los modos de dos usuarios para permitir un match? */
export function modesAreCompatible(a: DiscoveryMode, b: DiscoveryMode): boolean {
  const aWantsRomantic = a === "romantic" || a === "both";
  const aWantsSocial = a === "social" || a === "both";
  const bWantsRomantic = b === "romantic" || b === "both";
  const bWantsSocial = b === "social" || b === "both";
  return (aWantsRomantic && bWantsRomantic) || (aWantsSocial && bWantsSocial);
}
