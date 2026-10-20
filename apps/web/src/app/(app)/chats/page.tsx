import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { listMatches } from "@/lib/actions/social";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { EmptyState, Card } from "@/components/ui/Layout";
import { ChatIcon, UserIcon } from "@/components/ui/icons";

export const metadata: Metadata = { title: "Chats" };

export default async function ChatsPage() {
  const supabase = await getSupabaseServerClient();
  if (!supabase) redirect("/login?reason=not-configured");

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const result = await listMatches();

  return (
    <div className="mx-auto max-w-2xl animate-fade-in">
      <h1 className="mb-1 text-2xl font-bold">Chats</h1>
      <p className="mb-6 text-sm text-text-secondary">
        Solo puedes escribir en conversaciones abiertas tras un match mutuo.
      </p>

      {!result.ok || result.data.length === 0 ? (
        <EmptyState
          title="No tienes conversaciones todavía"
          description="Los chats se abren cuando hay un match. Empieza por descubrir personas."
          action={{ href: "/personas", label: "Ir a Personas" }}
          icon={<ChatIcon className="size-10" />}
        />
      ) : (
        <ul className="flex flex-col gap-2">
          {result.data.map((match) => (
            <li key={match.id}>
              <Link
                href={match.conversationId ? `/chats/${match.conversationId}` : "/matches"}
                className="block"
              >
                <Card className="flex items-center gap-3 transition hover:bg-surface-raised">
                  <span className="flex size-11 items-center justify-center rounded-full bg-neon-pink/15 text-neon-pink">
                    <UserIcon className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-semibold">
                      {match.partnerName}
                      {match.partnerAge ? `, ${match.partnerAge}` : ""}
                    </p>
                    <p className="truncate text-xs text-text-muted">
                      Abrir conversación
                    </p>
                  </div>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
