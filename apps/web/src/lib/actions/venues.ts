"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { attendanceSchema } from "@app-discotecas/shared";
import { getSupabaseServerClient, actionError, type ActionResult } from "@/lib/supabase/server";

/* ---------------------------------------------------------------------------
   Establecimientos
--------------------------------------------------------------------------- */

export interface VenueListItem {
  id: string;
  name: string;
  address: string | null;
  city: string;
  zone: string | null;
  category: string;
  musicGenres: string[];
  websiteUrl: string | null;
  verification: string;
  dataSource: string;
}

interface VenueRow {
  id: string;
  name: string;
  address: string | null;
  city: string;
  zone: string | null;
  category: string;
  music_genres: string[];
  website_url: string | null;
  instagram_url: string | null;
  verification: string;
  venue_sources: { source_name: string; license: string }[] | null;
}

function mapVenue(row: VenueRow): VenueListItem {
  return {
    id: row.id,
    name: row.name,
    address: row.address,
    city: row.city,
    zone: row.zone,
    category: row.category,
    musicGenres: row.music_genres ?? [],
    websiteUrl: row.website_url,
    verification: row.verification,
    dataSource: row.venue_sources?.[0]?.source_name ?? "interna",
  };
}

const searchSchema = z.object({
  query: z.string().trim().max(80).optional(),
  genre: z.string().optional(),
});

export async function listVenues(input: unknown): Promise<ActionResult<VenueListItem[]>> {
  const parsed = searchSchema.safeParse(input ?? {});
  if (!parsed.success) return { ok: false, error: "Búsqueda no válida." };

  const supabase = await getSupabaseServerClient();
  if (!supabase) return { ok: false, error: "Supabase no está configurado." };

  let query = supabase
    .from("venues")
    .select("id, name, address, city, zone, category, music_genres, website_url, instagram_url, verification, venue_sources(source_name, license)")
    .order("name");

  if (parsed.data.query) {
    query = query.or(`name.ilike.%${parsed.data.query}%,city.ilike.%${parsed.data.query}%`);
  }
  if (parsed.data.genre) {
    // Filtro por array de género (eq sobre array en PostgREST).
    query = query.contains("music_genres", [parsed.data.genre]);
  }

  const { data, error } = await query.limit(100);
  if (error) return actionError(error, "No se han podido cargar los locales.");
  return { ok: true, data: (data as unknown as VenueRow[]).map(mapVenue) };
}

export interface VenueDetail extends VenueListItem {
  phone: string | null;
  openingHours: string | null;
  latitude: number;
  longitude: number;
}

export async function getVenue(venueId: string): Promise<ActionResult<VenueDetail>> {
  const parsed = z.uuid().safeParse(venueId);
  if (!parsed.success) return { ok: false, error: "Local no válido." };

  const supabase = await getSupabaseServerClient();
  if (!supabase) return { ok: false, error: "Supabase no está configurado." };

  const { data, error } = await supabase
    .from("venues")
    .select("id, name, address, city, zone, category, music_genres, website_url, instagram_url, phone, opening_hours, latitude, longitude, verification, venue_sources(source_name, license)")
    .eq("id", parsed.data)
    .maybeSingle();

  if (error) return actionError(error, "No se ha podido cargar el local.");
  if (!data) return { ok: false, error: "Local no encontrado." };

  const row = data as unknown as VenueRow & { phone: string | null; opening_hours: string | null; latitude: number; longitude: number };
  return {
    ok: true,
    data: {
      ...mapVenue(row),
      phone: row.phone,
      openingHours: row.opening_hours,
      latitude: row.latitude,
      longitude: row.longitude,
    },
  };
}

/* ---------------------------------------------------------------------------
   Asistencia ("Esta noche salgo")
--------------------------------------------------------------------------- */

const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine((v) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const d = new Date(`${v}T00:00:00Z`).getTime();
    return d >= today.getTime() && d <= today.getTime() + 30 * 86400_000;
  }, "Fecha no válida.");

export async function setMyAttendance(input: unknown): Promise<ActionResult<{ status: string }>> {
  const parsed = attendanceSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos de asistencia no válidos." };
  }

  const supabase = await getSupabaseServerClient();
  if (!supabase) return { ok: false, error: "Supabase no está configurado." };

  const { data, error } = await supabase.rpc("set_venue_attendance", {
    p_venue_id: parsed.data.venueId,
    p_date: parsed.data.date,
    p_status: parsed.data.status,
    p_mode: parsed.data.mode ?? null,
  });
  if (error) return actionError(error, "No se ha podido actualizar tu asistencia.");

  revalidatePath("/explorar");
  return { ok: true, data: { status: String((data as { status?: string })?.status ?? parsed.data.status) } };
}

export interface AttendanceCounters {
  planned: number;
  confirmed: number;
  checkedIn: number;
}

export async function getAttendanceCounters(
  venueId: string,
  date: string,
): Promise<ActionResult<AttendanceCounters>> {
  const v = z.uuid().safeParse(venueId);
  const d = dateSchema.safeParse(date);
  if (!v.success || !d.success) return { ok: false, error: "Parámetros no válidos." };

  const supabase = await getSupabaseServerClient();
  if (!supabase) return { ok: false, error: "Supabase no está configurado." };

  const { data, error } = await supabase.rpc("venue_attendance_counters", {
    p_venue_id: v.data,
    p_date: d.data,
  });
  if (error) return actionError(error, "No se han podido cargar los contadores.");

  const counters = data as { planned: number; confirmed: number; checked_in: number };
  return {
    ok: true,
    data: {
      planned: counters.planned ?? 0,
      confirmed: counters.confirmed ?? 0,
      checkedIn: counters.checked_in ?? 0,
    },
  };
}

export interface AttendeeEntry {
  userId: string;
  displayName: string;
  photoPath: string | null;
  age: number;
  status: string;
  mode: string | null;
}

export async function listVenueAttendees(
  venueId: string,
  date: string,
): Promise<ActionResult<AttendeeEntry[]>> {
  const v = z.uuid().safeParse(venueId);
  const d = dateSchema.safeParse(date);
  if (!v.success || !d.success) return { ok: false, error: "Parámetros no válidos." };

  const supabase = await getSupabaseServerClient();
  if (!supabase) return { ok: false, error: "Supabase no está configurado." };

  const { data, error } = await supabase.rpc("venue_attendees", {
    p_venue_id: v.data,
    p_date: d.data,
    p_limit: 50,
  });
  if (error) return actionError(error, "No se han podido cargar los asistentes.");

  const rows = (data ?? []) as {
    user_id: string;
    display_name: string;
    photo_path: string | null;
    age: number;
    status: string;
    mode: string | null;
  }[];

  return {
    ok: true,
    data: rows.map((r) => ({
      userId: r.user_id,
      displayName: r.display_name,
      photoPath: r.photo_path,
      age: r.age,
      status: r.status,
      mode: r.mode,
    })),
  };
}

/** Mi asistencia actual para una fecha (para precargar la interfaz). */
export async function getMyAttendance(
  venueId: string,
  date: string,
): Promise<ActionResult<{ status: string; mode: string | null } | null>> {
  const v = z.uuid().safeParse(venueId);
  const d = dateSchema.safeParse(date);
  if (!v.success || !d.success) return { ok: false, error: "Parámetros no válidos." };

  const supabase = await getSupabaseServerClient();
  if (!supabase) return { ok: false, error: "Supabase no está configurado." };

  const { data, error } = await supabase
    .from("venue_attendance")
    .select("status, mode")
    .eq("venue_id", v.data)
    .eq("date", d.data)
    .maybeSingle();

  if (error) return actionError(error, "No se ha podido leer tu asistencia.");
  if (!data) return { ok: true, data: null };
  return { ok: true, data: { status: data.status, mode: data.mode } };
}
