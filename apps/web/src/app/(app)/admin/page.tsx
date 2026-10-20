import Link from "next/link";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { Card, EmptyState, ErrorState, SectionTitle } from "@/components/ui/Layout";
import { CalendarIcon, FlagIcon, UsersIcon } from "@/components/ui/icons";
import { formatDateTime } from "@/components/admin/labels";

interface DraftEventRow {
  id: string;
  title: string;
  starts_at: string;
  venues: { name: string } | { name: string }[] | null;
}

function venueName(row: DraftEventRow): string {
  if (Array.isArray(row.venues)) return row.venues[0]?.name ?? "—";
  return row.venues?.name ?? "—";
}

/**
 * Resumen del panel: volumen de usuarios, denuncias pendientes y eventos en
 * borrador. El guard de acceso está en el layout de /admin.
 */
export default async function AdminDashboardPage() {
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    return <ErrorState description="El servicio de datos no está disponible." />;
  }

  const [usersResult, openReports, reviewingReports, draftsResult] = await Promise.all([
    supabase.rpc("admin_list_users", { p_limit: 100, p_offset: 0 }),
    supabase.from("reports").select("id", { count: "exact", head: true }).eq("status", "open"),
    supabase
      .from("reports")
      .select("id", { count: "exact", head: true })
      .eq("status", "reviewing"),
    supabase
      .from("events")
      .select("id, title, starts_at, venues(name)")
      .eq("status", "draft")
      .order("starts_at", { ascending: true })
      .limit(5),
  ]);

  if (usersResult.error) {
    return (
      <ErrorState
        title="No se ha podido cargar el resumen"
        description="Comprueba tu conexión e inténtalo de nuevo."
      />
    );
  }

  const usersCount = usersResult.data?.length ?? 0;
  const openCount = openReports.count ?? 0;
  const reviewingCount = reviewingReports.count ?? 0;
  const drafts = (draftsResult.data ?? []) as DraftEventRow[];
  const pendingReports = openCount + reviewingCount;

  if (usersCount === 0 && pendingReports === 0 && drafts.length === 0) {
    return (
      <>
        <SectionTitle>Resumen</SectionTitle>
        <EmptyState
          icon={<UsersIcon className="size-10" />}
          title="Aún no hay actividad que moderar"
          description="Cuando haya usuarios registrados, denuncias abiertas o eventos en borrador, aparecerán aquí."
        />
      </>
    );
  }

  return (
    <>
      <SectionTitle>Resumen</SectionTitle>
      <p className="mb-5 text-sm text-text-secondary">
        Estado general de la plataforma. Los datos sensibles solo son visibles para administradores.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <div className="mb-2 flex items-center gap-2 text-neon-violet">
            <UsersIcon className="size-5" />
            <h3 className="text-sm font-semibold text-text">Usuarios registrados</h3>
          </div>
          <p className="text-3xl font-black text-text">{usersCount}</p>
          <p className="mt-1 text-xs text-text-muted">
            Recuento de los últimos perfiles (hasta 100).
          </p>
          <Link href="/admin/usuarios" className="mt-3 inline-block text-sm font-medium text-neon-violet hover:underline">
            Gestionar usuarios →
          </Link>
        </Card>

        <Card>
          <div className="mb-2 flex items-center gap-2 text-warning">
            <FlagIcon className="size-5" />
            <h3 className="text-sm font-semibold text-text">Denuncias pendientes</h3>
          </div>
          <p className="text-3xl font-black text-text">{pendingReports}</p>
          <p className="mt-1 text-xs text-text-muted">
            {openCount} abiertas · {reviewingCount} en revisión.
          </p>
          <Link href="/admin/denuncias" className="mt-3 inline-block text-sm font-medium text-neon-violet hover:underline">
            Revisar denuncias →
          </Link>
        </Card>

        <Card className="sm:col-span-2 lg:col-span-1">
          <div className="mb-2 flex items-center gap-2 text-neon-pink">
            <CalendarIcon className="size-5" />
            <h3 className="text-sm font-semibold text-text">Eventos en borrador</h3>
          </div>
          {drafts.length === 0 ? (
            <p className="text-sm text-text-secondary">
              No hay eventos en borrador. ¡Crea el primero!
            </p>
          ) : (
            <ul className="space-y-1.5 text-sm text-text-secondary">
              {drafts.map((event) => (
                <li key={event.id} className="flex items-baseline justify-between gap-2">
                  <span className="truncate font-medium text-text">{event.title}</span>
                  <span className="shrink-0 text-xs text-text-muted">
                    {venueName(event)} · {formatDateTime(event.starts_at)}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <Link href="/admin/eventos" className="mt-3 inline-block text-sm font-medium text-neon-violet hover:underline">
            Gestionar eventos →
          </Link>
        </Card>
      </div>
    </>
  );
}
