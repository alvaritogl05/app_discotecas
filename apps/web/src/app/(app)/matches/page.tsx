import type { Metadata } from "next";
import Link from "next/link";
import { listMatches } from "@/lib/actions/social";
import { EmptyState, Card, Badge } from "@/components/ui/Layout";
import { ChatIcon, HeartIcon, UserIcon } from "@/components/ui/icons";

export const metadata: Metadata = { title: "Matches" };

export default async function MatchesPage() {
  const result = await listMatches();

  return (
    <div className="animate-fade-in">
      <h1 className="mb-1 text-2xl font-bold">Matches</h1>
      <p className="mb-6 text-sm text-text-secondary">
        Conexiones con interés mutuo. El chat se abre automáticamente.
      </p>

      {!result.ok ? (
        <EmptyState
          title="No se han podido cargar los matches"
          description={result.error}
          icon={<HeartIcon className="size-10" />}
        />
      ) : result.data.length === 0 ? (
        <EmptyState
          title="Todavía no tienes matches"
          description="Cuando tú y otra persona os intereséis mutuamente, apareceréis aquí y podréis chatear."
          action={{ href: "/personas", label: "Descubrir personas" }}
          icon={<HeartIcon className="size-10" />}
        />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {result.data.map((match) => (
            <li key={match.id}>
              <Link href={match.conversationId ? `/chats/${match.conversationId}` : "/chats"}>
                <Card className="flex items-center gap-3 transition hover:bg-surface-raised">
                  <span className="flex size-12 items-center justify-center rounded-full bg-neon-violet/15 text-neon-violet">
                    <UserIcon className="size-6" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-text">
                      {match.partnerName}
                      {match.partnerAge ? `, ${match.partnerAge}` : ""}
                    </p>
                    <p className="text-xs text-text-muted">
                      Match el {new Date(match.createdAt).toLocaleDateString("es-ES")}
                    </p>
                  </div>
                  <Badge tone="violet">
                    <ChatIcon className="size-3.5" />
                    Chat
                  </Badge>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
