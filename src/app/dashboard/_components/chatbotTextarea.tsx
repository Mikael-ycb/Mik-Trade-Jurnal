"use client";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { BrainIcon, SendIcon } from "lucide-react";
import type { Dispatch, KeyboardEvent, SetStateAction } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  message: z.string().trim().min(1, "Pesan tidak boleh kosong"),
});

type FormValues = z.infer<typeof formSchema>;
type ChatMode = "general" | "personal";

export default function ChatbotTextarea({
  sendMessage,
  isThinking,
  setIsThinking,
  mode,
  setMode,
}: {
  sendMessage: (message: string) => void;
  isThinking: boolean;
  setIsThinking: Dispatch<SetStateAction<boolean>>;
  mode: ChatMode;
  setMode: Dispatch<SetStateAction<ChatMode>>;
}) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  const message = useWatch({
    control: form.control,
    name: "message",
  });

  function onSubmit(data: FormValues) {
    const trimmedMessage = data.message.trim();

    if (!trimmedMessage) return;

    sendMessage(trimmedMessage);
    form.reset();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void form.handleSubmit(onSubmit)();
    }
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-2 rounded-2xl bg-secondary p-2"
    >
      <Controller
        control={form.control}
        name="message"
        render={({ field, fieldState }) => (
          <Field>
            <textarea
              {...field}
              id="miternal-chat-message"
              placeholder={
                mode === "personal"
                  ? "Tanyakan tentang jurnal trading kamu..."
                  : "Tanyakan tentang trading crypto..."
              }
              autoComplete="off"
              rows={3}
              aria-label="Pesan untuk Miternal AI"
              aria-invalid={fieldState.invalid}
              className="min-h-16 w-full resize-none rounded-md bg-transparent px-3 py-2 focus:outline-none"
              onKeyDown={handleKeyDown}
            />

            {fieldState.error && (
              <p className="px-3 text-xs text-destructive">
                {fieldState.error.message}
              </p>
            )}
          </Field>
        )}
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Toggle
            type="button"
            variant="outline"
            size="sm"
            pressed={isThinking}
            onPressedChange={setIsThinking}
            aria-label="Aktifkan ringkasan analisis"
            className={cn("h-8 w-8 px-0 py-0 text-xs", {
              "bg-primary/10!": isThinking,
            })}
          >
            <BrainIcon className="size-4" />
          </Toggle>

          <Select
            value={mode}
            onValueChange={(value) => {
              if (value === "general" || value === "personal") {
                setMode(value);
              }
            }}
          >
            <SelectTrigger size="sm" className="w-36">
              <SelectValue placeholder="Pilih mode" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="general">Umum</SelectItem>
              <SelectItem value="personal">Jurnal saya</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          type="submit"
          size="icon"
          variant="ghost"
          disabled={!message?.trim()}
          aria-label="Kirim pesan"
          className="cursor-pointer text-primary hover:bg-primary/10 hover:text-primary disabled:cursor-not-allowed disabled:bg-transparent"
        >
          <SendIcon className="size-5" />
        </Button>
      </div>
    </form>
  );
}
