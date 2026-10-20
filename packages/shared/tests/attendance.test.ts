import { describe, expect, it } from "vitest";
import {
  allowedTransitions,
  canTransition,
  computeCounters,
  isValidAttendanceStatus,
  validateTransition,
} from "../src/domain/attendance";

describe("máquina de estados de asistencia", () => {
  it("planned puede pasar a confirmed o cancelled", () => {
    expect(canTransition("planned", "confirmed")).toBe(true);
    expect(canTransition("planned", "cancelled")).toBe(true);
    expect(canTransition("planned", "checked_in")).toBe(false);
  });

  it("confirmed puede pasar a checked_in o cancelled", () => {
    expect(canTransition("confirmed", "checked_in")).toBe(true);
    expect(canTransition("confirmed", "cancelled")).toBe(true);
  });

  it("checked_in no retrocede a confirmed", () => {
    expect(canTransition("checked_in", "confirmed")).toBe(false);
  });

  it("cancelled se puede reactivar", () => {
    expect(canTransition("cancelled", "planned")).toBe(true);
    expect(canTransition("cancelled", "confirmed")).toBe(true);
  });

  it("un estado nunca transiciona a sí mismo (idempotencia la resuelve el servidor)", () => {
    expect(canTransition("planned", "planned")).toBe(false);
  });

  it("lista de transiciones permitidas por estado", () => {
    expect([...allowedTransitions("checked_in")]).toEqual(["cancelled"]);
  });
});

describe("validateTransition", () => {
  it("rechaza estados desconocidos", () => {
    const r = validateTransition("planned", "volando");
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toBe("invalid_status");
  });

  it("una asistencia nueva solo puede iniciar en planned o confirmed", () => {
    expect(validateTransition(null, "planned").ok).toBe(true);
    expect(validateTransition(null, "confirmed").ok).toBe(true);
    const r = validateTransition(null, "checked_in");
    expect(r.ok).toBe(false);
  });

  it("misma entrada y salida se acepta como idempotente", () => {
    expect(validateTransition("confirmed", "confirmed").ok).toBe(true);
  });

  it("transición ilegal produce error con mensaje", () => {
    const r = validateTransition("planned", "checked_in");
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.message).toContain("planned");
  });
});

describe("computeCounters (transparentes, sin inventar aforo)", () => {
  it("cuenta por separado confirmadas y check-ins", () => {
    const c = computeCounters([
      { status: "planned" },
      { status: "planned" },
      { status: "confirmed" },
      { status: "checked_in" },
      { status: "cancelled" },
    ]);
    expect(c.planned).toBe(2);
    expect(c.confirmed).toBe(2); // 1 confirmed + 1 checked_in
    expect(c.checkedIn).toBe(1);
  });

  it("las cancelaciones no cuentan", () => {
    const c = computeCounters([
      { status: "cancelled" },
      { status: "cancelled" },
    ]);
    expect(c).toMatchObject({ planned: 0, confirmed: 0, checkedIn: 0 });
  });

  it("con cero entradas devuelve ceros (estado vacío)", () => {
    expect(computeCounters([])).toEqual({ venueId: "", date: "", planned: 0, confirmed: 0, checkedIn: 0 });
  });
});

describe("isValidAttendanceStatus", () => {
  it("valida solo los estados del catálogo", () => {
    expect(isValidAttendanceStatus("planned")).toBe(true);
    expect(isValidAttendanceStatus("confirmed")).toBe(true);
    expect(isValidAttendanceStatus("checked_in")).toBe(true);
    expect(isValidAttendanceStatus("cancelled")).toBe(true);
    expect(isValidAttendanceStatus("aforo_real")).toBe(false);
  });
});
