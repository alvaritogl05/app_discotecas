"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createGroup,
  inviteToGroup,
  leaveGroup,
  respondInvitation,
  type GroupItem,
  type InvitationItem,
} from "@/lib/actions/groups";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Form";
import { Card, Badge } from "@/components/ui/Layout";
import { UsersIcon } from "@/components/ui/icons";

interface Props {
  groups: GroupItem[];
  invitations: InvitationItem[];
  loadError: string | null;
}

export function GroupsManager({ groups, invitations, loadError }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [inviteFor, setInviteFor] = useState<string | null>(null);
  const [inviteeId, setInviteeId] = useState("");

  function handleCreate() {
    setStatus(null);
    startTransition(async () => {
      const result = await createGroup({ name: name.trim(), description: description.trim() });
      if (result.ok) {
        setStatus({ type: "success", message: "Grupo creado." });
        setName("");
        setDescription("");
        router.refresh();
      } else {
        setStatus({ type: "error", message: result.error });
      }
    });
  }

  function handleInvite(groupId: string) {
    setStatus(null);
    startTransition(async () => {
      const result = await inviteToGroup({ groupId, inviteeId: inviteeId.trim() });
      if (result.ok) {
        setStatus({ type: "success", message: "Invitación enviada." });
        setInviteFor(null);
        setInviteeId("");
      } else {
        setStatus({ type: "error", message: result.error });
      }
    });
  }

  function handleRespond(invitationId: string, accept: boolean) {
    startTransition(async () => {
      const result = await respondInvitation(invitationId, accept);
      if (result.ok) {
        setStatus({
          type: "success",
          message: accept ? "Te has unido al grupo." : "Invitación rechazada.",
        });
        router.refresh();
      } else {
        setStatus({ type: "error", message: result.error });
      }
    });
  }

  function handleLeave(groupId: string) {
    if (!window.confirm("¿Abandonar este grupo?")) return;
    startTransition(async () => {
      const result = await leaveGroup(groupId);
      if (result.ok) {
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
      {loadError && (
        <p role="alert" className="text-sm text-danger">
          {loadError}
        </p>
      )}

      {invitations.length > 0 && (
        <Card>
          <h2 className="mb-3 font-semibold">Invitaciones pendientes</h2>
          <ul className="flex flex-col gap-3">
            {invitations.map((inv) => (
              <li key={inv.id} className="flex items-center justify-between gap-3">
                <p className="text-sm">
                  <span className="font-medium">{inv.inviterName}</span> te invita a{" "}
                  <span className="font-medium">{inv.groupName}</span>
                </p>
                <div className="flex gap-2">
                  <Button size="sm" disabled={pending} onClick={() => handleRespond(inv.id, true)}>
                    Aceptar
                  </Button>
                  <Button size="sm" variant="secondary" disabled={pending} onClick={() => handleRespond(inv.id, false)}>
                    Rechazar
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <Card>
        <h2 className="mb-3 font-semibold">Crear un grupo</h2>
        <Input
          label="Nombre del grupo"
          value={name}
          maxLength={60}
          onChange={(e) => setName(e.target.value)}
          placeholder="Los de siempre"
        />
        <Textarea
          label="Descripción (opcional)"
          value={description}
          maxLength={300}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Button onClick={handleCreate} disabled={pending || name.trim().length < 2}>
          Crear grupo
        </Button>
      </Card>

      <div>
        <h2 className="mb-3 font-semibold">Mis grupos</h2>
        {groups.length === 0 ? (
          <p className="text-sm text-text-muted">
            Aún no perteneces a ningún grupo. Crea uno arriba.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {groups.map((group) => (
              <li key={group.id}>
                <Card>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold">{group.name}</h3>
                      {group.description && (
                        <p className="mt-0.5 text-sm text-text-secondary">{group.description}</p>
                      )}
                      <p className="mt-1 flex items-center gap-2 text-xs text-text-muted">
                        <UsersIcon className="size-3.5" />
                        {group.memberCount} {group.memberCount === 1 ? "miembro" : "miembros"}
                        <Badge tone={group.role === "owner" ? "violet" : "neutral"}>
                          {group.role === "owner" ? "Propietario" : "Miembro"}
                        </Badge>
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setInviteFor(inviteFor === group.id ? null : group.id)}
                      >
                        Invitar
                      </Button>
                      {group.role !== "owner" && (
                        <button
                          type="button"
                          className="btn-ghost text-xs text-danger"
                          onClick={() => handleLeave(group.id)}
                          disabled={pending}
                        >
                          Abandonar
                        </button>
                      )}
                    </div>
                  </div>

                  {inviteFor === group.id && (
                    <div className="mt-3 flex gap-2 border-t border-line pt-3">
                      <label htmlFor={`invite-${group.id}`} className="sr-only">
                        Identificador del usuario a invitar
                      </label>
                      <input
                        id={`invite-${group.id}`}
                        className="input flex-1"
                        placeholder="ID del usuario (por ahora, identificador directo)"
                        value={inviteeId}
                        onChange={(e) => setInviteeId(e.target.value)}
                      />
                      <Button size="sm" disabled={pending || !inviteeId.trim()} onClick={() => handleInvite(group.id)}>
                        Enviar
                      </Button>
                    </div>
                  )}
                </Card>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
