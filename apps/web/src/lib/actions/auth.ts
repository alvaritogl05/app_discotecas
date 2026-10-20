"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getSupabaseServerClient, actionError, type ActionResult } from "@/lib/supabase/server";
import { enabledAuthProviders, isSupabaseConfigured } from "@/lib/env";
import { profileFormSchema, preferencesSchema, phoneSchema, otpSchema } from "@app-discotecas/shared";

/* ---------------------------------------------------------------------------
   Autenticación
--------------------------------------------------------------------------- */

/** Inicio de sesión con Google/Apple vía Supabase OAuth. */
export async function signInWithOAuth(provider: "google" | "apple"): Promise<ActionResult<{ url: string }>> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Supabase no está configurado todavía." };
  }
  if (!enabledAuthProviders().includes(provider)) {
    return { ok: false, error: `El proveedor ${provider} no está habilitado.` };
  }

  const supabase = await getSupabaseServerClient();
  if (!supabase) return { ok: false, error: "Servicio no disponible." };

  const headerList = await headers();
  const origin = headerList.get("origin") ?? headerList.get("referer") ?? "http://localhost:3000";
  const callback = `${new URL(origin).origin}/auth/callback`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: callback },
  });
  if (error) return actionError(error, "No se ha podido iniciar el proceso de acceso.");
  return { ok: true, data: { url: data.url } };
}

/** Envía un código SMS al teléfono indicado (OTP de Supabase). */
export async function requestSmsCode(rawPhone: string): Promise<ActionResult<{ phone: string }>> {
  const parsed = phoneSchema.safeParse({ phone: rawPhone });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Teléfono no válido.", fieldErrors: parsed.error.flatten().fieldErrors as never };
  }
  const supabase = await getSupabaseServerClient();
  if (!supabase) return { ok: false, error: "Servicio no disponible." };

  const { error } = await supabase.auth.signInWithOtp({
    phone: parsed.data.phone,
    options: { shouldCreateUser: true },
  });
  if (error) return actionError(error, "No se ha podido enviar el código. Inténtalo más tarde.");
  return { ok: true, data: { phone: parsed.data.phone } };
}

/** Confirma el código SMS y crea la sesión. */
export async function verifySmsCode(rawPhone: string, rawToken: string): Promise<ActionResult<null>> {
  const phoneParsed = phoneSchema.safeParse({ phone: rawPhone });
  const tokenParsed = otpSchema.safeParse({ token: rawToken });
  if (!phoneParsed.success || !tokenParsed.success) {
    return { ok: false, error: "Revisa el teléfono y el código introducido." };
  }
  const supabase = await getSupabaseServerClient();
  if (!supabase) return { ok: false, error: "Servicio no disponible." };

  const { data, error } = await supabase.auth.verifyOtp({
    phone: phoneParsed.data.phone,
    token: tokenParsed.data.token,
    type: "sms",
  });
  if (error) return actionError(error, "El código no es válido o ha caducado.");
  if (!data.session) return { ok: false, error: "No se ha podido crear la sesión." };
  return { ok: true, data: null };
}

export async function signOut(): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (supabase) {
    await supabase.auth.signOut();
  }
  redirect("/login");
}

/* ---------------------------------------------------------------------------
   Perfil y preferencias
--------------------------------------------------------------------------- */

const profileInputSchema = profileFormSchema;

export async function saveProfile(input: unknown): Promise<ActionResult<null>> {
  const parsed = profileInputSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Revisa los datos del formulario.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }
  const supabase = await getSupabaseServerClient();
  if (!supabase) return { ok: false, error: "Servicio no disponible." };
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Sesión caducada. Vuelve a iniciar sesión." };

  const values = parsed.data;
  const { error } = await supabase
    .from("profiles")
    .upsert({
      id: user.id,
      display_name: values.displayName,
      birth_date: values.birthDate,
      bio: values.bio && values.bio.length > 0 ? values.bio : null,
      interests: values.interests ?? [],
      music_favorites: values.musicFavorites ?? [],
      languages: values.languages ?? [],
      discovery_mode: values.discoveryMode,
      city: values.city && values.city.length > 0 ? values.city : "Barcelona",
    });
  if (error) {
    if (error.message.includes("18")) {
      return { ok: false, error: "Debes ser mayor de 18 años para usar App Discotecas." };
    }
    return actionError(error, "No se ha podido guardar el perfil.");
  }

  // Preferencias por defecto en la creación del perfil.
  await supabase.from("user_preferences").upsert({ user_id: user.id }, { onConflict: "user_id" });
  return { ok: true, data: null };
}

export async function savePreferences(input: unknown): Promise<ActionResult<null>> {
  const parsed = preferencesSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Revisa los filtros de descubrimiento.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }
  const supabase = await getSupabaseServerClient();
  if (!supabase) return { ok: false, error: "Servicio no disponible." };
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Sesión caducada." };

  const v = parsed.data;
  const { error } = await supabase.from("user_preferences").upsert({
    user_id: user.id,
    age_min: v.ageMin,
    age_max: v.ageMax,
    max_distance_km: v.maxDistanceKm,
    genres: v.genres,
    discoverable: v.discoverable,
    share_attendance: v.shareAttendance,
    show_age: v.showAge,
    show_city: v.showCity,
  });
  if (error) return actionError(error, "No se han podido guardar las preferencias.");
  return { ok: true, data: null };
}

/** Lee el perfil del usuario autenticado (incluye su birth_date privado). */
export async function getMyProfile(): Promise<{
  profile: Record<string, unknown> | null;
  preferences: Record<string, unknown> | null;
  configured: boolean;
}> {
  if (!isSupabaseConfigured()) return { profile: null, preferences: null, configured: false };
  const supabase = await getSupabaseServerClient();
  if (!supabase) return { profile: null, preferences: null, configured: false };
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { profile: null, preferences: null, configured: true };

  const [{ data: profile }, { data: preferences }] = await Promise.all([
    supabase.rpc("get_my_profile").maybeSingle(),
    supabase.from("user_preferences").select("*").eq("user_id", user.id).maybeSingle(),
  ]);
  return {
    profile: profile as Record<string, unknown> | null,
    preferences: preferences as Record<string, unknown> | null,
    configured: true,
  };
}
