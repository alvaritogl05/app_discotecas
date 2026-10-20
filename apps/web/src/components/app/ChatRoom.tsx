"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { sendMessage, type MessageItem } from "@/lib/actions/social";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button, Spinner } from "@/components/ui/Button";
import { SendIcon } from "@/components/ui/icons";

interface Props {
  conversationId: string;
  currentUserId: string;
  initialMessages: MessageItem[];
}

/**
 * Conversación privada. Usa Realtime de Supabase cuando está disponible y
 * hace polling como plan B; la autoridad de acceso sigue siendo RLS.
 */
export function ChatRoom({ conversationId, currentUserId, initialMessages }: Props) {
  const [messages, setMessages] = useState<MessageItem[]>(initialMessages);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  // Realtime: nuevos mensajes de esta conversación.
  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    let subscribed = false;
    const channel = supabase
      .channel(`conversation-${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const row = payload.new as {
            id: string;
            sender_id: string;
            body: string;
            created_at: string;
          };
          setMessages((prev) =>
            prev.some((m) => m.id === row.id)
              ? prev
              : [
                  ...prev,
                  { id: row.id, senderId: row.sender_id, body: row.body, createdAt: row.created_at },
                ],
          );
        },
      )
      .subscribe((status) => {
        subscribed = status === "SUBSCRIBED";
      });

    // Plan B: polling ligero si no hay conexión realtime.
    const poll = setInterval(async () => {
      if (subscribed) return;
      const { listMessages } = await import("@/lib/actions/social");
      const result = await listMessages(conversationId);
      if (result.ok) setMessages(result.data);
    }, 10_000);

    return () => {
      clearInterval(poll);
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  function handleSend() {
    const body = draft.trim();
    if (!body) return;
    setError(null);
    // Actualización optimista.
    const optimisticId = `optimistic-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      { id: optimisticId, senderId: currentUserId, body, createdAt: new Date().toISOString() },
    ]);
    setDraft("");
    startTransition(async () => {
      const result = await sendMessage({ conversationId, body });
      if (!result.ok) {
        setError(result.error);
        // Revierte el mensaje optimista fallido.
        setMessages((prev) => prev.filter((m) => m.id !== optimisticId));
      } else {
        setMessages((prev) =>
          prev.map((m) => (m.id === optimisticId ? result.data : m)),
        );
      }
    });
  }

  return (
    <>
      <div
        className="scrollbar-thin flex-1 space-y-2 overflow-y-auto rounded-2xl border border-line bg-surface p-3"
        role="log"
        aria-live="polite"
        aria-label="Mensajes de la conversación"
      >
        {messages.length === 0 && (
          <p className="py-10 text-center text-sm text-text-muted">
            Aún no hay mensajes. Saluda con un «¡Hola!»
          </p>
        )}
        {messages.map((message) => {
          const mine = message.senderId === currentUserId;
          return (
            <div
              key={message.id}
              className={`flex ${mine ? "justify-end" : "justify-start"}`}
            >
              <p
                className={
                  mine
                    ? "max-w-[80%] rounded-2xl rounded-br-sm bg-neon-violet/25 px-3.5 py-2 text-sm text-text"
                    : "max-w-[80%] rounded-2xl rounded-bl-sm bg-surface-raised px-3.5 py-2 text-sm text-text"
                }
              >
                {message.body}
                <span className="mt-1 block text-[10px] text-text-muted">
                  {new Date(message.createdAt).toLocaleTimeString("es-ES", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </p>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {error && (
        <p role="alert" className="mt-2 text-sm text-danger">
          {error}
        </p>
      )}

      <form
        className="mt-3 flex items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
      >
        <label htmlFor="chat-input" className="sr-only">
          Escribe un mensaje
        </label>
        <textarea
          id="chat-input"
          className="input max-h-32 min-h-11 flex-1 resize-none"
          rows={1}
          maxLength={2000}
          placeholder="Escribe un mensaje…"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <Button type="submit" disabled={pending || draft.trim().length === 0} aria-label="Enviar mensaje">
          {pending ? <Spinner className="size-4" /> : <SendIcon className="size-5" />}
        </Button>
      </form>
    </>
  );
}
