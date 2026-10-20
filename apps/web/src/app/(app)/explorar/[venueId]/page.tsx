import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getVenue, getAttendanceCounters, getMyAttendance, listVenueAttendees } from "@/lib/actions/venues";
import { ArrowLeftIcon, ClockIcon, ExternalIcon, MapPinIcon, MusicIcon } from "@/components/ui/icons";
import { Badge, Card } from "@/components/ui/Layout";
import { AttendancePanel } from "@/components/app/AttendancePanel";
import { MUSIC_GENRE_LABELS, type MusicGenre } from "@app-discotecas/shared";

export const metadata: Metadata = { title: "Local" };

function todayIso(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default async function VenueDetailPage({
  params,
}: {
  params: Promise<{ venueId: string }>;
}) {
  const { venueId } = await params;
  const result = await getVenue(venueId);
  if (!result.ok || !result.data) notFound();

  const venue = result.data;
  const today = todayIso();

  const [countersResult, myAttendanceResult, attendeesResult] = await Promise.all([
    getAttendanceCounters(venue.id, today),
    getMyAttendance(venue.id, today),
    listVenueAttendees(venue.id, today),
  ]);

  const counters = countersResult.ok ? countersResult.data : null;
  const myAttendance = myAttendanceResult.ok ? myAttendanceResult.data : null;
  const attendees = attendeesResult.ok ? attendeesResult.data : [];

  const mapUrl = `https://www.openstreetmap.org/?mlat=${venue.latitude}&mlon=${venue.longitude}#map=17/${venue.latitude}/${venue.longitude}`;

  return (
    <div className="mx-auto max-w-2xl animate-fade-in">
      <Link href="/explorar" className="btn-ghost mb-4 -ml-3 inline-flex">
        <ArrowLeftIcon className="size-4" />
        Volver a Explorar
      </Link>

      <Card>
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-2xl font-bold">{venue.name}</h1>
          <Badge tone={venue.verification === "verified" ? "success" : "neutral"}>
            {venue.verification === "verified" ? "Verificado" : "Sin verificar"}
          </Badge>
        </div>

        <dl className="mt-4 space-y-2 text-sm text-text-secondary">
          {venue.address && (
            <div className="flex items-start gap-2">
              <MapPinIcon className="mt-0.5 size-4 shrink-0 text-text-muted" />
              <dd>
                {venue.address}, {venue.city}
              </dd>
            </div>
          )}
          {venue.openingHours && (
            <div className="flex items-start gap-2">
              <ClockIcon className="mt-0.5 size-4 shrink-0 text-text-muted" />
              <dd>{venue.openingHours}</dd>
            </div>
          )}
          {venue.musicGenres.length > 0 && (
            <div className="flex items-start gap-2">
              <MusicIcon className="mt-0.5 size-4 shrink-0 text-text-muted" />
              <dd className="flex flex-wrap gap-1.5">
                {venue.musicGenres.map((g) => (
                  <span key={g} className="chip">
                    {MUSIC_GENRE_LABELS[g as MusicGenre] ?? g}
                  </span>
                ))}
              </dd>
            </div>
          )}
        </dl>

        <div className="mt-4 flex flex-wrap gap-3">
          <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary">
            <ExternalIcon className="size-4" />
            Ver en el mapa
          </a>
          {venue.websiteUrl && (
            <a
              href={venue.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              <ExternalIcon className="size-4" />
              Web oficial
            </a>
          )}
        </div>

        <p className="mt-4 text-[11px] text-text-muted">
          Fuente de los datos: {venue.dataSource}. © OpenStreetMap contributors (ODbL).
        </p>
      </Card>

      <div className="mt-6">
        <AttendancePanel
          venueId={venue.id}
          venueName={venue.name}
          initialCounters={counters}
          initialAttendance={myAttendance}
          attendees={attendees}
        />
      </div>
    </div>
  );
}
