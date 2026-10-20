import { z } from "zod";

/**
 * Variables de entorno validadas al arrancar.
 * - `NEXT_PUBLIC_*` se expone al navegador (solo claves públicas).
 * - El resto solo se lee en servidor.
 */
const publicSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_AUTH_PROVIDERS: z.string().default("google,apple,phone"),
  NEXT_PUBLIC_MAP_PROVIDER: z.string().default(""),
  NEXT_PUBLIC_MAPBOX_TOKEN: z.string().default(""),
  NEXT_PUBLIC_CHECKIN_RADIUS_M: z.coerce.number().int().min(50).max(5000).default(500),
});

const serverSchema = publicSchema.extend({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
});

const publicEnv = publicSchema.parse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_AUTH_PROVIDERS: process.env.NEXT_PUBLIC_AUTH_PROVIDERS,
  NEXT_PUBLIC_MAP_PROVIDER: process.env.NEXT_PUBLIC_MAP_PROVIDER,
  NEXT_PUBLIC_MAPBOX_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
  NEXT_PUBLIC_CHECKIN_RADIUS_M: process.env.NEXT_PUBLIC_CHECKIN_RADIUS_M,
});

const serverEnv = serverSchema.parse({
  ...publicEnv,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
});

export const env = publicEnv;

/** true si Supabase está configurado (para mostrar estado "pendiente"). */
export function isSupabaseConfigured(): boolean {
  return Boolean(publicEnv.NEXT_PUBLIC_SUPABASE_URL && publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

/** Proveedores de auth habilitados (configurados en el panel de Supabase). */
export function enabledAuthProviders(): ("google" | "apple" | "phone")[] {
  const allowed = new Set(["google", "apple", "phone"]);
  return publicEnv.NEXT_PUBLIC_AUTH_PROVIDERS.split(",")
    .map((p) => p.trim().toLowerCase())
    .filter((p): p is "google" | "apple" | "phone" => allowed.has(p));
}

export function checkinRadiusMeters(): number {
  return publicEnv.NEXT_PUBLIC_CHECKIN_RADIUS_M;
}

/** Clave de servicio solo en servidor (nunca exponer al cliente). */
export function serviceRoleKey(): string | undefined {
  if (typeof window !== "undefined") return undefined;
  return serverEnv.SUPABASE_SERVICE_ROLE_KEY;
}
