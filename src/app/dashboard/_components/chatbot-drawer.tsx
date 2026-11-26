"use client";

import { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import Markdown from "react-markdown";
import { BotIcon, EllipsisIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { handleChatStreaming } from "@/features/ai/chat";
import { cn } from "@/lib/utils";
import ChatbotTextarea from "./chatbotTextarea";
import type { Conversation } from "@/app/types/ai";

type ChatMode = "general" | "personal";

type ChatMutationVariables = {
  messages: Conversation[];
  isThinking: boolean;
  mode: ChatMode;
};

export default function ChatbotDrawer() {
  const chatRef = useRef<HTMLDivElement>(null);

  const [conversation, setConversation] = useState<Conversation[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [mode, setMode] = useState<ChatMode>("general");

  const { mutate: handleChatMutation, isPending } = useMutation({
    mutationFn: async ({
      messages,
      isThinking: thinking,
      mode: chatMode,
    }: ChatMutationVariables) => {
      const response = await handleChatStreaming(messages, thinking, chatMode);

      for await (const chunk of response) {
        // Abaikan chunk penalaran internal; tampilkan jawaban akhir saja.
        if (chunk.startsWith("[thounght]")) continue;

        setConversation((prev) => {
          const updated = [...prev];
          const lastIndex = updated.length - 1;
          const lastMessage = updated[lastIndex];

          if (!lastMessage || lastMessage.role !== "model") {
            return prev;
          }

          const parts = [...lastMessage.parts];
          const answerIndex = parts.findIndex((part) => !part.thounght);
          const targetIndex = answerIndex === -1 ? parts.length : answerIndex;

          if (!parts[targetIndex]) {
            parts[targetIndex] = { text: "" };
          }

          parts[targetIndex] = {
            ...parts[targetIndex],
            text: `${parts[targetIndex].text ?? ""}${chunk}`,
          };

          updated[lastIndex] = {
            ...lastMessage,
            parts,
          };

          return updated;
        });
      }

      return true;
    },

    onError: (error) => {
      setConversation((prev) => {
        const updated = [...prev];
        const lastIndex = updated.length - 1;
        const errorText = `Terjadi kesalahan: ${error.message}`;

        if (lastIndex >= 0 && updated[lastIndex].role === "model") {
          updated[lastIndex] = {
            ...updated[lastIndex],
            parts: [{ text: errorText }],
          };

          return updated;
        }

        return [
          ...updated,
          {
            role: "model",
            parts: [{ text: errorText }],
          },
        ];
      });
    },
  });

  function sendMessage(message: string) {
    const trimmedMessage = message.trim();

    if (!trimmedMessage || isPending) return;

    const userMessage: Conversation = {
      role: "user",
      parts: [{ text: trimmedMessage }],
    };

    const modelPlaceholder: Conversation = {
      role: "model",
      parts: [{ text: "" }],
    };

    // Sertakan pesan terbaru agar AI tidak menerima riwayat yang tertinggal.
    const messages = [...conversation, userMessage];

    setConversation([...messages, modelPlaceholder]);

    handleChatMutation({
      messages,
      isThinking,
      mode,
    });
  }

  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [conversation]);

  return (
    <Sheet>
      <SheetTrigger>
        <Button
          className="fixed bottom-4 right-4 z-50 size-14 rounded-full bg-fuchsia-600 text-white shadow-lg shadow-fuchsia-950/30 hover:bg-fuchsia-500"
          size="icon-lg"
          aria-label="Buka Miternal AI"
        >
          <BotIcon className="size-6" />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="flex h-dvh w-full flex-col gap-0 overflow-hidden border-l border-white/10 bg-[#0b0b12] p-0 text-slate-100 shadow-2xl shadow-black/40 sm:max-w-md"
      >
        <SheetHeader className="border-b border-white/10 bg-[#0b0b12] px-5 py-5 text-left">
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-xl bg-fuchsia-500/10 text-fuchsia-300">
              <BotIcon className="size-5" />
            </div>

            <SheetTitle className="text-lg font-semibold text-fuchsia-300">
              Miternal AI
            </SheetTitle>
          </div>

          <SheetDescription className="text-sm leading-relaxed text-slate-400">
            Asisten untuk jurnal trading, evaluasi performa, dan manajemen
            risiko crypto.
          </SheetDescription>
        </SheetHeader>

        <div
          ref={chatRef}
          className="no-scrollbar min-h-0 flex-1 overflow-y-auto bg-[#0b0b12] px-5 py-5"
        >
          {conversation.length > 0 ? (
            <div className="flex flex-col gap-6">
              {conversation.map((message, index) => (
                <div
                  key={`conversation-${index}`}
                  className={cn(
                    "flex flex-col gap-2",
                    message.role === "model" ? "items-start" : "items-end",
                  )}
                >
                  <div
                    className={cn("flex min-w-0 flex-col", {
                      "w-fit max-w-[85%] rounded-2xl rounded-br-md border border-fuchsia-400/10 bg-fuchsia-500/10 px-4 py-3 text-slate-100":
                        message.role === "user",
                      "w-full": message.role === "model",
                    })}
                  >
                    {message.role === "model" && (
                      <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-fuchsia-300">
                        <BotIcon className="size-4" />
                        <span>Miternal AI</span>
                      </div>
                    )}

                    {message.role === "model" ? (
                      <div className="response-ai min-w-0 break-words text-sm leading-7 text-slate-200">
                        {message.parts
                          .filter((part) => !part.thounght)
                          .map((part, partIndex) => (
                            <div key={`response-${index}-${partIndex}`}>
                              <Markdown>{part.text ?? ""}</Markdown>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap break-words text-sm leading-6">
                        {message.parts[0]?.text}
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {isPending && (
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <EllipsisIcon className="size-6 animate-pulse text-fuchsia-300/70" />
                  <span>Miternal AI sedang menyiapkan jawaban...</span>
                </div>
              )}
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center px-6 text-center">
              <div className="mb-5 flex size-16 items-center justify-center rounded-2xl border border-fuchsia-400/20 bg-fuchsia-500/10 text-fuchsia-300 shadow-lg shadow-fuchsia-950/20">
                <BotIcon className="size-8" />
              </div>

              <h2 className="text-2xl font-semibold tracking-tight text-white">
                Halo, Trader!
              </h2>

              <p className="mt-3 max-w-xs text-sm leading-6 text-slate-400">
                Tanya tentang trading crypto atau evaluasi jurnal trading kamu
                bersama Miternal AI.
              </p>

              <div className="mt-6 flex flex-wrap justify-center gap-2">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300">
                  Evaluasi trading
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300">
                  Manajemen risiko
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-white/10 bg-[#0b0b12] p-4">
          <ChatbotTextarea
            isThinking={isThinking}
            setIsThinking={setIsThinking}
            sendMessage={sendMessage}
            mode={mode}
            setMode={setMode}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
