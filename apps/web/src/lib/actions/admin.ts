"use server";

import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseServerClient, actionError, type ActionResult } from "@/lib/supabase/server";
import {
  MUSIC_GENRES,
  type MusicGenre,
  type ReportStatus,
  type VenueVerificationState,
} from "@app-discotecas/shared";

/* ---------------------------------------------------------------------------
   Panel de administración
   Todas las mutaciones pasan por RPCs SECURITY DEFINER que revalidan al admin.
   Aquí además comprobamos sesión + is_admin() antes de tocar nada, por si el
   frontend u otro cliente invocan estas actions directamente.
--------------------------------------------------------------------------- */

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Cliente con sesión válida y rol admin confirmado, o mensaje de error. */
async function requireAdmin(): Promise<{ supabase: SupabaseClient } | { error: string }> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return { error: "Servicio no disponible." };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sesión caducada. Vuelve a iniciar sesión." };

  const { data: isAdmin, error } = await supabase.rpc("is_admin");
  if (error) {
    console.error("[admin/requireAdmin]", error);
    return { error: "No se han podido verificar tus permisos." };
  }
  if (isAdmin !== true) return { error: "No tienes permisos de administración." };

  return { supabase };
}

/* ---------------------------------------------------------------------------
   Usuarios
--------------------------------------------------------------------------- */

/** Suspende o reactiva a un usuario (el estado real lo modela el backend). */
export async function setUserSuspendedAction(
  userId: string,
  suspended: boolean,
): Promise<ActionResult<null>> {
  if (!UUID_RE.test(userId)) return { ok: false, error: "Identificador de usuario no válido." };

  const guard = await requireAdmin();
  if ("error" in guard) return { ok: false, error: guard.error };

  const { error } = await guard.supabase.rpc("admin_set_user_suspended", {
    p_user_id: userId,
    p_suspended: suspended,
    p_reason: suspended ? "Sanción aplicada desde el panel de administración" : null,
  });
  if (error) return actionError(error, "No se ha podido cambiar el estado del usuario.");
  return { ok: true, data: null };
}

/* ---------------------------------------------------------------------------
   Denuncias
--------------------------------------------------------------------------- */

export async function resolveReportAction(
  reportId: string,
  status: ReportStatus,
): Promise<ActionResult<null>> {
  if (!UUID_RE.test(reportId)) return { ok: false, error: "Identificador de denuncia no válido." };
  if (!["open", "reviewing", "resolved", "dismissed"].includes(status)) {
    return { ok: false, error: "Estado de denuncia no válido." };
  }

  const guard = await requireAdmin();
  if ("error" in guard) return { ok: false, error: guard.error };

  const { error } = await guard.supabase.rpc("admin_resolve_report", {
    p_report_id: reportId,
    p_status: status,
  });
  if (error) return actionError(error, "No se ha podido actualizar la denuncia.");
  return { ok: true, data: null };
}

/* ---------------------------------------------------------------------------
   Locales
--------------------------------------------------------------------------- */

export async function setVenueVerificationAction(
  venueId: string,
  state: VenueVerificationState,
): Promise<ActionResult<null>> {
  if (!UUID_RE.test(venueId)) return { ok: false, error: "Identificador de local no válido." };
  if (!["unverified", "verified", "disputed"].includes(state)) {
    return { ok: false, error: "Estado de verificación no válido." };
  }

  const guard = await requireAdmin();
  if ("error" in guard) return { ok: false, error: guard.error };

  const { error } = await guard.supabase.rpc("admin_set_venue_verification", {
    p_venue_id: venueId,
    p_state: state,
  });
  if (error) return actionError(error, "No se ha podido actualizar la verificación del local.");
  return { ok: true, data: null };
}

/** Busca locales por nombre (para el selector del formulario de eventos). */
export async function searchVenuesAction(
  query: string,
): Promise<ActionResult<{ id: string; name: string; city: string }[]>> {
  const q = query.trim();
  if (q.length === 0) return { ok: true, data: [] };

  const guard = await requireAdmin();
  if ("error" in guard) return { ok: false, error: guard.error };

  // Escapa los comodines de ilike para que la búsqueda sea literal.
  const pattern = `%${q.replace(/[\\%_]/g, (m) => `\\${m}`)}%`;
  const { data, error } = await guard.supabase
    .from("venues")
    .select("id, name, city")
    .ilike("name", pattern)
    .order("name", { ascending: true })
    .limit(10);
  if (error) return actionError(error, "No se han podido buscar locales.");
  return { ok: true, data: (data ?? []) as { id: string; name: string; city: string }[] };
}

/* ---------------------------------------------------------------------------
   Eventos
--------------------------------------------------------------------------- */

export interface AdminEventInput {
  /** null = crear un evento nuevo. */
  id: string | null;
  venueId: string;
  title: string;
  description: string | null;
  startsAt: string;
  endsAt: string | null;
  musicGenres: string[];
}

/**
 * Crea o actualiza un evento. El estado se fuerza a "draft": la publicación
 * se hace siempre con admin_publish_event (decisión del backend).
 */
export async function upsertEventAction(input: unknown): Promise<ActionResult<{ id: string }>> {
  const guard = await requireAdmin();
  if ("error" in guard) return { ok: false, error: guard.error };

  const v = input as Partial<AdminEventInput> | null;
  if (!v || typeof v !== "object") return { ok: false, error: "Revisa los datos del formulario." };
  if (v.id !== null && v.id !== undefined && !UUID_RE.test(v.id)) {
    return { ok: false, error: "Identificador de evento no válido." };
  }
  if (typeof v.venueId !== "string" || !UUID_RE.test(v.venueId)) {
    return { ok: false, error: "Selecciona un local válido." };
  }
  const title = typeof v.title === "string" ? v.title.trim() : "";
  if (title.length < 3 || title.length > 120) {
    return { ok: false, error: "El título debe tener entre 3 y 120 caracteres." };
  }
  const description = typeof v.description === "string" ? v.description.trim() : "";
  if (description.length > 2000) {
    return { ok: false, error: "La descripción no puede superar los 2000 caracteres." };
  }
  const startsAt = typeof v.startsAt === "string" ? new Date(v.startsAt) : null;
  if (!startsAt || Number.isNaN(startsAt.getTime())) {
    return { ok: false, error: "Indica una fecha y hora de inicio válidas." };
  }
  const endsAt =
    typeof v.endsAt === "string" && v.endsAt.trim().length > 0 ? new Date(v.endsAt) : null;
  if (endsAt && Number.isNaN(endsAt.getTime())) {
    return { ok: false, error: "La fecha y hora de fin no es válida." };
  }
  if (endsAt && endsAt.getTime() < startsAt.getTime()) {
    return { ok: false, error: "La hora de fin no puede ser anterior a la de inicio." };
  }
  const genres: MusicGenre[] = [];
  if (Array.isArray(v.musicGenres)) {
    for (const g of v.musicGenres) {
      if (typeof g !== "string" || !(MUSIC_GENRES as readonly string[]).includes(g)) {
        return { ok: false, error: "Género musical no válido." };
      }
      genres.push(g as MusicGenre);
    }
  }

  const { data, error } = await guard.supabase.rpc("admin_upsert_event", {
    p_event_id: v.id ?? null,
    p_venue_id: v.venueId,
    p_title: title,
    p_description: description.length > 0 ? description : null,
    p_starts_at: startsAt.toISOString(),
    p_ends_at: endsAt ? endsAt.toISOString() : null,
    p_status: "draft",
    p_music_genres: genres,
  });
  if (error) return actionError(error, "No se ha podido guardar el evento.");
  return { ok: true, data: { id: String(data) } };
}

/** Publica o despublica un evento (vuelve a borrador). */
export async function publishEventAction(
  eventId: string,
  publish: boolean,
): Promise<ActionResult<null>> {
  if (!UUID_RE.test(eventId)) return { ok: false, error: "Identificador de evento no válido." };

  const guard = await requireAdmin();
  if ("error" in guard) return { ok: false, error: guard.error };

  const { error } = await guard.supabase.rpc("admin_publish_event", {
    p_event_id: eventId,
    p_publish: publish,
  });
  if (error) return actionError(error, "No se ha podido cambiar la publicación del evento.");
  return { ok: true, data: null };
}
