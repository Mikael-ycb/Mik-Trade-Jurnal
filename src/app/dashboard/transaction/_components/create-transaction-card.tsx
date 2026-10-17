"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { createJurnal } from "@/features/jurnal/action";
import { DatePicker } from "@/components/ui/date-picker";

const formSchema = z.object({
  symbol: z.string().trim().min(1, "Symbol wajib diisi"),
  type: z.enum(["buy", "sell"], {
    error: "Tipe transaksi wajib dipilih",
  }),
  entry_price: z.string().min(1, "Entry price wajib diisi"),
  exit_price: z.string(),
  quantity: z.string().min(1, "Quantity wajib diisi"),
  result: z.string(),
  date: z.string().min(1, "Tanggal wajib diisi"),
  notes: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateJurnalCard({ refetch }: { refetch: () => void }) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symbol: "",
      type: "buy",
      entry_price: "",
      exit_price: "",
      quantity: "",
      result: "",
      date: format(new Date(), "yyyy-MM-dd"),
      notes: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: FormValues) => {
      return createJurnal({
        symbol: data.symbol.trim().toUpperCase(),
        type: data.type,
        entry_price: Number(data.entry_price),
        exit_price: data.exit_price ? Number(data.exit_price) : null,
        quantity: Number(data.quantity),
        result: data.result !== "" ? Number(data.result) : null,
        date: data.date,
        notes: data.notes.trim() || null,
      });
    },
    onSuccess: () => {
      form.reset({
        symbol: "",
        type: "buy",
        entry_price: "",
        exit_price: "",
        quantity: "",
        result: "",
        date: format(new Date(), "yyyy-MM-dd"),
        notes: "",
      });

      refetch();
      toast.success("Jurnal trading berhasil dibuat");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Gagal membuat jurnal trading",
      );
    },
  });

  const onSubmit = (data: FormValues) => {
    mutate(data);
  };

  return (
    <Card className="h-fit w-full gap-2 border-white/10 bg-[#0c1020] text-white">
      <CardHeader className="gap-1">
        <CardTitle>Create Trading Journal</CardTitle>
        <CardDescription className="text-slate-400">
          Catat aktivitas trading crypto kamu.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="gap-4">
            <Controller
              control={form.control}
              name="symbol"
              render={({ field, fieldState }) => (
                <Field className="gap-1">
                  <FieldLabel htmlFor="jurnal-symbol">Symbol</FieldLabel>
                  <Input
                    {...field}
                    id="jurnal-symbol"
                    placeholder="Contoh: BTCUSDT"
                    autoComplete="off"
                    className="border-white/10 bg-[#080b18]"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="type"
              render={({ field, fieldState }) => (
                <Field className="gap-1">
                  <FieldLabel htmlFor="jurnal-type">Tipe Transaksi</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      id="jurnal-type"
                      className="w-full border-white/10 bg-[#080b18]"
                    >
                      <SelectValue placeholder="Pilih tipe transaksi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="buy">Buy / Long</SelectItem>
                      <SelectItem value="sell">Sell / Short</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="entry_price"
              render={({ field, fieldState }) => (
                <Field className="gap-1">
                  <FieldLabel htmlFor="jurnal-entry">
                    Entry Price (USDT)
                  </FieldLabel>
                  <Input
                    {...field}
                    id="jurnal-entry"
                    type="number"
                    step="any"
                    min="0"
                    placeholder="0.00"
                    className="border-white/10 bg-[#080b18]"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="exit_price"
              render={({ field, fieldState }) => (
                <Field className="gap-1">
                  <FieldLabel htmlFor="jurnal-exit">
                    Exit Price (USDT)
                    <span className="ml-1 text-slate-500">(Opsional)</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    id="jurnal-exit"
                    type="number"
                    step="any"
                    min="0"
                    placeholder="Kosongkan jika posisi masih terbuka"
                    className="border-white/10 bg-[#080b18]"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="quantity"
              render={({ field, fieldState }) => (
                <Field className="gap-1">
                  <FieldLabel htmlFor="jurnal-quantity">Quantity</FieldLabel>
                  <Input
                    {...field}
                    id="jurnal-quantity"
                    type="number"
                    step="any"
                    min="0"
                    placeholder="Jumlah aset yang diperdagangkan"
                    className="border-white/10 bg-[#080b18]"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="result"
              render={({ field, fieldState }) => (
                <Field className="gap-1">
                  <FieldLabel htmlFor="jurnal-result">
                    Profit / Loss (USDT)
                    <span className="ml-1 text-slate-500">(Opsional)</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    id="jurnal-result"
                    type="number"
                    step="any"
                    placeholder="Contoh: 25.50 atau -10.00"
                    className="border-white/10 bg-[#080b18]"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="date"
              render={({ field, fieldState }) => (
                <Field className="gap-1">
                  <FieldLabel htmlFor="jurnal-date">Tanggal</FieldLabel>
                  <DatePicker
                    id="jurnal-date"
                    value={
                      field.value
                        ? new Date(`${field.value}T12:00:00`)
                        : undefined
                    }
                    onChange={(date) =>
                      field.onChange(date ? format(date, "yyyy-MM-dd") : "")
                    }
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="notes"
              render={({ field, fieldState }) => (
                <Field className="gap-1">
                  <FieldLabel htmlFor="jurnal-notes">Catatan</FieldLabel>
                  <Textarea
                    {...field}
                    id="jurnal-notes"
                    placeholder="Alasan entry, strategi, kondisi market, dan lainnya..."
                    className="border-white/10 bg-[#080b18]"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Button
              type="submit"
              size="lg"
              disabled={isPending}
              className="w-full"
            >
              {isPending ? "Menyimpan..." : "Simpan Jurnal"}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
