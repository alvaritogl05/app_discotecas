"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { swipeSchema, messageSchema, blockSchema, reportSchema } from "@app-discotecas/shared";
import { getSupabaseServerClient, actionError, type ActionResult } from "@/lib/supabase/server";

/* ---------------------------------------------------------------------------
   Descubrimiento de personas (swipe)
--------------------------------------------------------------------------- */

export interface CandidateProfile {
  id: string;
  displayName: string;
  age: number;
  bio: string | null;
  interests: string[];
  musicFavorites: string[];
  discoveryMode: string;
  city: string | null;
  photoPath: string | null;
  /** Plan compartido en el mismo local/fecha (contexto de asistencia). */
  sharedPlanStatus?: string | null;
}

interface CandidateRow {
  id: string;
  display_name: string;
  age: number;
  bio: string | null;
  interests: string[];
  music_favorites: string[];
  discovery_mode: string;
  city: string | null;
  photo_path: string | null;
}

function mapCandidate(row: CandidateRow, sharedPlanStatus?: string | null): CandidateProfile {
  return {
    id: row.id,
    displayName: row.display_name,
    age: row.age,
    bio: row.bio,
    interests: row.interests ?? [],
    musicFavorites: row.music_favorites ?? [],
    discoveryMode: row.discovery_mode,
    city: row.city,
    photoPath: row.photo_path,
    sharedPlanStatus: sharedPlanStatus ?? null,
  };
}

/**
 * Lista de perfiles candidatos visibles para el swipe, respetando:
 * descubrimiento general o contexto de asistencia (venue+fecha),
 * preferencias de edad, bloqueos y decisiones previas (RLS + condiciones).
 */
export async function listCandidates(input: {
  venueId?: string;
  date?: string;
  limit?: number;
}): Promise<ActionResult<CandidateProfile[]>> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return { ok: false, error: "Supabase no está configurado." };

  // Contexto de asistencia: la RPC aplica la visibilidad estricta.
  if (input.venueId && input.date) {
    const parsedV = z.uuid().safeParse(input.venueId);
    const parsedD = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).safeParse(input.date);
    if (!parsedV.success || !parsedD.success) return { ok: false, error: "Contexto no válido." };

    const { data, error } = await supabase.rpc("venue_attendees", {
      p_venue_id: parsedV.data,
      p_date: parsedD.data,
      p_limit: input.limit ?? 30,
    });
    if (error) return actionError(error, "No se han podido cargar los perfiles.");

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
        id: r.user_id,
        displayName: r.display_name,
        age: r.age,
        bio: null,
        interests: [],
        musicFavorites: [],
        discoveryMode: r.mode === "romantic" ? "romantic" : r.mode === "social" ? "social" : "both",
        city: null,
        photoPath: r.photo_path,
        sharedPlanStatus: r.status,
      })),
    };
  }

  // Descubrimiento general: perfiles visibles (RLS excluye bloqueos),
  // sin decisión previa del viewer y compatibles en modo.
  const [{ data: me }, { data: prefs }] = await Promise.all([
    supabase.rpc("get_my_profile").maybeSingle(),
    supabase.from("user_preferences").select("*").maybeSingle(),
  ]);
  if (!me) return { ok: false, error: "Completa tu perfil para descubrir personas." };
  const meProfile = me as { id: string; discovery_mode: string };

  const ageMin = prefs?.age_min ?? 18;
  const ageMax = prefs?.age_max ?? 99;

  let query = supabase
    .from("profiles")
    .select("id, display_name, age, bio, interests, music_favorites, discovery_mode, city, photo_path")
    .neq("id", meProfile.id)
    .gte("age", ageMin)
    .lte("age", ageMax)
    .limit(input.limit ?? 30);

  if (meProfile.discovery_mode !== "both") {
    query = query.in("discovery_mode", [meProfile.discovery_mode, "both"]);
  }

  const { data, error } = await query;
  if (error) return actionError(error, "No se han podido cargar los perfiles.");

  // Excluir a quienes ya decidí (la tabla swipes solo es visible para mí).
  const { data: decided } = await supabase.from("swipes").select("target_id");
  const decidedSet = new Set((decided ?? []).map((d) => d.target_id as string));

  const rows = ((data ?? []) as unknown as CandidateRow[]).filter((r) => !decidedSet.has(r.id));
  return { ok: true, data: rows.map((r) => mapCandidate(r)) };
}

export interface SwipeResult {
  matched: boolean;
  matchId: string | null;
}

export async function recordSwipe(input: unknown): Promise<ActionResult<SwipeResult>> {
  const parsed = swipeSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Acción no válida." };

  const supabase = await getSupabaseServerClient();
  if (!supabase) return { ok: false, error: "Supabase no está configurado." };

  const { data, error } = await supabase.rpc("handle_swipe", {
    p_target_id: parsed.data.targetId,
    p_decision: parsed.data.decision,
    p_mode: parsed.data.mode,
    p_venue_id: parsed.data.venueId ?? null,
    p_date: parsed.data.date ?? null,
  });
  if (error) return actionError(error, "No se ha podido registrar tu decisión.");

  const result = data as { matched?: boolean; match_id?: string | null };
  revalidatePath("/matches");
  return {
    ok: true,
    data: { matched: Boolean(result?.matched), matchId: result?.match_id ?? null },
  };
}

/* ---------------------------------------------------------------------------
   Matches y conversaciones
--------------------------------------------------------------------------- */

export interface MatchItem {
  id: string;
  partnerId: string;
  partnerName: string;
  partnerAge: number | null;
  partnerPhotoPath: string | null;
  conversationId: string | null;
  createdAt: string;
}

export async function listMatches(): Promise<ActionResult<MatchItem[]>> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return { ok: false, error: "Supabase no está configurado." };

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return { ok: false, error: "Sesión caducada." };
  const me = userData.user.id;

  const { data, error } = await supabase
    .from("matches")
    .select("id, user_a, user_b, created_at, conversations(id, conversation_members(user_id))")
    .order("created_at", { ascending: false });

  if (error) return actionError(error, "No se han podido cargar tus matches.");

  const rows = (data ?? []) as {
    id: string;
    user_a: string;
    user_b: string;
    created_at: string;
    conversations: { id: string; conversation_members: { user_id: string }[] }[] | null;
  }[];

  const partnerIds = rows.map((r) => (r.user_a === me ? r.user_b : r.user_a));
  if (partnerIds.length === 0) return { ok: true, data: [] };

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, display_name, age, photo_path")
    .in("id", partnerIds);
  const byId = new Map((profiles ?? []).map((p) => [p.id as string, p]));

  return {
    ok: true,
    data: rows.map((r) => {
      const partnerId = r.user_a === me ? r.user_b : r.user_a;
      const profile = byId.get(partnerId) as
        | { display_name: string; age: number; photo_path: string | null }
        | undefined;
      return {
        id: r.id,
        partnerId,
        partnerName: profile?.display_name ?? "Usuario",
        partnerAge: profile?.age ?? null,
        partnerPhotoPath: profile?.photo_path ?? null,
        conversationId: r.conversations?.[0]?.id ?? null,
        createdAt: r.created_at,
      };
    }),
  };
}

export interface MessageItem {
  id: string;
  senderId: string;
  body: string;
  createdAt: string;
}

export async function listMessages(conversationId: string): Promise<ActionResult<MessageItem[]>> {
  const parsed = z.uuid().safeParse(conversationId);
  if (!parsed.success) return { ok: false, error: "Conversación no válida." };

  const supabase = await getSupabaseServerClient();
  if (!supabase) return { ok: false, error: "Supabase no está configurado." };

  const { data, error } = await supabase
    .from("messages")
    .select("id, sender_id, body, created_at")
    .eq("conversation_id", parsed.data)
    .order("created_at", { ascending: true })
    .limit(200);

  if (error) return actionError(error, "No se han podido cargar los mensajes.");

  return {
    ok: true,
    data: ((data ?? []) as { id: string; sender_id: string; body: string; created_at: string }[]).map(
      (m) => ({ id: m.id, senderId: m.sender_id, body: m.body, createdAt: m.created_at }),
    ),
  };
}

export async function sendMessage(input: unknown): Promise<ActionResult<MessageItem>> {
  const parsed = messageSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Mensaje no válido." };
  }
  const supabase = await getSupabaseServerClient();
  if (!supabase) return { ok: false, error: "Supabase no está configurado." };

  const { data, error } = await supabase.rpc("send_message", {
    p_conversation_id: parsed.data.conversationId,
    p_body: parsed.data.body,
  });
  if (error) return actionError(error, "No se ha podido enviar el mensaje.");

  const message = data as { id: string; sender_id: string; body: string; created_at: string };
  revalidatePath("/chats");
  return {
    ok: true,
    data: {
      id: message.id,
      senderId: message.sender_id,
      body: message.body,
      createdAt: message.created_at,
    },
  };
}

/* ---------------------------------------------------------------------------
   Seguridad: bloqueo y denuncia
--------------------------------------------------------------------------- */

export async function blockUser(input: unknown): Promise<ActionResult<null>> {
  const parsed = blockSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Usuario no válido." };

  const supabase = await getSupabaseServerClient();
  if (!supabase) return { ok: false, error: "Supabase no está configurado." };

  const { error } = await supabase.rpc("block_user", { p_blocked_id: parsed.data.blockedId });
  if (error) return actionError(error, "No se ha podido bloquear a este usuario.");
  revalidatePath("/personas");
  revalidatePath("/chats");
  return { ok: true, data: null };
}

export async function reportUser(input: unknown): Promise<ActionResult<null>> {
  const parsed = reportSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Denuncia no válida." };

  const supabase = await getSupabaseServerClient();
  if (!supabase) return { ok: false, error: "Supabase no está configurado." };

  const { error } = await supabase.rpc("report_user", {
    p_reported_id: parsed.data.reportedId,
    p_reason: parsed.data.reason,
    p_details: parsed.data.details && parsed.data.details.length > 0 ? parsed.data.details : null,
    p_venue_id: null,
  });
  if (error) return actionError(error, "No se ha podido enviar la denuncia.");
  return { ok: true, data: null };
}
