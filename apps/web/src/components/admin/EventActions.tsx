"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { EventStatus } from "@app-discotecas/shared";
import { Button } from "@/components/ui/Button";
import { publishEventAction } from "@/lib/actions/admin";

/** Publicar/despublicar un evento y enlace para editarlo. */
export function EventActions({
  eventId,
  title,
  status,
}: {
  eventId: string;
  title: string;
  status: EventStatus;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const published = status === "published";

  function handleTogglePublish() {
    setError(null);
    setNotice(null);
    startTransition(async () => {
      const result = await publishEventAction(eventId, !published);
      if (result.ok) {
        setNotice(published ? "Evento despublicado (ahora es borrador)." : "Evento publicado.");
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant={published ? "secondary" : "primary"}
          size="sm"
          loading={pending}
          disabled={pending}
          onClick={handleTogglePublish}
        >
          {published ? "Despublicar" : "Publicar"}
        </Button>
        <Link
          href={`/admin/eventos?editar=${eventId}`}
          className="rounded-lg px-2 py-1 text-xs font-medium text-neon-violet hover:underline"
        >
          Editar «{title}»
        </Link>
      </div>
      {notice && (
        <p role="status" className="text-xs text-success">
          {notice}
        </p>
      )}
      {error && (
        <p role="alert" className="text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
