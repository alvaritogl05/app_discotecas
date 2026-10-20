"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { setUserSuspendedAction } from "@/lib/actions/admin";

/**
 * Botón de suspensión de un usuario. El estado de suspensión no se expone en
 * admin_list_users, así que la acción se aplica de forma idempotente.
 */
export function UserActions({ userId, displayName }: { userId: string; displayName: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  function handleSuspend() {
    const confirmed = window.confirm(
      `¿Suspender a ${displayName}? Su asistencia dejará de compartirse y saldrá del descubrimiento.`,
    );
    if (!confirmed) return;

    setError(null);
    setNotice(null);
    startTransition(async () => {
      const result = await setUserSuspendedAction(userId, true);
      if (result.ok) {
        setNotice("Usuario suspendido correctamente.");
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <Button
        type="button"
        variant="secondary"
        size="sm"
        loading={pending}
        disabled={pending}
        onClick={handleSuspend}
      >
        Suspender
      </Button>
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
