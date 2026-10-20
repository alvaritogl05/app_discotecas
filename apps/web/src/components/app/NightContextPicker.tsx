"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

function todayIso(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/**
 * Selector de contexto nocturno: descubrimiento general o personas que
 * comparten su asistencia a un local concreto en una fecha.
 */
export function NightContextPicker({
  venues,
  selectedVenueId,
  selectedDate,
}: {
  venues: { id: string; name: string; city: string }[];
  selectedVenueId: string;
  selectedDate: string;
}) {
  const router = useRouter();
  const [venue, setVenue] = useState(selectedVenueId);
  const [date, setDate] = useState(selectedDate);

  function apply(nextVenue: string, nextDate: string) {
    const params = new URLSearchParams();
    if (nextVenue) {
      params.set("venue", nextVenue);
      params.set("date", nextDate);
    }
    router.push(`/personas${params.size > 0 ? `?${params.toString()}` : ""}`);
  }

  return (
    <section className="surface mb-6 p-4" aria-label="Contexto de descubrimiento">
      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-48 flex-1">
          <label htmlFor="context-venue" className="field-label">
            Esta noche salgo a…
          </label>
          <select
            id="context-venue"
            className="input"
            value={venue}
            onChange={(e) => {
              setVenue(e.target.value);
              apply(e.target.value, date);
            }}
          >
            <option value="">Descubrimiento general</option>
            {venues.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name} · {v.city}
              </option>
            ))}
          </select>
        </div>

        {venue && (
          <div className="max-w-44">
            <label htmlFor="context-date" className="field-label">
              Fecha
            </label>
            <input
              id="context-date"
              type="date"
              className="input"
              value={date}
              min={todayIso()}
              onChange={(e) => {
                setDate(e.target.value);
                apply(venue, e.target.value);
              }}
            />
          </div>
        )}
      </div>

      <p className="mt-2 text-[11px] text-text-muted">
        {venue
          ? "Verás a quienes han decidido compartir su asistencia a ese local en esa fecha."
          : "Verás perfiles generales según tus preferencias."}{" "}
        {!venue && (
          <Link href="/explorar" className="underline hover:text-text-secondary">
            Ver locales en Explorar
          </Link>
        )}
      </p>
    </section>
  );
}
