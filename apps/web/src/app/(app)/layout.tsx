import { redirect } from "next/navigation";
import { AppShell } from "@/components/app/AppShell";
import { getSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Layout de las secciones autenticadas.
 * El guard real de datos es RLS + RPC; esto aporta UX correcta.
 */
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    redirect("/login?reason=not-configured");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  return <AppShell>{children}</AppShell>;
}
