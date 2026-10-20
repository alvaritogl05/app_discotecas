import { getSupabaseServerClient } from "@/lib/supabase/server";
import { EmptyState, ErrorState, SectionTitle } from "@/components/ui/Layout";
import { SettingsIcon } from "@/components/ui/icons";
import { AdminTable } from "@/components/admin/Table";
import { AUDIT_ACTION_LABELS, formatDateTime, shortId } from "@/components/admin/labels";

interface AuditLogRow {
  id: string;
  actor_id: string | null;
  action: string;
  target_type: string;
  target_id: string | null;
  created_at: string;
}

/** Últimos 100 registros del log de auditoría de administración. */
export default async function AdminAuditPage() {
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    return <ErrorState description="El servicio de datos no está disponible." />;
  }

  const { data, error } = await supabase
    .from("admin_audit_logs")
    .select("id, actor_id, action, target_type, target_id, created_at")
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) {
    return (
      <ErrorState
        title="No se ha podido cargar la auditoría"
        description="Comprueba tu conexión e inténtalo de nuevo."
      />
    );
  }

  const logs = (data ?? []) as AuditLogRow[];

  return (
    <>
      <SectionTitle>Auditoría</SectionTitle>
      <p className="mb-5 text-sm text-text-secondary">
        Últimas 100 acciones administrativas registradas en el servidor. El registro no se puede
        editar desde la aplicación.
      </p>

      {logs.length === 0 ? (
        <EmptyState
          icon={<SettingsIcon className="size-10" />}
          title="Todavía no hay acciones registradas"
          description="Cada suspensión, resolución de denuncia, cambio de verificación o gestión de eventos quedará registrada aquí."
        />
      ) : (
        <AdminTable
          caption="Registro de auditoría de administración"
          rows={logs}
          rowKey={(log) => log.id}
          columns={[
            {
              key: "created_at",
              header: "Fecha",
              render: (log) => formatDateTime(log.created_at),
            },
            {
              key: "action",
              header: "Acción",
              render: (log) => (
                <span className="font-medium text-text">
                  {AUDIT_ACTION_LABELS[log.action] ?? log.action}
                </span>
              ),
            },
            {
              key: "actor",
              header: "Administrador",
              render: (log) => <span className="font-mono text-xs">{shortId(log.actor_id)}</span>,
            },
            {
              key: "target",
              header: "Objetivo",
              render: (log) => (
                <span className="text-xs">
                  {log.target_type}
                  {log.target_id ? (
                    <>
                      {" · "}
                      <span className="font-mono">{shortId(log.target_id)}</span>
                    </>
                  ) : null}
                </span>
              ),
            },
          ]}
        />
      )}
    </>
  );
}
