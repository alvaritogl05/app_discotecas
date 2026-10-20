import Link from "next/link";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { Badge, EmptyState, ErrorState, SectionTitle } from "@/components/ui/Layout";
import { AdminTable } from "@/components/admin/Table";
import { UserActions } from "@/components/admin/UserActions";
import { formatDateTime, shortId } from "@/components/admin/labels";

const PAGE_SIZE = 20;

interface AdminUserRow {
  id: string;
  display_name: string | null;
  age: number | null;
  city: string | null;
  verified: boolean;
  created_at: string;
}

function paginationHref(page: number): string {
  return page > 1 ? `/admin/usuarios?pagina=${page}` : "/admin/usuarios";
}

/** Lista paginada de usuarios registrados (vía RPC admin_list_users). */
export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ pagina?: string }>;
}) {
  const params = await searchParams;
  const rawPage = Number.parseInt(params.pagina ?? "1", 10);
  const page = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;
  const offset = (page - 1) * PAGE_SIZE;

  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    return <ErrorState description="El servicio de datos no está disponible." />;
  }

  const { data, error } = await supabase.rpc("admin_list_users", {
    p_limit: PAGE_SIZE,
    p_offset: offset,
  });
  if (error) {
    return (
      <ErrorState
        title="No se ha podido cargar los usuarios"
        description="Comprueba tu conexión e inténtalo de nuevo."
      />
    );
  }

  const users = (data ?? []) as AdminUserRow[];
  const hasPrevious = page > 1;
  const hasNext = users.length === PAGE_SIZE;

  return (
    <>
      <SectionTitle>Usuarios</SectionTitle>
      <p className="mb-5 text-sm text-text-secondary">
        Perfiles registrados, del más reciente al más antiguo.
      </p>

      {users.length === 0 ? (
        <EmptyState
          title={hasPrevious ? "No hay más usuarios" : "Aún no hay usuarios registrados"}
          description={
            hasPrevious
              ? "Has llegado al final de la lista."
              : "Cuando alguien complete su registro, aparecerá en esta lista."
          }
          action={hasPrevious ? { href: "/admin/usuarios", label: "Volver al principio" } : undefined}
        />
      ) : (
        <>
          <AdminTable
            caption="Listado de usuarios registrados"
            rows={users}
            rowKey={(user) => user.id}
            columns={[
              {
                key: "display_name",
                header: "Nombre",
                render: (user) => (
                  <span className="font-medium text-text">{user.display_name ?? "Sin nombre"}</span>
                ),
              },
              { key: "age", header: "Edad", render: (user) => user.age ?? "—" },
              { key: "city", header: "Ciudad", render: (user) => user.city ?? "—" },
              {
                key: "verified",
                header: "Verificado",
                render: (user) =>
                  user.verified ? (
                    <Badge tone="success">Verificado</Badge>
                  ) : (
                    <Badge tone="neutral">Sin verificar</Badge>
                  ),
              },
              {
                key: "created_at",
                header: "Alta",
                render: (user) => formatDateTime(user.created_at),
              },
              {
                key: "id",
                header: "ID",
                render: (user) => (
                  <span className="font-mono text-xs">{shortId(user.id)}</span>
                ),
              },
              {
                key: "acciones",
                header: "Acciones",
                render: (user) => (
                  <UserActions userId={user.id} displayName={user.display_name ?? "este usuario"} />
                ),
              },
            ]}
          />

          <nav
            aria-label="Paginación de usuarios"
            className="mt-4 flex items-center justify-between text-sm"
          >
            {hasPrevious ? (
              <Link href={paginationHref(page - 1)} className="btn-secondary">
                ← Anteriores
              </Link>
            ) : (
              <span aria-hidden="true" className="btn-secondary invisible pointer-events-none">
                ← Anteriores
              </span>
            )}
            <span className="text-text-muted" role="status">
              Página {page}
            </span>
            {hasNext ? (
              <Link href={paginationHref(page + 1)} className="btn-secondary">
                Siguientes →
              </Link>
            ) : (
              <span aria-hidden="true" className="btn-secondary invisible pointer-events-none">
                Siguientes →
              </span>
            )}
          </nav>
        </>
      )}
    </>
  );
}
