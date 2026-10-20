"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ATTENDANCE_STATUS_LABELS, type AttendanceStatus } from "@app-discotecas/shared";
import { setMyAttendance, type AttendeeEntry, type AttendanceCounters } from "@/lib/actions/venues";
import { Button } from "@/components/ui/Button";
import { Card, Badge } from "@/components/ui/Layout";
import { CheckIcon, UsersIcon } from "@/components/ui/icons";

function todayIso(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

interface Props {
  venueId: string;
  venueName: string;
  initialCounters: AttendanceCounters | null;
  initialAttendance: { status: string; mode: string | null } | null;
  attendees: AttendeeEntry[];
}

/**
 * "Esta noche salgo": el usuario declara su intención, la confirma o hace
 * check-in voluntario. Todo es reversible. Los contadores separan claramente
 * confirmaciones y check-ins; no se presentan como aforo real.
 */
export function AttendancePanel({
  venueId,
  venueName,
  initialCounters,
  initialAttendance,
  attendees,
}: Props) {
  const router = useRouter();
  const [date, setDate] = useState(todayIso());
  const [status, setStatus] = useState<AttendanceStatus | null>(
    (initialAttendance?.status as AttendanceStatus) ?? null,
  );
  const [counters] = useState<AttendanceCounters | null>(initialCounters);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function changeStatus(next: AttendanceStatus) {
    setError(null);
    setNotice(null);
    startTransition(async () => {
      const result = await setMyAttendance({ venueId, date, status: next });
      if (result.ok) {
        setStatus(next);
        setNotice(`Estado actualizado: ${ATTENDANCE_STATUS_LABELS[next]}.`);
        // Refresca los contadores y la lista del servidor.
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  }

  function reloadCounters() {
    // Se recargan al refrescar la ruta desde el servidor; aquí solo UI.
    router.refresh();
  }

  const statusTone = (s: AttendanceStatus | null) => {
    switch (s) {
      case "confirmed":
        return "violet" as const;
      case "checked_in":
        return "success" as const;
      case "cancelled":
        return "neutral" as const;
      default:
        return "pink" as const;
    }
  };

  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-semibold">
          Esta noche salgo · {venueName}
        </h2>
        {status && <Badge tone={statusTone(status)}>{ATTENDANCE_STATUS_LABELS[status]}</Badge>}
      </div>

      <div className="mt-4">
        <label htmlFor="attendance-date" className="field-label">
          Fecha de la salida
        </label>
        <input
          id="attendance-date"
          type="date"
          className="input max-w-52"
          value={date}
          min={todayIso()}
          onChange={(e) => {
            setDate(e.target.value);
            setStatus(null);
            setNotice(null);
            reloadCounters();
          }}
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {(status === null || status === "cancelled") && (
          <>
            <Button
              variant="secondary"
              disabled={pending}
              onClick={() => changeStatus("planned")}
            >
              Quiero ir
            </Button>
            <Button disabled={pending} onClick={() => changeStatus("confirmed")}>
              Confirmo que voy
            </Button>
          </>
        )}
        {status === "planned" && (
          <>
            <Button disabled={pending} onClick={() => changeStatus("confirmed")}>
              Confirmo que voy
            </Button>
            <Button variant="ghost" disabled={pending} onClick={() => changeStatus("cancelled")}>
              Ya no voy
            </Button>
          </>
        )}
        {status === "confirmed" && (
          <>
            <Button disabled={pending} onClick={() => changeStatus("checked_in")}>
              <CheckIcon className="size-4" />
              He llegado (check-in)
            </Button>
            <Button variant="ghost" disabled={pending} onClick={() => changeStatus("cancelled")}>
              Ya no voy
            </Button>
          </>
        )}
        {status === "checked_in" && (
          <p className="text-sm text-text-secondary">
            Has hecho check-in. Gracias por avisar a los demás.
          </p>
        )}
      </div>

      {(error || notice) && (
        <p
          role={error ? "alert" : "status"}
          className={`mt-3 text-sm ${error ? "text-danger" : "text-success"}`}
        >
          {error ?? notice}
        </p>
      )}

      {/* Contadores transparentes */}
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <CounterCard
          value={counters?.planned ?? 0}
          label="Quieren ir"
          description="Han anunciado su intención, sin confirmar aún."
        />
        <CounterCard
          value={counters?.confirmed ?? 0}
          label="Asistencia confirmada"
          description="Han confirmado que irán (incluye a quienes ya hicieron check-in)."
        />
        <CounterCard
          value={counters?.checkedIn ?? 0}
          label="Check-ins"
          description="Personas que han avisado voluntariamente de su llegada."
        />
      </div>
      <p className="mt-3 text-[11px] leading-relaxed text-text-muted">
        Estas cifras reflejan lo que la comunidad ha decidido compartir, no el
        aforo real del establecimiento.
      </p>

      {/* Asistentes que compartieron su plan */}
      <div className="mt-6">
        <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-text-secondary">
          <UsersIcon className="size-4" />
          Quienes han compartido su plan
        </h3>
        {attendees.length === 0 ? (
          <p className="text-sm text-text-muted">
            Nadie más ha compartido su asistencia para esta fecha todavía.
          </p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {attendees.map((a) => (
              <li key={a.userId} className="chip">
                {a.displayName}, {a.age}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
}

function CounterCard({
  value,
  label,
  description,
}: {
  value: number;
  label: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-line bg-ink p-3">
      <p className="text-2xl font-bold text-text" aria-label={`${label}: ${value}`}>
        {value}
      </p>
      <p className="mt-0.5 text-xs font-medium text-text-secondary">{label}</p>
      <p className="mt-1 text-[11px] leading-snug text-text-muted">{description}</p>
    </div>
  );
}
