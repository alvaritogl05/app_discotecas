"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  DISCOVERY_MODE_LABELS,
  MUSIC_GENRE_LABELS,
  REPORT_REASONS,
  REPORT_REASON_LABELS,
  type DiscoveryMode,
  type MusicGenre,
} from "@app-discotecas/shared";
import { recordSwipe, blockUser, reportUser, type CandidateProfile } from "@/lib/actions/social";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Layout";
import { BanIcon, FlagIcon, HeartIcon, MusicIcon, UserIcon, XIcon } from "@/components/ui/icons";

interface Props {
  candidates: CandidateProfile[];
  context: { venueId: string; date: string } | null;
}

type Direction = "like" | "pass";

/**
 * Mazo de tarjetas de perfil con acciones persistentes.
 * Accesible por teclado/screen-reader (botones con nombre claro); el gesto de
 * arrastre es una mejora opcional, nunca el único camino.
 */
export function SwipeDeck({ candidates, context }: Props) {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [exit, setExit] = useState<Direction | null>(null);
  const [matchId, setMatchId] = useState<string | null>(null);
  const [showMatch, setShowMatch] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reporting, setReporting] = useState(false);
  const [pending, startTransition] = useTransition();

  const current = candidates[index];
  const remaining = candidates.length - index;

  function decide(decision: Direction) {
    if (!current || pending) return;
    setError(null);
    setExit(decision);
    startTransition(async () => {
      const result = await recordSwipe({
        targetId: current.id,
        decision,
        mode: "social",
        ...(context ? { venueId: context.venueId, date: context.date } : {}),
      });
      setExit(null);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setIndex((i) => i + 1);
      if (result.data.matched) {
        setMatchId(result.data.matchId);
        setShowMatch(true);
      }
    });
  }

  function handleBlock() {
    if (!current) return;
    if (!window.confirm(`¿Bloquear a ${current.displayName}? No volveréis a veros.`)) return;
    startTransition(async () => {
      const result = await blockUser({ blockedId: current.id });
      if (result.ok) {
        setIndex((i) => i + 1);
      } else {
        setError(result.error);
      }
    });
  }

  function handleReport(reason: (typeof REPORT_REASONS)[number]) {
    if (!current) return;
    startTransition(async () => {
      const result = await reportUser({ reportedId: current.id, reason, details: "" });
      setReporting(false);
      if (result.ok) {
        setError(null);
        setIndex((i) => i + 1);
      } else {
        setError(result.error);
      }
    });
  }

  if (!current) {
    return (
      <div className="surface flex flex-col items-center gap-3 px-6 py-12 text-center animate-fade-in">
        <UserIcon className="size-10 text-text-muted" />
        <h2 className="font-semibold">No quedan más perfiles</h2>
        <p className="max-w-sm text-sm text-text-secondary">
          Has visto todos los perfiles disponibles por ahora. Vuelve más tarde o
          cambia el contexto de descubrimiento.
        </p>
        <button type="button" className="btn-secondary mt-2" onClick={() => router.refresh()}>
          Actualizar
        </button>
      </div>
    );
  }

  return (
    <div className="relative mx-auto w-full max-w-sm">
      {/* Match */}
      {showMatch && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="¡Nuevo match!"
          className="fixed inset-x-4 top-1/4 z-50 mx-auto max-w-sm animate-slide-up rounded-3xl border border-neon-violet/50 bg-surface p-6 text-center shadow-2xl"
        >
          <HeartIcon className="mx-auto mb-3 size-10 text-neon-pink" />
          <h2 className="text-xl font-black">
            ¡Es match con <span className="neon-text">{current.displayName}</span>!
          </h2>
          <p className="mt-2 text-sm text-text-secondary">
            Ya podéis escribiros. Recuerda: el respeto es lo primero.
          </p>
          <div className="mt-5 flex flex-col gap-2">
            <Button
              onClick={() => {
                setShowMatch(false);
                router.push(matchId ? `/chats` : "/matches");
              }}
            >
              Ir a chats
            </Button>
            <Button variant="ghost" onClick={() => setShowMatch(false)}>
              Seguir descubriendo
            </Button>
          </div>
        </div>
      )}

      {/* Tarjeta */}
      <article
        aria-label={`Perfil de ${current.displayName}, ${current.age} años`}
        className={`surface relative overflow-hidden transition-transform duration-200 ${
          exit === "like" ? "-translate-x-40 rotate-[-8deg] opacity-0" : ""
        } ${exit === "pass" ? "translate-x-40 rotate-[8deg] opacity-0" : ""}`}
      >
        <div className="flex h-64 items-end justify-center bg-gradient-to-br from-neon-violet/25 via-surface to-neon-pink/20 p-4">
          {current.photoPath ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={current.photoPath}
              alt={`Foto de ${current.displayName}`}
              className="size-full rounded-xl object-cover"
            />
          ) : (
            <UserIcon className="size-20 text-text-muted" />
          )}
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-bold">
              {current.displayName}
              {current.age ? <span className="text-text-secondary">, {current.age}</span> : null}
            </h2>
            {current.sharedPlanStatus && (
              <Badge tone="pink">Plan compartido</Badge>
            )}
          </div>

          {current.city && <p className="mt-0.5 text-xs text-text-muted">{current.city}</p>}

          {current.bio && (
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">{current.bio}</p>
          )}

          {current.musicFavorites.length > 0 && (
            <p className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-text-secondary">
              <MusicIcon className="size-3.5 shrink-0" />
              {current.musicFavorites
                .slice(0, 4)
                .map((g) => MUSIC_GENRE_LABELS[g as MusicGenre] ?? g)
                .join(" · ")}
            </p>
          )}

          {current.interests.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {current.interests.slice(0, 5).map((interest) => (
                <li key={interest} className="chip">
                  {interest}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-3 flex items-center gap-2">
            <Badge tone="violet">
              {DISCOVERY_MODE_LABELS[current.discoveryMode as DiscoveryMode] ?? current.discoveryMode}
            </Badge>
          </div>
        </div>
      </article>

      {error && (
        <p role="alert" className="mt-3 text-center text-sm text-danger">
          {error}
        </p>
      )}

      {/* Acciones */}
      <div className="mt-4 flex items-center justify-center gap-4">
        <button
          type="button"
          aria-label="Pasar"
          onClick={() => decide("pass")}
          disabled={pending}
          className="flex size-14 items-center justify-center rounded-full border border-line bg-surface text-text-secondary transition hover:bg-surface-hover disabled:opacity-50"
        >
          <XIcon className="size-6" />
        </button>
        <button
          type="button"
          aria-label="Me interesa"
          onClick={() => decide("like")}
          disabled={pending}
          className="flex size-16 items-center justify-center rounded-full text-white transition hover:brightness-110 disabled:opacity-50"
          style={{ background: "linear-gradient(135deg, #8b5cf6, #ec4899)" }}
        >
          <HeartIcon className="size-7" />
        </button>
        <div className="relative">
          <button
            type="button"
            aria-label="Seguridad: bloquear o denunciar"
            aria-expanded={reporting}
            onClick={() => setReporting((v) => !v)}
            className="flex size-14 items-center justify-center rounded-full border border-line bg-surface text-text-muted transition hover:bg-surface-hover"
          >
            <FlagIcon className="size-5" />
          </button>
          {reporting && (
            <div className="absolute bottom-16 right-0 z-30 w-56 animate-fade-in rounded-2xl border border-line bg-surface p-2 shadow-xl">
              <p className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-text-muted">
                Denunciar motivo
              </p>
              <ul>
                {REPORT_REASONS.map((reason) => (
                  <li key={reason}>
                    <button
                      type="button"
                      className="w-full rounded-xl px-2 py-2 text-left text-sm text-text-secondary transition hover:bg-surface-hover hover:text-text"
                      onClick={() => handleReport(reason)}
                      disabled={pending}
                    >
                      {REPORT_REASON_LABELS[reason]}
                    </button>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className="mt-1 w-full rounded-xl px-2 py-2 text-left text-sm font-medium text-danger transition hover:bg-surface-hover"
                onClick={handleBlock}
                disabled={pending}
              >
                <BanIcon className="mr-1.5 inline size-4" />
                Bloquear usuario
              </button>
              <button
                type="button"
                className="w-full rounded-xl px-2 py-2 text-left text-sm text-text-muted transition hover:bg-surface-hover"
                onClick={() => setReporting(false)}
              >
                Cancelar
              </button>
            </div>
          )}
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-text-muted" role="status">
        Quedan {remaining} perfiles por ver
      </p>
    </div>
  );
}
