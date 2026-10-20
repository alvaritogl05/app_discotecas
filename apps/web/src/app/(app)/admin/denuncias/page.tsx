import type { ReportReason, ReportStatus } from "@app-discotecas/shared";
import { REPORT_REASON_LABELS } from "@app-discotecas/shared";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { Badge, EmptyState, ErrorState, SectionTitle } from "@/components/ui/Layout";
import { FlagIcon } from "@/components/ui/icons";
import { AdminTable } from "@/components/admin/Table";
import { ReportActions } from "@/components/admin/ReportActions";
import {
  REPORT_STATUS_LABELS,
  REPORT_STATUS_TONES,
  formatDateTime,
  shortId,
} from "@/components/admin/labels";

interface ReportRow {
  id: string;
  reporter_id: string;
  reported_id: string;
  reason: ReportReason;
  details: string | null;
  status: ReportStatus;
  created_at: string;
}

/** Denuncias abiertas y en revisión, ordenadas de más reciente a más antigua. */
export default async function AdminReportsPage() {
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    return <ErrorState description="El servicio de datos no está disponible." />;
  }

  const { data, error } = await supabase
    .from("reports")
    .select("id, reporter_id, reported_id, reason, details, status, created_at")
    .in("status", ["open", "reviewing"])
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) {
    return (
      <ErrorState
        title="No se han podido cargar las denuncias"
        description="Comprueba tu conexión e inténtalo de nuevo."
      />
    );
  }

  const reports = (data ?? []) as ReportRow[];

  return (
    <>
      <SectionTitle>Denuncias</SectionTitle>
      <p className="mb-5 text-sm text-text-secondary">
        Denuncias abiertas y en revisión. Los identificadores del denunciante se muestran de forma
        abreviada por privacidad.
      </p>

      {reports.length === 0 ? (
        <EmptyState
          icon={<FlagIcon className="size-10" />}
          title="No hay denuncias pendientes"
          description="Ninguna denuncia está abierta o en revisión en este momento. Buen trabajo del equipo."
        />
      ) : (
        <AdminTable
          caption="Denuncias abiertas y en revisión"
          rows={reports}
          rowKey={(report) => report.id}
          columns={[
            {
              key: "reason",
              header: "Motivo",
              render: (report) => (
                <span className="font-medium text-text">
                  {REPORT_REASON_LABELS[report.reason] ?? report.reason}
                </span>
              ),
            },
            {
              key: "details",
              header: "Detalles",
              render: (report) =>
                report.details ? (
                  <span className="line-clamp-2 max-w-xs">{report.details}</span>
                ) : (
                  <span className="text-text-muted">Sin detalles</span>
                ),
            },
            {
              key: "reported",
              header: "Denunciado",
              render: (report) => (
                <span className="font-mono text-xs">{shortId(report.reported_id)}</span>
              ),
            },
            {
              key: "reporter",
              header: "Denunciante",
              render: (report) => (
                <span className="font-mono text-xs">{shortId(report.reporter_id)}</span>
              ),
            },
            {
              key: "status",
              header: "Estado",
              render: (report) => (
                <Badge tone={REPORT_STATUS_TONES[report.status] ?? "neutral"}>
                  {REPORT_STATUS_LABELS[report.status] ?? report.status}
                </Badge>
              ),
            },
            {
              key: "created_at",
              header: "Fecha",
              render: (report) => formatDateTime(report.created_at),
            },
            {
              key: "acciones",
              header: "Acciones",
              render: (report) => (
                <ReportActions reportId={report.id} currentStatus={report.status} />
              ),
            },
          ]}
        />
      )}
    </>
  );
}
