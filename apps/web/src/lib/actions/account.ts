"use server";

import { getSupabaseServerClient, actionError, type ActionResult } from "@/lib/supabase/server";

/**
 * Eliminación de la cuenta del usuario autenticado.
 * Usa la RPC `delete_my_account()` (SECURITY DEFINER) que invoca
 * auth.delete_user(), disponible para el propio usuario autenticado.
 * El schema aplica ON DELETE CASCADE en profiles y todas sus relaciones.
 * La política RGPD completa (retención de copias de seguridad, etc.) está
 * documentada en docs/seguridad-rgpd.md y requiere revisión jurídica.
 */
export async function deleteMyAccount(): Promise<ActionResult<null>> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return { ok: false, error: "Servicio no disponible." };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Sesión caducada." };

  const { error } = await supabase.rpc("delete_my_account");
  if (error) {
    return actionError(error, "No se ha podido eliminar la cuenta. Contacta con soporte.");
  }
  return { ok: true, data: null };
}
