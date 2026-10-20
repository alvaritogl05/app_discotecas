import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { env, isSupabaseConfigured } from "@/lib/env";

/**
 * Cliente Supabase para Server Components, Server Actions y Route Handlers.
 * La sesión llega por cookies (gestionadas por @supabase/ssr).
 */
export async function getSupabaseServerClient(): Promise<SupabaseClient | null> {
  if (!isSupabaseConfigured()) return null;
  const cookieStore = await cookies();
  return createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL!,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Llamado desde un Server Component: el middleware refresca la sesión.
          }
        },
      },
    },
  );
}

/** Usuario autenticado o null. */
export async function getAuthenticatedUser(): Promise<User | null> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * Resultado tipado para Server Actions: nunca filtrar errores internos al
 * cliente. Se devuelve un mensaje genérico y se loguea el detalle real.
 */
export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

export function actionError(error: unknown, fallback = "Ha ocurrido un error. Inténtalo de nuevo."): ActionResult<never> {
  if (error instanceof Error) {
    // Los errores de dominio escritos para el usuario se muestran tal cual.
    if (
      error.message.includes("mayor de 18") ||
      error.message.includes("no permitida") ||
      error.message.includes("no válido") ||
      error.message.includes("No puedes") ||
      error.message.includes("No eres") ||
      error.message.includes("Solo los miembros") ||
      error.message.includes("No disponible") ||
      error.message.includes("No encontrado") ||
      error.message.includes("ya fue respondida") ||
      error.message.includes("Fuera del rango") ||
      error.message.includes("Longitud")
    ) {
      return { ok: false, error: error.message };
    }
  }
  console.error("[server-action]", error);
  return { ok: false, error: fallback };
}
