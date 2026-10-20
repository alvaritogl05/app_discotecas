"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  DISCOVERY_MODES,
  DISCOVERY_MODE_LABELS,
  MUSIC_GENRES,
  MUSIC_GENRE_LABELS,
  profileFormSchema,
  preferencesSchema,
  type MusicGenre,
} from "@app-discotecas/shared";
import { savePreferences, saveProfile, signOut } from "@/lib/actions/auth";
import { deleteMyAccount } from "@/lib/actions/account";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Toggle } from "@/components/ui/Form";
import { Card } from "@/components/ui/Layout";

interface ProfileRow {
  display_name: string;
  birth_date: string;
  bio: string | null;
  interests: string[];
  music_favorites: MusicGenre[];
  languages: string[];
  discovery_mode: string;
  city: string | null;
}

export type { ProfileRow };

interface PreferencesRow {
  age_min: number;
  age_max: number;
  max_distance_km: number;
  genres: MusicGenre[];
  discoverable: boolean;
  share_attendance: boolean;
  show_age: boolean;
  show_city: boolean;
}

function zodErrors(result: ReturnType<typeof profileFormSchema.safeParse>): Record<string, string> {
  if (result.success) return {};
  const out: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

export function ProfileForm({
  initialProfile,
  initialPreferences,
}: {
  initialProfile: ProfileRow | null;
  initialPreferences: PreferencesRow | null;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    displayName: initialProfile?.display_name ?? "",
    birthDate: initialProfile?.birth_date ?? "",
    bio: initialProfile?.bio ?? "",
    interests: initialProfile?.interests?.join(", ") ?? "",
    musicFavorites: (initialProfile?.music_favorites ?? []) as MusicGenre[],
    languages: initialProfile?.languages?.join(", ") ?? "",
    discoveryMode: initialProfile?.discovery_mode ?? "both",
    city: initialProfile?.city ?? "Barcelona",
  });

  const [prefs, setPrefs] = useState({
    ageMin: initialPreferences?.age_min ?? 18,
    ageMax: initialPreferences?.age_max ?? 60,
    maxDistanceKm: initialPreferences?.max_distance_km ?? 25,
    genres: (initialPreferences?.genres ?? []) as MusicGenre[],
    discoverable: initialPreferences?.discoverable ?? true,
    shareAttendance: initialPreferences?.share_attendance ?? true,
    showAge: initialPreferences?.show_age ?? true,
    showCity: initialPreferences?.show_city ?? true,
  });

  const maxBirthDate = useMemo(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 18);
    return d.toISOString().slice(0, 10);
  }, []);

  function toggleGenre(list: MusicGenre[], genre: MusicGenre): MusicGenre[] {
    return list.includes(genre) ? list.filter((g) => g !== genre) : [...list, genre];
  }

  function handleSaveProfile() {
    const payload = {
      displayName: form.displayName.trim(),
      birthDate: form.birthDate,
      bio: form.bio.trim(),
      interests: form.interests.split(",").map((s) => s.trim()).filter(Boolean),
      musicFavorites: form.musicFavorites,
      languages: form.languages.split(",").map((s) => s.trim()).filter(Boolean),
      discoveryMode: form.discoveryMode,
      city: form.city.trim(),
    };
    const clientErrors = zodErrors(profileFormSchema.safeParse(payload));
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      setStatus(null);
      return;
    }
    setErrors({});
    setStatus(null);
    startTransition(async () => {
      const result = await saveProfile(payload);
      if (result.ok) {
        setStatus({ type: "success", message: "Perfil guardado correctamente." });
        router.refresh();
      } else {
        setStatus({ type: "error", message: result.error });
      }
    });
  }

  function handleSavePrefs() {
    const payload = {
      ageMin: Number(prefs.ageMin),
      ageMax: Number(prefs.ageMax),
      maxDistanceKm: Number(prefs.maxDistanceKm),
      genres: prefs.genres,
      discoverable: prefs.discoverable,
      shareAttendance: prefs.shareAttendance,
      showAge: prefs.showAge,
      showCity: prefs.showCity,
    };
    const parsed = preferencesSchema.safeParse(payload);
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      setStatus({ type: "error", message: first?.message ?? "Revisa las preferencias." });
      return;
    }
    setStatus(null);
    startTransition(async () => {
      const result = await savePreferences(payload);
      if (result.ok) {
        setStatus({ type: "success", message: "Preferencias guardadas." });
        router.refresh();
      } else {
        setStatus({ type: "error", message: result.error });
      }
    });
  }

  function handleDeleteAccount() {
    if (
      !window.confirm(
        "¿Seguro que quieres eliminar tu cuenta? Esta acción es permanente y borrará tus datos.",
      )
    ) {
      return;
    }
    startTransition(async () => {
      const result = await deleteMyAccount();
      if (result.ok) {
        router.push("/");
        router.refresh();
      } else {
        setStatus({ type: "error", message: result.error });
      }
    });
  }

  return (
    <div className="flex flex-col gap-6">
      {status && (
        <p
          role={status.type === "error" ? "alert" : "status"}
          className={status.type === "error" ? "text-sm text-danger" : "text-sm text-success"}
        >
          {status.message}
        </p>
      )}

      <Card>
        <h2 className="mb-4 font-semibold">Datos básicos</h2>
        <Input
          label="Nombre visible"
          value={form.displayName}
          onChange={(e) => setForm({ ...form, displayName: e.target.value })}
          error={errors.displayName}
          maxLength={40}
        />
        <Input
          label="Fecha de nacimiento"
          type="date"
          value={form.birthDate}
          max={maxBirthDate}
          onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
          error={errors.birthDate}
          hint="Solo se muestra tu edad. Nunca publicamos tu fecha de nacimiento."
        />
        <Textarea
          label="Biografía"
          value={form.bio}
          maxLength={500}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
          error={errors.bio}
          placeholder="Cuéntale a la gente qué tipo de planes te gustan…"
        />
        <Input
          label="Ciudad o zona"
          value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
          error={errors.city}
        />
        <Input
          label="Intereses (separados por coma)"
          value={form.interests}
          onChange={(e) => setForm({ ...form, interests: e.target.value })}
          placeholder="conciertos, cocktails, afterworks"
        />
        <Input
          label="Idiomas (separados por coma)"
          value={form.languages}
          onChange={(e) => setForm({ ...form, languages: e.target.value })}
          placeholder="Español, Inglés, Catalán"
        />

        <fieldset className="mb-4">
          <legend className="field-label">Modo de interacción</legend>
          <div className="flex flex-wrap gap-2">
            {DISCOVERY_MODES.map((mode) => (
              <button
                key={mode}
                type="button"
                className="chip"
                data-selected={form.discoveryMode === mode}
                aria-pressed={form.discoveryMode === mode}
                onClick={() => setForm({ ...form, discoveryMode: mode })}
              >
                {DISCOVERY_MODE_LABELS[mode]}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="mb-4">
          <legend className="field-label">Música favorita</legend>
          <div className="flex flex-wrap gap-2">
            {MUSIC_GENRES.map((genre) => (
              <button
                key={genre}
                type="button"
                className="chip"
                data-selected={form.musicFavorites.includes(genre)}
                aria-pressed={form.musicFavorites.includes(genre)}
                onClick={() => setForm({ ...form, musicFavorites: toggleGenre(form.musicFavorites, genre) })}
              >
                {MUSIC_GENRE_LABELS[genre]}
              </button>
            ))}
          </div>
        </fieldset>

        <Button onClick={handleSaveProfile} disabled={pending}>
          Guardar perfil
        </Button>
      </Card>

      <Card>
        <h2 className="mb-2 font-semibold">Descubrimiento y privacidad</h2>
        <p className="mb-3 text-xs text-text-muted">
          Estos filtros afectan a quién ves y quién te ve.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="field-label" htmlFor="age-min">Edad mínima</label>
            <input
              id="age-min"
              type="number"
              min={18}
              max={99}
              className="input"
              value={prefs.ageMin}
              onChange={(e) => setPrefs({ ...prefs, ageMin: Number(e.target.value) })}
            />
          </div>
          <div>
            <label className="field-label" htmlFor="age-max">Edad máxima</label>
            <input
              id="age-max"
              type="number"
              min={18}
              max={99}
              className="input"
              value={prefs.ageMax}
              onChange={(e) => setPrefs({ ...prefs, ageMax: Number(e.target.value) })}
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="field-label" htmlFor="distance">Distancia máxima (km)</label>
          <input
            id="distance"
            type="number"
            min={1}
            max={200}
            className="input"
            value={prefs.maxDistanceKm}
            onChange={(e) => setPrefs({ ...prefs, maxDistanceKm: Number(e.target.value) })}
          />
        </div>

        <fieldset className="my-4">
          <legend className="field-label">Géneros que te interesan</legend>
          <div className="flex flex-wrap gap-2">
            {MUSIC_GENRES.map((genre) => (
              <button
                key={genre}
                type="button"
                className="chip"
                data-selected={prefs.genres.includes(genre)}
                aria-pressed={prefs.genres.includes(genre)}
                onClick={() => setPrefs({ ...prefs, genres: toggleGenre(prefs.genres, genre) })}
              >
                {MUSIC_GENRE_LABELS[genre]}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="divide-y divide-line">
          <Toggle
            label="Aparecer en el descubrimiento"
            description="Si lo desactivas, no aparecerás en Personas."
            checked={prefs.discoverable}
            onChange={(v) => setPrefs({ ...prefs, discoverable: v })}
          />
          <Toggle
            label="Compartir mis planes de salida"
            description="Tus asistencias visibles para quienes usen esa noche/local."
            checked={prefs.shareAttendance}
            onChange={(v) => setPrefs({ ...prefs, shareAttendance: v })}
          />
          <Toggle
            label="Mostrar mi edad"
            checked={prefs.showAge}
            onChange={(v) => setPrefs({ ...prefs, showAge: v })}
          />
          <Toggle
            label="Mostrar mi ciudad"
            checked={prefs.showCity}
            onChange={(v) => setPrefs({ ...prefs, showCity: v })}
          />
        </div>

        <Button onClick={handleSavePrefs} disabled={pending} className="mt-4">
          Guardar preferencias
        </Button>
      </Card>

      <Card>
        <h2 className="mb-3 font-semibold">Cuenta</h2>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={() => startTransition(() => signOut())} disabled={pending}>
            Cerrar sesión
          </Button>
          <Button variant="ghost" onClick={handleDeleteAccount} disabled={pending} className="text-danger">
            Eliminar mi cuenta
          </Button>
        </div>
      </Card>
    </div>
  );
}
