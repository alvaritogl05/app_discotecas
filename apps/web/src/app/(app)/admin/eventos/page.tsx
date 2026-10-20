import type { EventStatus, MusicGenre } from "@app-discotecas/shared";
import { MUSIC_GENRE_LABELS } from "@app-discotecas/shared";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { Badge, EmptyState, ErrorState, SectionTitle } from "@/components/ui/Layout";
import { CalendarIcon } from "@/components/ui/icons";
import { AdminTable } from "@/components/admin/Table";
import { EventActions } from "@/components/admin/EventActions";
import { EventForm, type EventInitialData } from "@/components/admin/EventForm";
import {
  EVENT_STATUS_LABELS,
  EVENT_STATUS_TONES,
  formatDateTime,
} from "@/components/admin/labels";

const EVENT_SELECT = "id, venue_id, title, description, starts_at, ends_at, status, music_genres, venues(name, city)";

interface AdminEventRow {
  id: string;
  venue_id: string;
  title: string;
  description: string | null;
  starts_at: string;
  ends_at: string | null;
  status: EventStatus;
  music_genres: MusicGenre[] | null;
  venues: { name: string; city: string } | { name: string; city: string }[] | null;
}

function venueOf(row: AdminEventRow): { name: string; city: string } {
  const venue = Array.isArray(row.venues) ? row.venues[0] : row.venues;
  return { name: venue?.name ?? "—", city: venue?.city ?? "" };
}

function toInitialData(row: AdminEventRow): EventInitialData {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? "",
    startsAt: row.starts_at,
    endsAt: row.ends_at ?? "",
    musicGenres: row.music_genres ?? [],
    venue: { id: row.venue_id, ...venueOf(row) },
  };
}

/** Gestión de eventos: creación/edición por formulario y publicación. */
export default async function AdminEventsPage({
  searchParams,
}: {
  searchParams: Promise<{ editar?: string }>;
}) {
  const params = await searchParams;
  const editId = (params.editar ?? "").trim();

  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    return <ErrorState description="El servicio de datos no está disponible." />;
  }

  const [listResult, editResult] = await Promise.all([
    supabase
      .from("events")
      .select(EVENT_SELECT)
      .order("starts_at", { ascending: false })
      .limit(100),
    editId
      ? supabase.from("events").select(EVENT_SELECT).eq("id", editId).maybeSingle()
      : Promise.resolve({ data: null, error: null }),
  ]);

  if (listResult.error) {
    return (
      <ErrorState
        title="No se han podido cargar los eventos"
        description="Comprueba tu conexión e inténtalo de nuevo."
      />
    );
  }

  const events = (listResult.data ?? []) as AdminEventRow[];
  const editing = editId ? ((editResult.data ?? null) as AdminEventRow | null) : null;

  return (
    <>
      <SectionTitle>Eventos</SectionTitle>

      <EventForm initial={editing ? toInitialData(editing) : null} />

      <h2 className="mb-3 text-lg font-bold text-text">Todos los eventos</h2>
      <p className="mb-4 text-sm text-text-secondary">
        Crea borradores con el formulario y publícalos cuando quieras que sean visibles para todo el
        mundo.
      </p>

      {events.length === 0 ? (
        <EmptyState
          icon={<CalendarIcon className="size-10" />}
          title="Todavía no hay eventos"
          description="Usa el formulario de arriba para crear el primer evento como borrador."
        />
      ) : (
        <AdminTable
          caption="Listado de eventos"
          rows={events}
          rowKey={(event) => event.id}
          columns={[
            {
              key: "title",
              header: "Título",
              render: (event) => (
                <span className="font-medium text-text">{event.title}</span>
              ),
            },
            {
              key: "venue",
              header: "Local",
              render: (event) => venueOf(event).name,
            },
            {
              key: "starts_at",
              header: "Inicio",
              render: (event) => formatDateTime(event.starts_at),
            },
            {
              key: "status",
              header: "Estado",
              render: (event) => (
                <Badge tone={EVENT_STATUS_TONES[event.status] ?? "neutral"}>
                  {EVENT_STATUS_LABELS[event.status] ?? event.status}
                </Badge>
              ),
            },
            {
              key: "genres",
              header: "Géneros",
              render: (event) =>
                event.music_genres && event.music_genres.length > 0 ? (
                  <span className="text-xs">
                    {event.music_genres.map((g) => MUSIC_GENRE_LABELS[g] ?? g).join(", ")}
                  </span>
                ) : (
                  <span className="text-text-muted">—</span>
                ),
            },
            {
              key: "acciones",
              header: "Acciones",
              render: (event) => (
                <EventActions eventId={event.id} title={event.title} status={event.status} />
              ),
            },
          ]}
        />
      )}
    </>
  );
}
