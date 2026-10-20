import { z } from "zod";
import {
  DISCOVERY_MODES,
  LIMITS,
  MUSIC_GENRES,
  REPORT_REASONS,
  SWIPE_DECISIONS,
} from "../constants";
import { validateAge } from "./age";

/** Fecha de nacimiento válida y mayor de edad. */
export const birthDateSchema = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Introduce una fecha válida (AAAA-MM-DD).")
  .refine((v) => validateAge(v).ok, {
    message: "Debes ser mayor de 18 años para usar App Discotecas.",
  });

export const displayNameSchema = z
  .string()
  .trim()
  .min(LIMITS.DISPLAY_NAME_MIN, `Mínimo ${LIMITS.DISPLAY_NAME_MIN} caracteres.`)
  .max(LIMITS.DISPLAY_NAME_MAX, `Máximo ${LIMITS.DISPLAY_NAME_MAX} caracteres.`);

export const bioSchema = z
  .string()
  .trim()
  .max(LIMITS.BIO_MAX_LENGTH, `Máximo ${LIMITS.BIO_MAX_LENGTH} caracteres.`);

export const musicGenresSchema = z
  .array(z.enum(MUSIC_GENRES))
  .max(LIMITS.MUSIC_FAVORITES_MAX, `Máximo ${LIMITS.MUSIC_FAVORITES_MAX} géneros.`);

export const interestsSchema = z
  .array(z.string().trim().min(2).max(30))
  .max(LIMITS.INTERESTS_MAX, `Máximo ${LIMITS.INTERESTS_MAX} intereses.`);

export const languagesSchema = z
  .array(z.string().trim().min(2).max(30))
  .max(LIMITS.LANGUAGES_MAX, `Máximo ${LIMITS.LANGUAGES_MAX} idiomas.`);

export const discoveryModeSchema = z.enum(DISCOVERY_MODES);

/** Formulario de creación/edición de perfil. */
export const profileFormSchema = z.object({
  displayName: displayNameSchema,
  birthDate: birthDateSchema,
  bio: bioSchema.optional().or(z.literal("")),
  interests: interestsSchema.optional().default([]),
  musicFavorites: musicGenresSchema.optional().default([]),
  languages: languagesSchema.optional().default([]),
  discoveryMode: discoveryModeSchema,
  city: z.string().trim().min(2).max(80).optional().or(z.literal("")),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

/** Preferencias de descubrimiento y privacidad. */
export const preferencesSchema = z
  .object({
    ageMin: z.coerce.number().int().min(LIMITS.MIN_AGE).max(99),
    ageMax: z.coerce.number().int().min(LIMITS.MIN_AGE).max(99),
    maxDistanceKm: z.coerce.number().int().min(1).max(200),
    genres: z.array(z.enum(MUSIC_GENRES)).max(10).optional().default([]),
    discoverable: z.boolean(),
    shareAttendance: z.boolean(),
    showAge: z.boolean(),
    showCity: z.boolean(),
  })
  .refine((v) => v.ageMin <= v.ageMax, {
    message: "La edad mínima no puede ser mayor que la máxima.",
    path: ["ageMax"],
  });

export type PreferencesFormValues = z.infer<typeof preferencesSchema>;

/** Login por teléfono (Supabase OTP SMS). */
export const phoneSchema = z.object({
  phone: z
    .string()
    .trim()
    .regex(/^\+[1-9]\d{6,14}$/, "Introduce el teléfono en formato internacional, p. ej. +34612345678."),
});

export const otpSchema = z.object({
  token: z.string().trim().regex(/^\d{6}$/, "El código tiene 6 dígitos."),
});

/** Swipe. */
export const swipeSchema = z.object({
  targetId: z.uuid(),
  decision: z.enum(SWIPE_DECISIONS),
  mode: z.enum(["romantic", "social"]),
  /** Contexto opcional: asistencia a un local en una fecha. */
  venueId: z.uuid().optional(),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
});

/** Mensaje de chat. */
export const messageSchema = z.object({
  conversationId: z.uuid(),
  body: z
    .string()
    .trim()
    .min(LIMITS.MESSAGE_MIN_LENGTH, "El mensaje no puede estar vacío.")
    .max(LIMITS.MESSAGE_MAX_LENGTH, `Máximo ${LIMITS.MESSAGE_MAX_LENGTH} caracteres.`),
});

/** Asistencia a un local. */
export const attendanceSchema = z.object({
  venueId: z.uuid(),
  /** Fecha de la salida: hoy o futuro cercano. */
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .refine((v) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const d = new Date(`${v}T00:00:00Z`).getTime();
      const max = today.getTime() + 30 * 86400_000;
      return d >= today.getTime() && d <= max;
    }, "Selecciona una fecha entre hoy y los próximos 30 días."),
  status: z.enum(["planned", "confirmed", "checked_in", "cancelled"]),
  mode: z.enum(["romantic", "social"]).optional(),
});

/** Grupo de amigos. */
export const groupFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(LIMITS.GROUP_NAME_MIN, `Mínimo ${LIMITS.GROUP_NAME_MIN} caracteres.`)
    .max(LIMITS.GROUP_NAME_MAX, `Máximo ${LIMITS.GROUP_NAME_MAX} caracteres.`),
  description: z
    .string()
    .trim()
    .max(LIMITS.GROUP_DESCRIPTION_MAX, `Máximo ${LIMITS.GROUP_DESCRIPTION_MAX} caracteres.`)
    .optional()
    .or(z.literal("")),
});

export const groupInviteSchema = z.object({
  groupId: z.uuid(),
  inviteeId: z.uuid(),
});

/** Denuncia de usuario. */
export const reportSchema = z.object({
  reportedId: z.uuid(),
  reason: z.enum(REPORT_REASONS),
  details: z
    .string()
    .trim()
    .max(1000, "Máximo 1000 caracteres.")
    .optional()
    .or(z.literal("")),
});

/** Bloqueo. */
export const blockSchema = z.object({
  blockedId: z.uuid(),
});

/** Búsqueda/filtros de personas. */
export const discoveryFiltersSchema = z.object({
  ageMin: z.coerce.number().int().min(LIMITS.MIN_AGE).max(99).optional(),
  ageMax: z.coerce.number().int().min(LIMITS.MIN_AGE).max(99).optional(),
  genres: z.array(z.enum(MUSIC_GENRES)).max(10).optional(),
  mode: z.enum(["romantic", "social"]).optional(),
  /** Contexto: "general" o la asistencia a un local/fecha. */
  venueId: z.uuid().optional(),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
});
