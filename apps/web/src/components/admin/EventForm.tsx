"use client";

import { useState, useTransition, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MUSIC_GENRES,
  MUSIC_GENRE_LABELS,
  type MusicGenre,
} from "@app-discotecas/shared";
import { Button, cn } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Form";
import { searchVenuesAction, upsertEventAction } from "@/lib/actions/admin";

interface VenueOption {
  id: string;
  name: string;
  city: string;
}

export interface EventInitialData {
  id: string;
  title: string;
  description: string;
  startsAt: string;
  endsAt: string;
  musicGenres: string[];
  venue: VenueOption;
}

/** Convierte una fecha ISO al formato de input datetime-local. */
function toLocalInput(iso: string): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}`;
}

/** Convierte un input datetime-local a ISO (null si está vacío). */
function toIso(local: string): string | null {
  if (!local) return null;
  const date = new Date(local);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

/**
 * Formulario de creación/edición de eventos.
 * El estado se guarda siempre como borrador; la publicación es una acción
 * aparte (admin_publish_event) desde la tabla de la página.
 */
export function EventForm({ initial }: { initial: EventInitialData | null }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Local: buscador + selector.
  const [venueQuery, setVenueQuery] = useState("");
  const [searching, startSearchTransition] = useTransition();
  const [venueOptions, setVenueOptions] = useState<VenueOption[]>(
    initial ? [initial.venue] : [],
  );
  const [venueId, setVenueId] = useState(initial?.venue.id ?? "");

  // Datos del evento.
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [startsAt, setStartsAt] = useState(initial ? toLocalInput(initial.startsAt) : "");
  const [endsAt, setEndsAt] = useState(initial ? toLocalInput(initial.endsAt) : "");
  const [genres, setGenres] = useState<string[]>(initial?.musicGenres ?? []);

  function handleVenueSearch() {
    setError(null);
    const query = venueQuery.trim();
    if (query.length === 0) {
      setError("Escribe al menos una parte del nombre del local.");
      return;
    }
    startSearchTransition(async () => {
      const result = await searchVenuesAction(query);
      if (result.ok) {
        setVenueOptions(result.data);
        if (result.data.length === 0) {
          setError(`No se han encontrado locales con “${query}”.`);
        }
      } else {
        setError(result.error);
      }
    });
  }

  function toggleGenre(genre: MusicGenre) {
    setGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre],
    );
  }

  function resetForm() {
    setVenueQuery("");
    setVenueOptions([]);
    setVenueId("");
    setTitle("");
    setDescription("");
    setStartsAt("");
    setEndsAt("");
    setGenres([]);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);

    if (!venueId) {
      setError("Busca y selecciona un local para el evento.");
      return;
    }
    if (title.trim().length < 3) {
      setError("El título debe tener al menos 3 caracteres.");
      return;
    }
    const startsAtIso = toIso(startsAt);
    if (!startsAtIso) {
      setError("Indica la fecha y hora de inicio.");
      return;
    }
    const endsAtIso = toIso(endsAt);
    if (endsAtIso && endsAtIso < startsAtIso) {
      setError("La hora de fin no puede ser anterior a la de inicio.");
      return;
    }

    const isEditing = Boolean(initial?.id);
    startTransition(async () => {
      const result = await upsertEventAction({
        id: initial?.id ?? null,
        venueId,
        title: title.trim(),
        description: description.trim() || null,
        startsAt: startsAtIso,
        endsAt: endsAtIso,
        musicGenres: genres,
      });
      if (result.ok) {
        setNotice(
          isEditing
            ? "Evento actualizado. Sigue en borrador hasta que lo publiques."
            : "Evento creado como borrador.",
        );
        if (!isEditing) resetForm();
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <section aria-labelledby="titulo-form-evento" className="surface mb-8 p-4 sm:p-5">
      <h2 id="titulo-form-evento" className="mb-1 text-lg font-bold text-text">
        {initial ? `Editar evento: ${initial.title}` : "Crear evento"}
      </h2>
      <p className="mb-4 text-sm text-text-secondary">
        Los eventos se guardan como borrador. Publícalos desde la lista cuando estén listos.
      </p>

      <form onSubmit={handleSubmit} noValidate>
        {/* Buscador de local */}
        <div className="mb-4">
          <label htmlFor="buscador-local" className="field-label">
            Local
          </label>
          <div className="flex flex-wrap items-center gap-2">
            <input
              id="buscador-local"
              className="input min-w-48 flex-1"
              type="search"
              placeholder="Buscar por nombre, p. ej. Razzmatazz"
              value={venueQuery}
              disabled={pending}
              onChange={(e) => setVenueQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleVenueSearch();
                }
              }}
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              loading={searching}
              disabled={searching || pending}
              onClick={handleVenueSearch}
            >
              Buscar locales
            </Button>
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="local-evento" className="field-label">
            Selecciona el local
          </label>
          <select
            id="local-evento"
            className="input"
            value={venueId}
            disabled={pending}
            onChange={(e) => setVenueId(e.target.value)}
          >
            <option value="">
              {venueOptions.length === 0
                ? "Busca un local primero"
                : "Selecciona un local…"}
            </option>
            {venueOptions.map((venue) => (
              <option key={venue.id} value={venue.id}>
                {venue.name}
                {venue.city ? ` — ${venue.city}` : ""}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Título del evento"
          value={title}
          maxLength={120}
          disabled={pending}
          onChange={(e) => setTitle(e.target.value)}
          hint="Entre 3 y 120 caracteres."
        />

        <Textarea
          label="Descripción"
          value={description}
          maxLength={2000}
          disabled={pending}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Qué esperar de la noche: horarios, precios, ambiente…"
        />

        <div className="grid gap-x-4 sm:grid-cols-2">
          <Input
            label="Inicio"
            type="datetime-local"
            value={startsAt}
            disabled={pending}
            onChange={(e) => setStartsAt(e.target.value)}
          />
          <Input
            label="Fin (opcional)"
            type="datetime-local"
            value={endsAt}
            disabled={pending}
            onChange={(e) => setEndsAt(e.target.value)}
          />
        </div>

        <fieldset className="mb-5">
          <legend className="field-label">Géneros musicales</legend>
          <div className="flex flex-wrap gap-2">
            {MUSIC_GENRES.map((genre) => {
              const active = genres.includes(genre);
              return (
                <button
                  key={genre}
                  type="button"
                  aria-pressed={active}
                  disabled={pending}
                  onClick={() => toggleGenre(genre)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-medium transition",
                    active
                      ? "border-neon-violet/50 bg-neon-violet/15 text-neon-violet"
                      : "border-line bg-surface-raised text-text-secondary hover:text-text",
                  )}
                >
                  {MUSIC_GENRE_LABELS[genre]}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="flex items-center gap-3">
          <Button type="submit" loading={pending} disabled={pending}>
            {initial ? "Guardar cambios" : "Crear borrador"}
          </Button>
          {initial && (
            <Link href="/admin/eventos" className="btn-ghost">
              Cancelar
            </Link>
          )}
        </div>
      </form>

      {notice && (
        <p role="status" className="mt-3 text-sm text-success">
          {notice}
        </p>
      )}
      {error && (
        <p role="alert" className="mt-3 text-sm text-danger">
          {error}
        </p>
      )}
    </section>
  );
}
