import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Callback de Supabase Auth: intercambia el código por una sesión y la fija
 * en cookies antes de redirigir al destino seguro.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/explorar";
  // Solo rutas internas como destino.
  const safeNext = next.startsWith("/") ? next : "/explorar";

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing-code`);
  }

  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.redirect(`${origin}/login?reason=not-configured`);
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    console.error("[auth/callback]", error.message);
    return NextResponse.redirect(`${origin}/login?error=exchange-failed`);
  }

  return NextResponse.redirect(`${origin}${safeNext}`);
}
