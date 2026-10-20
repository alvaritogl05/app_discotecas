import type { Metadata } from "next";
import { listCandidates } from "@/lib/actions/social";
import { listVenues } from "@/lib/actions/venues";
import { EmptyState, ErrorState } from "@/components/ui/Layout";
import { SparkIcon } from "@/components/ui/icons";
import { SwipeDeck } from "@/components/app/SwipeDeck";
import { NightContextPicker } from "@/components/app/NightContextPicker";

export const metadata: Metadata = { title: "Personas" };

function todayIso(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default async function PeoplePage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string; venue?: string }>;
}) {
  const params = await searchParams;
  const venueId = params.venue;
  const date = params.date ?? todayIso();
  const useContext = Boolean(venueId);

  const [candidatesResult, venuesResult] = await Promise.all([
    listCandidates(useContext ? { venueId, date, limit: 30 } : { limit: 30 }),
    useContext ? Promise.resolve(null) : listVenues({}),
  ]);

  return (
    <div className="animate-fade-in">
      <h1 className="mb-1 text-2xl font-bold">Personas</h1>
      <p className="mb-5 text-sm text-text-secondary">
        Desliza para conectar. El match se crea solo cuando hay interés mutuo.
      </p>

      <NightContextPicker
        venues={
          venuesResult?.ok
            ? venuesResult.data.map((v) => ({ id: v.id, name: v.name, city: v.city }))
            : []
        }
        selectedVenueId={venueId ?? ""}
        selectedDate={date}
      />

      {!candidatesResult.ok ? (
        <ErrorState description={candidatesResult.error} />
      ) : candidatesResult.data.length === 0 ? (
        <EmptyState
          title={useContext ? "Nadie más ha compartido su plan aquí" : "Aún no hay perfiles para ti"}
          description={
            useContext
              ? "Sé el primero en anunciar tu plan en la ficha del local. Cuando más gente lo comparta, aparecerá aquí."
              : "Vuelve más tarde, amplía tus filtros de edad o invita a amigos. La comunidad empieza a crecer."
          }
          icon={<SparkIcon className="size-10" />}
        />
      ) : (
        <SwipeDeck
          candidates={candidatesResult.data}
          context={useContext ? { venueId: venueId!, date } : null}
        />
      )}
    </div>
  );
}
