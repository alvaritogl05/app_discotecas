import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { ShieldIcon } from "@/components/ui/icons";
import { AdminNav } from "@/components/admin/AdminNav";

/**
 * Layout del panel de administración.
 *
 * El AppShell ya lo aplica el layout de `(app)` (que envuelve todas sus
 * rutas), así que aquí no se vuelve a montar para no duplicar la navegación.
 * Este layout añade el guard server-side real de la zona admin: sin sesión o
 * sin rol admin en `admin_roles`, se redirige a /explorar. El backend (RPCs
 * SECURITY DEFINER + RLS) sigue siendo la autoridad última.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    redirect("/explorar");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/explorar");
  }

  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (isAdmin !== true) {
    redirect("/explorar");
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-neon-violet/40 bg-neon-violet/10 px-3 py-1 text-xs font-semibold text-neon-violet">
        <ShieldIcon className="size-4" />
        Área administrativa
      </div>
      <AdminNav />
      {children}
    </div>
  );
}
