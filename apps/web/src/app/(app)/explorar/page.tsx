import type { Metadata } from "next";
import Link from "next/link";
import { listVenues } from "@/lib/actions/venues";
import { EmptyState, ErrorState, Card, Badge } from "@/components/ui/Layout";
import { MapPinIcon, MusicIcon } from "@/components/ui/icons";
import { ExploreSearch } from "@/components/app/ExploreSearch";
import { MUSIC_GENRE_LABELS, type MusicGenre } from "@app-discotecas/shared";

export const metadata: Metadata = { title: "Explorar" };

const CATEGORY_LABELS: Record<string, string> = {
  nightclub: "Discoteca",
  pub: "Pub",
  bar: "Bar",
  concert_hall: "Sala de conciertos",
  other: "Otro",
};

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; genre?: string }>;
}) {
  const params = await searchParams;
  const result = await listVenues({ query: params.q, genre: params.genre });

  return (
    <div className="animate-fade-in">
      <h1 className="mb-1 text-2xl font-bold">Explorar</h1>
      <p className="mb-5 text-sm text-text-secondary">
        Discotecas y locales reales de Barcelona y alrededores.
      </p>

      <ExploreSearch initialQuery={params.q ?? ""} initialGenre={params.genre ?? ""} />

      {!result.ok ? (
        <ErrorState description={result.error} />
      ) : result.data.length === 0 ? (
        <EmptyState
          title="Sin resultados"
          description={
            params.q || params.genre
              ? "No hay locales que coincidan con tu búsqueda. Prueba con otra zona o quita el filtro de música."
              : "Todavía no hay locales importados. Ejecuta `npm run venues:import` para cargar los datos de OpenStreetMap."
          }
          icon={<MapPinIcon className="size-10" />}
        />
      ) : (
        <>
          <p className="mb-3 text-xs text-text-muted" role="status">
            {result.data.length} locales
          </p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {result.data.map((venue) => (
              <li key={venue.id}>
                <Link href={`/explorar/${venue.id}`} className="block h-full">
                  <Card className="h-full transition hover:bg-surface-raised">
                    <div className="flex items-start justify-between gap-2">
                      <h2 className="font-semibold text-text">{venue.name}</h2>
                      <Badge tone={venue.verification === "verified" ? "success" : "neutral"}>
                        {venue.verification === "verified" ? "Verificado" : CATEGORY_LABELS[venue.category] ?? venue.category}
                      </Badge>
                    </div>
                    {venue.address && (
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-text-muted">
                        <MapPinIcon className="size-3.5" />
                        {venue.address} · {venue.city}
                      </p>
                    )}
                    {venue.musicGenres.length > 0 && (
                      <p className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-text-secondary">
                        <MusicIcon className="size-3.5 shrink-0" />
                        {venue.musicGenres
                          .slice(0, 3)
                          .map((g) => MUSIC_GENRE_LABELS[g as MusicGenre] ?? g)
                          .join(" · ")}
                      </p>
                    )}
                    <p className="mt-3 text-[11px] text-text-muted">
                      Fuente: {venue.dataSource}
                    </p>
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}

      <p className="mt-6 text-[11px] leading-relaxed text-text-muted">
        Datos de establecimientos: © OpenStreetMap contributors (licencia ODbL). La
        información de eventos y asistencia es aportada por la comunidad de la app
        y no representa el aforo real de los locales.
      </p>
    </div>
  );
}
