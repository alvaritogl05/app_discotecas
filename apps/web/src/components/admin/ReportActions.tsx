"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { ReportStatus } from "@app-discotecas/shared";
import { Button } from "@/components/ui/Button";
import { resolveReportAction } from "@/lib/actions/admin";

const ACTIONS: { status: ReportStatus; label: string }[] = [
  { status: "reviewing", label: "Marcar revisando" },
  { status: "resolved", label: "Resuelta" },
  { status: "dismissed", label: "Desestimada" },
];

/** Acciones de moderación sobre una denuncia. */
export function ReportActions({
  reportId,
  currentStatus,
}: {
  reportId: string;
  currentStatus: ReportStatus;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [pendingStatus, setPendingStatus] = useState<ReportStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  function handleResolve(status: ReportStatus) {
    setError(null);
    setNotice(null);
    setPendingStatus(status);
    startTransition(async () => {
      const result = await resolveReportAction(reportId, status);
      if (result.ok) {
        setNotice("Denuncia actualizada correctamente.");
        router.refresh();
      } else {
        setError(result.error);
      }
      setPendingStatus(null);
    });
  }

  return (
    <div className="flex flex-col items-start gap-1.5">
      <div className="flex flex-wrap gap-2">
        {ACTIONS.map((action) => (
          <Button
            key={action.status}
            type="button"
            variant={action.status === "reviewing" ? "secondary" : "ghost"}
            size="sm"
            loading={pending && pendingStatus === action.status}
            disabled={pending || action.status === currentStatus}
            onClick={() => handleResolve(action.status)}
          >
            {action.label}
          </Button>
        ))}
      </div>
      {notice && (
        <p role="status" className="text-xs text-success">
          {notice}
        </p>
      )}
      {error && (
        <p role="alert" className="text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
