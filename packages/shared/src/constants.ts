/**
 * Constantes de dominio compartidas entre web y (futuras) apps móviles.
 * Deben mantenerse en sincronía con las migraciones SQL de Supabase.
 */

/** Géneros musicales admitidos en la plataforma (catálogo curado, no cerrado). */
export const MUSIC_GENRES = [
  "electronic",
  "house",
  "techno",
  "trance",
  "drum_and_bass",
  "reggaeton",
  "latin",
  "hip_hop",
  "rnb",
  "pop",
  "rock",
  "indie",
  "funk",
  "disco",
  "afrobeat",
  "salsa",
  "bachata",
  "urbano",
  "otros",
] as const;

export type MusicGenre = (typeof MUSIC_GENRES)[number];

/** Etiquetas legibles para los géneros (interfaz en español). */
export const MUSIC_GENRE_LABELS: Record<MusicGenre, string> = {
  electronic: "Electrónica",
  house: "House",
  techno: "Techno",
  trance: "Trance",
  drum_and_bass: "Drum & Bass",
  reggaeton: "Reggaetón",
  latin: "Latina",
  hip_hop: "Hip Hop",
  rnb: "R&B",
  pop: "Pop",
  rock: "Rock",
  indie: "Indie",
  funk: "Funk",
  disco: "Disco",
  afrobeat: "Afrobeat",
  salsa: "Salsa",
  bachata: "Bachata",
  urbano: "Urbano",
  otros: "Otros",
};

/** Modos de interacción que un usuario puede activar. */
export const INTERACTION_MODES = ["romantic", "social"] as const;
export type InteractionMode = (typeof INTERACTION_MODES)[number];

/** Preferencia global de descubrimiento. */
export const DISCOVERY_MODES = ["romantic", "social", "both"] as const;
export type DiscoveryMode = (typeof DISCOVERY_MODES)[number];

export const DISCOVERY_MODE_LABELS: Record<DiscoveryMode, string> = {
  romantic: "Ligar",
  social: "Conocer gente",
  both: "Ambos",
};

/** Decisiones de swipe. */
export const SWIPE_DECISIONS = ["like", "pass"] as const;
export type SwipeDecision = (typeof SWIPE_DECISIONS)[number];

/**
 * Estados de asistencia a un local en una fecha concreta.
 * Transiciones permitidas definidas en `domain/attendance.ts`.
 */
export const ATTENDANCE_STATUSES = [
  "planned",
  "confirmed",
  "checked_in",
  "cancelled",
] as const;
export type AttendanceStatus = (typeof ATTENDANCE_STATUSES)[number];

export const ATTENDANCE_STATUS_LABELS: Record<AttendanceStatus, string> = {
  planned: "Quiere ir",
  confirmed: "Asistencia confirmada",
  checked_in: "Check-in realizado",
  cancelled: "Cancelado",
};

/** Estados de una denuncia. */
export const REPORT_STATUSES = ["open", "reviewing", "resolved", "dismissed"] as const;
export type ReportStatus = (typeof REPORT_STATUSES)[number];

export const REPORT_REASONS = [
  "spam",
  "harassment",
  "inappropriate_content",
  "fake_profile",
  "underage",
  "scam",
  "other",
] as const;
export type ReportReason = (typeof REPORT_REASONS)[number];

export const REPORT_REASON_LABELS: Record<ReportReason, string> = {
  spam: "Spam",
  harassment: "Acoso o intimidación",
  inappropriate_content: "Contenido inapropiado",
  fake_profile: "Perfil falso",
  underage: "Posible menor de edad",
  scam: "Estafa",
  other: "Otro motivo",
};

/** Roles administrativos. */
export const ADMIN_ROLES = ["moderator", "admin"] as const;
export type AdminRole = (typeof ADMIN_ROLES)[number];

/** Estados de un evento. */
export const EVENT_STATUSES = ["draft", "published", "cancelled", "archived"] as const;
export type EventStatus = (typeof EVENT_STATUSES)[number];

/** Estados de verificación de un establecimiento. */
export const VENUE_VERIFICATION_STATES = ["unverified", "verified", "disputed"] as const;
export type VenueVerificationState = (typeof VENUE_VERIFICATION_STATES)[number];

/** Categorías de establecimiento (derivadas de OSM y normalizadas). */
export const VENUE_CATEGORIES = ["nightclub", "pub", "bar", "concert_hall", "other"] as const;
export type VenueCategory = (typeof VENUE_CATEGORIES)[number];

/** Límites de negocio usados por la validación en cliente y servidor. */
export const LIMITS = {
  MIN_AGE: 18,
  MAX_AGE: 120,
  BIO_MAX_LENGTH: 500,
  DISPLAY_NAME_MIN: 2,
  DISPLAY_NAME_MAX: 40,
  INTERESTS_MAX: 10,
  MUSIC_FAVORITES_MAX: 6,
  LANGUAGES_MAX: 6,
  MESSAGE_MAX_LENGTH: 2000,
  MESSAGE_MIN_LENGTH: 1,
  GROUP_NAME_MIN: 2,
  GROUP_NAME_MAX: 60,
  GROUP_DESCRIPTION_MAX: 300,
  MAX_PHOTOS_PER_PROFILE: 6,
  /** Máximo de asistentes contabilizados por consulta para evitar abuso. */
  ATTENDANCE_QUERY_PAGE_SIZE: 100,
} as const;

/** Ciudades/zonas de lanzamiento inicial. */
export const LAUNCH_ZONES = [
  "Barcelona",
  "L'Hospitalet de Llobregat",
  "Badalona",
  "Sant Adrià de Besòs",
  "Sant Cugat del Vallès",
  "Castelldefels",
  "Sant Boi de Llobregat",
] as const;

export const APP_NAME = "App Discotecas";
export const APP_TAGLINE = "Tu noche. Tu gente.";
