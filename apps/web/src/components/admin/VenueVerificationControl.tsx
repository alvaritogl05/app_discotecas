"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { VENUE_VERIFICATION_STATES, type VenueVerificationState } from "@app-discotecas/shared";
import { Button } from "@/components/ui/Button";
import { setVenueVerificationAction } from "@/lib/actions/admin";
import { VERIFICATION_LABELS } from "./labels";

/** Selector + botón para cambiar el estado de verificación de un local. */
export function VenueVerificationControl({
  venueId,
  venueName,
  current,
}: {
  venueId: string;
  venueName: string;
  current: VenueVerificationState;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [value, setValue] = useState<VenueVerificationState>(current);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const dirty = value !== current;

  function handleApply() {
    setError(null);
    setNotice(null);
    startTransition(async () => {
      const result = await setVenueVerificationAction(venueId, value);
      if (result.ok) {
        setNotice("Verificación actualizada.");
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <label htmlFor={`verificacion-${venueId}`} className="sr-only">
          Estado de verificación de {venueName}
        </label>
        <select
          id={`verificacion-${venueId}`}
          className="input w-40"
          value={value}
          disabled={pending}
          onChange={(e) => setValue(e.target.value as VenueVerificationState)}
        >
          {VENUE_VERIFICATION_STATES.map((state) => (
            <option key={state} value={state}>
              {VERIFICATION_LABELS[state]}
            </option>
          ))}
        </select>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          loading={pending}
          disabled={pending || !dirty}
          onClick={handleApply}
        >
          Aplicar
        </Button>
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
