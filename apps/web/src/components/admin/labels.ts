import type { EventStatus, ReportStatus, VenueVerificationState } from "@app-discotecas/shared";

/** Tones disponibles en el componente Badge (ui/Layout). */
export type BadgeTone = "neutral" | "violet" | "pink" | "success" | "danger" | "warning";

/* ---------------------------------------------------------------------------
   Etiquetas en español para estados sin constante compartida
--------------------------------------------------------------------------- */

export const REPORT_STATUS_LABELS: Record<ReportStatus, string> = {
  open: "Abierta",
  reviewing: "En revisión",
  resolved: "Resuelta",
  dismissed: "Desestimada",
};

export const REPORT_STATUS_TONES: Record<ReportStatus, BadgeTone> = {
  open: "warning",
  reviewing: "violet",
  resolved: "success",
  dismissed: "neutral",
};

export const EVENT_STATUS_LABELS: Record<EventStatus, string> = {
  draft: "Borrador",
  published: "Publicado",
  cancelled: "Cancelado",
  archived: "Archivado",
};

export const EVENT_STATUS_TONES: Record<EventStatus, BadgeTone> = {
  draft: "neutral",
  published: "success",
  cancelled: "danger",
  archived: "violet",
};

export const VERIFICATION_LABELS: Record<VenueVerificationState, string> = {
  unverified: "Sin verificar",
  verified: "Verificado",
  disputed: "En disputa",
};

export const VERIFICATION_TONES: Record<VenueVerificationState, BadgeTone> = {
  unverified: "neutral",
  verified: "success",
  disputed: "warning",
};

/** Nombres legibles de las acciones registradas en admin_audit_logs. */
export const AUDIT_ACTION_LABELS: Record<string, string> = {
  suspend_user: "Suspender usuario",
  unsuspend_user: "Reactivar usuario",
  set_venue_verification: "Cambiar verificación de local",
  resolve_report: "Resolver denuncia",
  upsert_event: "Crear o editar evento",
  publish_event: "Publicar evento",
  unpublish_event: "Despublicar evento",
  grant_role: "Conceder rol administrativo",
};

/* ---------------------------------------------------------------------------
   Utilidades de presentación
--------------------------------------------------------------------------- */

/** UUID abreviado para mostrar identificadores sin exponerlos completos. */
export function shortId(id: string | null | undefined): string {
  if (!id) return "—";
  return `${id.slice(0, 8)}…`;
}

export function formatDateTime(value: string | null | undefined): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("es-ES", { dateStyle: "medium", timeStyle: "short" });
}
