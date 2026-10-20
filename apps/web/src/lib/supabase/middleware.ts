import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { env, isSupabaseConfigured } from "@/lib/env";

/** Rutas que requieren sesión de usuario. */
const PROTECTED_PREFIXES = [
  "/explorar",
  "/personas",
  "/matches",
  "/chats",
  "/perfil",
  "/grupos",
  "/admin",
];

const AUTH_ROUTES = ["/login", "/registro"];

/**
 * Middleware: refresca la sesión de Supabase y protege rutas.
 * La autoridad real sigue siendo RLS + RPC server-side; esto aporta UX.
 */
export async function updateSession(request: NextRequest): Promise<NextResponse> {
  let supabaseResponse = NextResponse.next({ request });

  // Sin configuración de Supabase, no hay sesión: se redirige a /login que
  // mostrará el estado de "configuración pendiente".
  if (!isSupabaseConfigured()) {
    const url = request.nextUrl.clone();
    if (PROTECTED_PREFIXES.some((p) => url.pathname.startsWith(p))) {
      url.pathname = "/login";
      url.searchParams.set("reason", "not-configured");
      return NextResponse.redirect(url);
    }
    return supabaseResponse;
  }

  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL!,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          supabaseResponse = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            supabaseResponse.cookies.set(name, value, options);
          }
        },
      },
    },
  );

  // IMPORTANTE: no ejecutar lógica entre createServerClient y getUser().
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  const isAuthRoute = AUTH_ROUTES.some((p) => pathname.startsWith(p));

  if (!user && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (user && isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/explorar";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
