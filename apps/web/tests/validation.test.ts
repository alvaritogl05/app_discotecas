import { describe, expect, it } from "vitest";
import { cn } from "@/components/ui/Button";
import {
  profileFormSchema,
  preferencesSchema,
  swipeSchema,
  messageSchema,
  attendanceSchema,
  reportSchema,
} from "@app-discotecas/shared";

describe("cn", () => {
  it("une clases y descarta falsy", () => {
    expect(cn("a", false && "b", undefined, "c")).toBe("a c");
  });
});

describe("validación de formulario de perfil (cliente y servidor comparten schema)", () => {
  const valid = {
    displayName: "Marta",
    birthDate: "1998-05-12",
    bio: "Me gustan los afterworks",
    interests: ["música"],
    musicFavorites: ["techno"],
    languages: ["Español"],
    discoveryMode: "both",
    city: "Barcelona",
  };

  it("acepta un perfil válido", () => {
    expect(profileFormSchema.safeParse(valid).success).toBe(true);
  });

  it("rechaza el registro de menores de edad", () => {
    const result = profileFormSchema.safeParse({ ...valid, birthDate: "2012-01-01" });
    expect(result.success).toBe(false);
  });

  it("rechaza nombres demasiado cortos", () => {
    const result = profileFormSchema.safeParse({ ...valid, displayName: "M" });
    expect(result.success).toBe(false);
  });
});

describe("preferencias", () => {
  it("rechaza rangos de edad invertidos", () => {
    const result = preferencesSchema.safeParse({
      ageMin: 40,
      ageMax: 25,
      maxDistanceKm: 10,
      genres: [],
      discoverable: true,
      shareAttendance: true,
      showAge: true,
      showCity: true,
    });
    expect(result.success).toBe(false);
  });

  it("acepta un rango correcto", () => {
    const result = preferencesSchema.safeParse({
      ageMin: 22,
      ageMax: 35,
      maxDistanceKm: 15,
      genres: ["house"],
      discoverable: true,
      shareAttendance: false,
      showAge: true,
      showCity: false,
    });
    expect(result.success).toBe(true);
  });
});

describe("acciones sociales", () => {
  it("el swipe exige uuid y decisión válida", () => {
    expect(swipeSchema.safeParse({ targetId: "123", decision: "like", mode: "social" }).success).toBe(false);
    expect(
      swipeSchema.safeParse({ targetId: "3f6a2a1e-0b5c-4d6e-8f90-1234567890ab", decision: "like", mode: "romantic" })
        .success,
    ).toBe(true);
  });

  it("el mensaje tiene longitud mínima y máxima", () => {
    const id = "3f6a2a1e-0b5c-4d6e-8f90-1234567890ab";
    expect(messageSchema.safeParse({ conversationId: id, body: "" }).success).toBe(false);
    expect(messageSchema.safeParse({ conversationId: id, body: "hola" }).success).toBe(true);
    expect(messageSchema.safeParse({ conversationId: id, body: "x".repeat(2001) }).success).toBe(false);
  });

  it("la asistencia valida la fecha (hoy..+30 días)", () => {
    const venueId = "3f6a2a1e-0b5c-4d6e-8f90-1234567890ab";
    const today = new Date();
    const iso = (d: Date) => d.toISOString().slice(0, 10);
    const yesterday = new Date(today.getTime() - 86400_000);
    const far = new Date(today.getTime() + 60 * 86400_000);
    expect(attendanceSchema.safeParse({ venueId, date: iso(yesterday), status: "planned" }).success).toBe(false);
    expect(attendanceSchema.safeParse({ venueId, date: iso(far), status: "planned" }).success).toBe(false);
    expect(attendanceSchema.safeParse({ venueId, date: iso(today), status: "planned" }).success).toBe(true);
    expect(attendanceSchema.safeParse({ venueId, date: iso(today), status: "volando" }).success).toBe(false);
  });

  it("la denuncia valida motivo y límite de detalles", () => {
    const reportedId = "3f6a2a1e-0b5c-4d6e-8f90-1234567890ab";
    expect(reportSchema.safeParse({ reportedId, reason: "spam", details: "" }).success).toBe(true);
    expect(reportSchema.safeParse({ reportedId, reason: "motivo_inventado", details: "" }).success).toBe(false);
    expect(reportSchema.safeParse({ reportedId, reason: "spam", details: "x".repeat(1001) }).success).toBe(false);
  });
});
