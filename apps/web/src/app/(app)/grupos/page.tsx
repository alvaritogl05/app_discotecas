import type { Metadata } from "next";
import { listMyGroups, listMyInvitations } from "@/lib/actions/groups";
import { GroupsManager } from "@/components/app/GroupsManager";

export const metadata: Metadata = { title: "Grupos" };

export default async function GroupsPage() {
  const [groupsResult, invitationsResult] = await Promise.all([
    listMyGroups(),
    listMyInvitations(),
  ]);

  return (
    <div className="mx-auto max-w-2xl animate-fade-in">
      <h1 className="mb-1 text-2xl font-bold">Grupos de amigos</h1>
      <p className="mb-6 text-sm text-text-secondary">
        Crea tu grupo, invita a tu gente y coordina el plan de la noche.
      </p>
      <GroupsManager
        groups={groupsResult.ok ? groupsResult.data : []}
        invitations={invitationsResult.ok ? invitationsResult.data : []}
        loadError={!groupsResult.ok ? groupsResult.error : null}
      />
    </div>
  );
}
