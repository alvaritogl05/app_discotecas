"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { MUSIC_GENRES, MUSIC_GENRE_LABELS } from "@app-discotecas/shared";
import { Button } from "@/components/ui/Button";

/** Búsqueda por nombre/zona y filtro por género, con navegación por query string. */
export function ExploreSearch({
  initialQuery,
  initialGenre,
}: {
  initialQuery: string;
  initialGenre: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [genre, setGenre] = useState(initialGenre);

  function navigate(nextQuery: string, nextGenre: string) {
    const params = new URLSearchParams();
    if (nextQuery.trim()) params.set("q", nextQuery.trim());
    if (nextGenre) params.set("genre", nextGenre);
    router.push(`/explorar${params.size > 0 ? `?${params.toString()}` : ""}`);
  }

  return (
    <form
      className="mb-6"
      onSubmit={(e) => {
        e.preventDefault();
        navigate(query, genre);
      }}
    >
      <label htmlFor="venue-search" className="sr-only">
        Buscar locales por nombre o zona
      </label>
      <div className="flex gap-2">
        <input
          id="venue-search"
          type="search"
          className="input"
          placeholder="Buscar por nombre o zona…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button type="submit">Buscar</Button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Filtrar por música">
        <button
          type="button"
          className="chip"
          data-selected={genre === ""}
          aria-pressed={genre === ""}
          onClick={() => {
            setGenre("");
            navigate(query, "");
          }}
        >
          Toda la música
        </button>
        {MUSIC_GENRES.slice(0, 10).map((g) => (
          <button
            key={g}
            type="button"
            className="chip"
            data-selected={genre === g}
            aria-pressed={genre === g}
            onClick={() => {
              const next = genre === g ? "" : g;
              setGenre(next);
              navigate(query, next);
            }}
          >
            {MUSIC_GENRE_LABELS[g]}
          </button>
        ))}
      </div>
    </form>
  );
}
