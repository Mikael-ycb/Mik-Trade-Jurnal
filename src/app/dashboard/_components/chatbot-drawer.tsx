"use client";

import { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import Markdown from "react-markdown";
import { BotIcon, ChevronDownIcon, EllipsisIcon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { handleChatStreaming } from "@/features/ai/chat";
import { cn } from "@/lib/utils";
import { Conversation } from "@/app/types/ai";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import ChatbotTextarea from "./chatbotTextarea";

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
        setConversation((prev) => {
          const updated = [...prev];
          const lastIndex = updated.length - 1;
          const lastMessage = updated[lastIndex];

          if (!lastMessage || lastMessage.role !== "model") {
            return prev;
          }

          const parts = [...lastMessage.parts];

          if (thinking) {
            const isThoughtChunk = chunk.startsWith("[thounght]");
            const chunkText = isThoughtChunk
              ? chunk.replace("[thounght]", "")
              : chunk;

            const targetIndex = isThoughtChunk ? 0 : 1;

            while (parts.length <= targetIndex) {
              parts.push({ text: "" });
            }

            parts[targetIndex] = {
              ...parts[targetIndex],
              ...(isThoughtChunk ? { thought: true } : {}),
              text: `${parts[targetIndex].text ?? ""}${chunkText}`,
            };
          } else {
            parts[0] = {
              ...parts[0],
              text: `${parts[0]?.text ?? ""}${chunk}`,
            };
          }

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
      parts: isThinking
        ? [{ thounght: true, text: "" }, { text: "" }]
        : [{ text: "" }],
    };

    // Kirim riwayat yang sudah menyertakan pesan terbaru.
    const messages = [...conversation, userMessage];

    // Placeholder menampung respons streaming.
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
    <Drawer>
      <DrawerTrigger className="fixed bottom-4 right-4 z-50">
        <Button
          className="size-14 rounded-full shadow-lg"
          size="icon-lg"
          aria-label="Buka Miternal AI"
        >
          <BotIcon className="size-6" />
        </Button>
      </DrawerTrigger>

      <DrawerContent className="w-screen! md:w-110!">
        <DrawerHeader>
          <div>
            <DrawerTitle className="font-bold text-primary">
              Miternal AI
            </DrawerTitle>
            <DrawerDescription>
              Asisten untuk jurnal trading, evaluasi performa, dan manajemen
              risiko crypto.
            </DrawerDescription>
          </div>

          <DrawerClose>
            <Button variant="outline" size="icon" aria-label="Tutup chatbot">
              <XIcon />
            </Button>
          </DrawerClose>
        </DrawerHeader>

        <div ref={chatRef} className="no-scrollbar h-full overflow-y-auto px-4">
          {conversation.length > 0 ? (
            <div className="flex h-full flex-col gap-8 overflow-x-hidden pb-4">
              {conversation.map((message, index) => (
                <div
                  key={`conversation-${index}`}
                  className={cn(
                    "flex flex-col gap-2",
                    message.role === "model" ? "items-start" : "items-end",
                  )}
                >
                  <div
                    className={cn("flex w-full flex-col", {
                      "w-fit max-w-3/4 rounded-3xl rounded-br-md bg-primary/20 px-5 py-2 text-primary":
                        message.role === "user",
                    })}
                  >
                    {message.role === "model" && (
                      <div className="flex items-center gap-1 text-sm font-semibold text-primary">
                        <BotIcon className="size-4" />
                        <span>Miternal AI</span>
                      </div>
                    )}

                    {message.role === "model" ? (
                      <div className="response-ai min-w-0">
                        {message.parts.map((part, partIndex) => (
                          <div key={`response-${index}-${partIndex}`}>
                            {part.thounght ? (
                              <Collapsible>
                                <CollapsibleTrigger>
                                  <Button variant="ghost" size="sm">
                                    Tampilkan ringkasan analisis
                                    <ChevronDownIcon className="ml-1 size-4" />
                                  </Button>
                                </CollapsibleTrigger>

                                <CollapsibleContent>
                                  <div className="ml-4 border-l pl-2 text-sm text-muted-foreground">
                                    <Markdown>{part.text ?? ""}</Markdown>
                                  </div>
                                </CollapsibleContent>
                              </Collapsible>
                            ) : (
                              <Markdown>{part.text ?? ""}</Markdown>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      message.parts[0]?.text
                    )}
                  </div>
                </div>
              ))}

              {isPending && (
                <div className="flex -mt-2 items-center animate-pulse">
                  <EllipsisIcon className="size-8 text-primary/50" />
                  <span className="text-sm text-muted-foreground">
                    Miternal AI sedang menyiapkan jawaban...
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <BotIcon className="mb-3 size-10 text-primary" />
              <h2 className="text-3xl font-bold text-primary">Halo, Trader!</h2>
              <p className="mt-2 max-w-xs text-sm text-muted-foreground">
                Tanyakan tentang trading crypto, atau minta bantuan untuk
                mengevaluasi jurnal trading kamu.
              </p>
            </div>
          )}
        </div>

        <DrawerFooter>
          <ChatbotTextarea
            isThinking={isThinking}
            setIsThinking={setIsThinking}
            sendMessage={sendMessage}
            mode={mode}
            setMode={setMode}
          />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
