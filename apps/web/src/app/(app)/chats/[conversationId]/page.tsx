import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { listMessages } from "@/lib/actions/social";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { ArrowLeftIcon } from "@/components/ui/icons";
import { ChatRoom } from "@/components/app/ChatRoom";

export const metadata: Metadata = { title: "Conversación" };

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) {
  const { conversationId } = await params;

  const supabase = await getSupabaseServerClient();
  if (!supabase) redirect("/login?reason=not-configured");

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Verificación de participación en servidor (la RLS refuerza lo mismo).
  const { data: membership } = await supabase
    .from("conversation_members")
    .select("conversation_id")
    .eq("conversation_id", conversationId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!membership) notFound();

  const messagesResult = await listMessages(conversationId);
  const messages = messagesResult.ok ? messagesResult.data : [];

  // Datos del compañero de conversación.
  const { data: partner } = await supabase
    .from("conversation_members")
    .select("user_id, profiles(display_name, age)")
    .eq("conversation_id", conversationId)
    .neq("user_id", user.id)
    .maybeSingle();

  const partnerProfile = partner?.profiles as unknown as { display_name: string; age: number } | null;

  return (
    <div className="mx-auto flex h-[calc(100dvh-9rem)] max-w-2xl flex-col animate-fade-in md:h-[calc(100dvh-6rem)]">
      <header className="mb-3 flex items-center gap-3">
        <Link href="/chats" className="btn-ghost -ml-3" aria-label="Volver a Chats">
          <ArrowLeftIcon className="size-5" />
        </Link>
        <div>
          <h1 className="font-bold">
            {partnerProfile?.display_name ?? "Conversación"}
            {partnerProfile?.age ? `, ${partnerProfile.age}` : ""}
          </h1>
          <p className="text-xs text-text-muted">Chat privado tras match mutuo</p>
        </div>
      </header>

      <ChatRoom
        conversationId={conversationId}
        currentUserId={user.id}
        initialMessages={messages}
      />
    </div>
  );
}
