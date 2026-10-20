import { ATTENDANCE_STATUSES, type AttendanceStatus } from "../constants";
import type { VenueAttendanceCounters } from "../types";

/**
 * Máquina de estados de asistencia a un local en una fecha.
 * Reglas:
 *  - planned → confirmed → checked_in
 *  - desde cualquier estado activo se puede cancelar
 *  - cancelled → planned/confirmed reactiva la asistencia
 *  - checked_in no retrocede a confirmed (no se "des-llega")
 */
const ALLOWED_TRANSITIONS: Record<AttendanceStatus, readonly AttendanceStatus[]> = {
  planned: ["confirmed", "cancelled"],
  confirmed: ["checked_in", "cancelled"],
  checked_in: ["cancelled"],
  cancelled: ["planned", "confirmed"],
};

export function canTransition(from: AttendanceStatus, to: AttendanceStatus): boolean {
  if (from === to) return false;
  return ALLOWED_TRANSITIONS[from].includes(to);
}

export function allowedTransitions(from: AttendanceStatus): readonly AttendanceStatus[] {
  return ALLOWED_TRANSITIONS[from];
}

export function isValidAttendanceStatus(value: string): value is AttendanceStatus {
  return (ATTENDANCE_STATUSES as readonly string[]).includes(value);
}

export interface AttendanceTransitionError {
  ok: false;
  error: "invalid_status" | "not_allowed";
  message: string;
}

export type AttendanceTransitionResult =
  | { ok: true; from: AttendanceStatus | null; to: AttendanceStatus }
  | AttendanceTransitionError;

/** Valida una transición con un mensaje claro para la interfaz. */
export function validateTransition(
  from: AttendanceStatus | null,
  to: string,
): AttendanceTransitionResult {
  if (!isValidAttendanceStatus(to)) {
    return { ok: false, error: "invalid_status", message: "Estado de asistencia no válido." };
  }
  // Crear una asistencia nueva solo admite los estados iniciales.
  if (from === null) {
    if (to === "planned" || to === "confirmed") return { ok: true, from: null, to };
    return {
      ok: false,
      error: "not_allowed",
      message: "Una asistencia nueva solo puede iniciarse como 'quiere ir' o 'confirmada'.",
    };
  }
  if (from === to) {
    return { ok: true, from, to };
  }
  if (!canTransition(from, to)) {
    return {
      ok: false,
      error: "not_allowed",
      message: `No se puede pasar de "${from}" a "${to}".`,
    };
  }
  return { ok: true, from, to };
}

/**
 * Contadores transparentes: confirmadas y check-ins se muestran por separado
 * y nunca se fusionan en una cifra que pudiera interpretarse como aforo real.
 * Un usuario con check-in cuenta también como confirmado (llegó), por eso
 * `confirmed` incluye a los que ya hicieron check-in.
 */
export function computeCounters(entries: { status: AttendanceStatus }[]): VenueAttendanceCounters & { venueId: string; date: string } {
  let planned = 0;
  let confirmed = 0;
  let checkedIn = 0;
  for (const e of entries) {
    switch (e.status) {
      case "planned":
        planned += 1;
        break;
      case "confirmed":
        confirmed += 1;
        break;
      case "checked_in":
        checkedIn += 1;
        confirmed += 1; // quien hizo check-in, asistió confirmadamente
        break;
      case "cancelled":
        break;
    }
  }
  return { venueId: "", date: "", planned, confirmed, checkedIn };
}
