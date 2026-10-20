"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { groupFormSchema, groupInviteSchema } from "@app-discotecas/shared";
import { getSupabaseServerClient, actionError, type ActionResult } from "@/lib/supabase/server";

export interface GroupItem {
  id: string;
  name: string;
  description: string | null;
  role: string;
  memberCount: number;
  ownerName: string;
}

export async function listMyGroups(): Promise<ActionResult<GroupItem[]>> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return { ok: false, error: "Supabase no está configurado." };

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return { ok: false, error: "Sesión caducada." };

  // Grupos donde soy miembro (RLS limita a los visibles para mí).
  const { data: memberships, error } = await supabase
    .from("group_members")
    .select("group_id, role, friend_groups(id, name, description, owner_id, profiles:owner_id(display_name))")
    .eq("user_id", userData.user.id);

  if (error) return actionError(error, "No se han podido cargar tus grupos.");

  const rows = (memberships ?? []) as unknown as {
    group_id: string;
    role: string;
    friend_groups: {
      id: string;
      name: string;
      description: string | null;
      owner_id: string;
      profiles: { display_name: string } | null;
    } | null;
  }[];

  const groupIds = rows.map((r) => r.group_id);
  let counts = new Map<string, number>();
  if (groupIds.length > 0) {
    const { data: members } = await supabase
      .from("group_members")
      .select("group_id")
      .in("group_id", groupIds);
    const tally = new Map<string, number>();
    for (const m of members ?? []) {
      tally.set(m.group_id, (tally.get(m.group_id) ?? 0) + 1);
    }
    counts = tally;
  }

  return {
    ok: true,
    data: rows
      .filter((r) => r.friend_groups)
      .map((r) => ({
        id: r.group_id,
        name: r.friend_groups!.name,
        description: r.friend_groups!.description,
        role: r.role,
        memberCount: counts.get(r.group_id) ?? 1,
        ownerName: r.friend_groups!.profiles?.display_name ?? "Usuario",
      })),
  };
}

export async function createGroup(input: unknown): Promise<ActionResult<{ id: string }>> {
  const parsed = groupFormSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos del grupo no válidos." };
  }
  const supabase = await getSupabaseServerClient();
  if (!supabase) return { ok: false, error: "Supabase no está configurado." };

  const { data, error } = await supabase.rpc("create_friend_group", {
    p_name: parsed.data.name,
    p_description: parsed.data.description ?? null,
  });
  if (error) return actionError(error, "No se ha podido crear el grupo.");

  revalidatePath("/grupos");
  return { ok: true, data: { id: (data as { id: string }).id } };
}

/** Invita por id a un usuario (por ahora identificado por su id de perfil). */
export async function inviteToGroup(input: unknown): Promise<ActionResult<null>> {
  const parsed = groupInviteSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invitación no válida." };

  const supabase = await getSupabaseServerClient();
  if (!supabase) return { ok: false, error: "Supabase no está configurado." };

  const { error } = await supabase.rpc("invite_to_group", {
    p_group_id: parsed.data.groupId,
    p_invitee_id: parsed.data.inviteeId,
  });
  if (error) return actionError(error, "No se ha podido enviar la invitación.");
  return { ok: true, data: null };
}

export interface InvitationItem {
  id: string;
  groupId: string;
  groupName: string;
  inviterName: string;
}

export async function listMyInvitations(): Promise<ActionResult<InvitationItem[]>> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return { ok: false, error: "Supabase no está configurado." };

  const { data, error } = await supabase
    .from("group_invitations")
    .select("id, group_id, status, friend_groups(name), inviter:inviter_id(display_name)")
    .eq("status", "pending");

  if (error) return actionError(error, "No se han podido cargar las invitaciones.");

  const rows = (data ?? []) as unknown as {
    id: string;
    group_id: string;
    friend_groups: { name: string } | null;
    inviter: { display_name: string } | null;
  }[];

  return {
    ok: true,
    data: rows
      .filter((r) => r.friend_groups)
      .map((r) => ({
        id: r.id,
        groupId: r.group_id,
        groupName: r.friend_groups!.name,
        inviterName: r.inviter?.display_name ?? "Alguien",
      })),
  };
}

export async function respondInvitation(invitationId: string, accept: boolean): Promise<ActionResult<null>> {
  const parsed = z.uuid().safeParse(invitationId);
  if (!parsed.success) return { ok: false, error: "Invitación no válida." };

  const supabase = await getSupabaseServerClient();
  if (!supabase) return { ok: false, error: "Supabase no está configurado." };

  const { error } = await supabase.rpc("respond_group_invitation", {
    p_invitation_id: parsed.data,
    p_accept: accept,
  });
  if (error) return actionError(error, "No se ha podido responder la invitación.");
  revalidatePath("/grupos");
  return { ok: true, data: null };
}

export async function leaveGroup(groupId: string): Promise<ActionResult<null>> {
  const parsed = z.uuid().safeParse(groupId);
  if (!parsed.success) return { ok: false, error: "Grupo no válido." };

  const supabase = await getSupabaseServerClient();
  if (!supabase) return { ok: false, error: "Supabase no está configurado." };

  const { error } = await supabase.rpc("leave_group", { p_group_id: parsed.data });
  if (error) return actionError(error, "No has podido abandonar el grupo.");
  revalidatePath("/grupos");
  return { ok: true, data: null };
}
