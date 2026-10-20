import type { VenueVerificationState } from "@app-discotecas/shared";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { Badge, EmptyState, ErrorState, SectionTitle } from "@/components/ui/Layout";
import { MapPinIcon } from "@/components/ui/icons";
import { AdminTable } from "@/components/admin/Table";
import { VenueVerificationControl } from "@/components/admin/VenueVerificationControl";
import { VERIFICATION_LABELS, VERIFICATION_TONES } from "@/components/admin/labels";

interface VenueRow {
  id: string;
  name: string;
  city: string;
  verification: VenueVerificationState;
}

/** Escapa los comodines de ilike para que la búsqueda sea literal. */
function escapeLike(value: string): string {
  return value.replace(/[\\%_]/g, (m) => `\\${m}`);
}

/** Buscador y gestión de verificación de locales. */
export default async function AdminVenuesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const query = (params.q ?? "").trim();

  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    return <ErrorState description="El servicio de datos no está disponible." />;
  }

  let builder = supabase
    .from("venues")
    .select("id, name, city, verification")
    .order("name", { ascending: true })
    .limit(50);
  if (query.length > 0) {
    builder = builder.ilike("name", `%${escapeLike(query)}%`);
  }
  const { data, error } = await builder;
  if (error) {
    return (
      <ErrorState
        title="No se han podido cargar los locales"
        description="Comprueba tu conexión e inténtalo de nuevo."
      />
    );
  }

  const venues = (data ?? []) as VenueRow[];

  return (
    <>
      <SectionTitle>Locales</SectionTitle>
      <p className="mb-5 text-sm text-text-secondary">
        Busca un establecimiento por nombre y revisa su estado de verificación.
      </p>

      <form method="get" action="/admin/locales" className="surface mb-6 flex flex-wrap items-end gap-3 p-4">
        <div className="min-w-56 flex-1">
          <label htmlFor="buscar-local" className="field-label">
            Nombre del local
          </label>
          <input
            id="buscar-local"
            name="q"
            type="search"
            className="input"
            defaultValue={query}
            placeholder="Ej. Razzmatazz, Apolo, Pacha…"
          />
        </div>
        <button type="submit" className="btn-primary mb-4">
          Buscar
        </button>
      </form>

      {venues.length === 0 ? (
        <EmptyState
          icon={<MapPinIcon className="size-10" />}
          title={query ? "Sin resultados" : "Todavía no hay locales"}
          description={
            query
              ? `No hemos encontrado ningún local cuyo nombre contenga “${query}”. Prueba con otra búsqueda.`
              : "Cuando se importen los primeros establecimientos, aparecerán aquí."
          }
          action={query ? { href: "/admin/locales", label: "Ver todos los locales" } : undefined}
        />
      ) : (
        <>
          <AdminTable
            caption="Listado de locales"
            rows={venues}
            rowKey={(venue) => venue.id}
            className="mb-4"
            columns={[
              {
                key: "name",
                header: "Nombre",
                render: (venue) => (
                  <span className="font-medium text-text">{venue.name}</span>
                ),
              },
              { key: "city", header: "Ciudad", render: (venue) => venue.city },
              {
                key: "verification",
                header: "Verificación",
                render: (venue) => (
                  <Badge tone={VERIFICATION_TONES[venue.verification] ?? "neutral"}>
                    {VERIFICATION_LABELS[venue.verification] ?? venue.verification}
                  </Badge>
                ),
              },
              {
                key: "acciones",
                header: "Cambiar estado",
                render: (venue) => (
                  <VenueVerificationControl
                    venueId={venue.id}
                    venueName={venue.name}
                    current={venue.verification}
                  />
                ),
              },
            ]}
          />
          <p className="text-xs text-text-muted" role="status">
            Mostrando {venues.length} locales {query ? `que coinciden con “${query}”` : ""}.
          </p>
        </>
      )}
    </>
  );
}
