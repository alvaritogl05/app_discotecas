import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Proxy (antes `middleware`) de Next 16: refresca la sesión de Supabase y
 * aplica el guard de rutas. La autoridad real es RLS + RPC server-side.
 */
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  // Evita interceptar estáticos y fuentes; el resto pasa por el proxy.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
