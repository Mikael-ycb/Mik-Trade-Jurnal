"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { updateJurnal } from "@/features/jurnal/action";
import type { SelectedJurnal } from "./jurnal-table";

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

type UpdateJurnalDialogProps = {
  selectedJurnal: SelectedJurnal;
  setSelectedJurnal: React.Dispatch<React.SetStateAction<SelectedJurnal>>;
  refetch: () => void;
};

export default function UpdateJurnalDialog({
  selectedJurnal,
  setSelectedJurnal,
  refetch,
}: UpdateJurnalDialogProps) {
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

  const isOpen = selectedJurnal !== null && selectedJurnal.action === "update";

  useEffect(() => {
    if (isOpen && selectedJurnal) {
      const jurnal = selectedJurnal.data;

      form.reset({
        symbol: jurnal.symbol,
        type: jurnal.type,
        entry_price: String(jurnal.entry_price),
        exit_price: jurnal.exit_price === null ? "" : String(jurnal.exit_price),
        quantity: String(jurnal.quantity),
        result: jurnal.result === null ? "" : String(jurnal.result),
        date: jurnal.date,
        notes: jurnal.notes ?? "",
      });
    }
  }, [isOpen, selectedJurnal, form]);

  const { mutate, isPending } = useMutation({
    mutationFn: (data: FormValues) => {
      if (!selectedJurnal) {
        throw new Error("Jurnal yang akan diperbarui tidak ditemukan");
      }

      return updateJurnal(selectedJurnal.data.id, {
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
      setSelectedJurnal(null);
      refetch();
      toast.success("Jurnal trading berhasil diperbarui");
    },

    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Gagal memperbarui jurnal trading",
      );
    },
  });

  const onSubmit = (data: FormValues) => {
    mutate(data);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && !isPending) {
          setSelectedJurnal(null);
        }
      }}
    >
      <DialogContent className="max-h-[90vh] gap-4 overflow-y-auto border-white/10 bg-[#0c1020] text-white">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader className="gap-2">
            <DialogTitle>Update Trading Journal</DialogTitle>
            <DialogDescription className="text-slate-400">
              Perbarui detail transaksi trading kamu.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="mt-5 gap-4">
            <Controller
              control={form.control}
              name="symbol"
              render={({ field, fieldState }) => (
                <Field className="gap-1">
                  <FieldLabel htmlFor="update-symbol">Symbol</FieldLabel>
                  <Input
                    {...field}
                    id="update-symbol"
                    placeholder="BTCUSDT"
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
                  <FieldLabel htmlFor="update-type">Tipe Transaksi</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      id="update-type"
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
                  <FieldLabel htmlFor="update-entry">
                    Entry Price (USDT)
                  </FieldLabel>
                  <Input
                    {...field}
                    id="update-entry"
                    type="number"
                    min="0"
                    step="any"
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
                  <FieldLabel htmlFor="update-exit">
                    Exit Price (USDT)
                  </FieldLabel>
                  <Input
                    {...field}
                    id="update-exit"
                    type="number"
                    min="0"
                    step="any"
                    placeholder="Kosongkan jika posisi terbuka"
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
                  <FieldLabel htmlFor="update-quantity">Quantity</FieldLabel>
                  <Input
                    {...field}
                    id="update-quantity"
                    type="number"
                    min="0"
                    step="any"
                    placeholder="Jumlah aset"
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
                  <FieldLabel htmlFor="update-result">
                    Profit / Loss (USDT)
                  </FieldLabel>
                  <Input
                    {...field}
                    id="update-result"
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
                  <FieldLabel htmlFor="update-date">Tanggal</FieldLabel>
                  <DatePicker
                    id="update-date"
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
                  <FieldLabel htmlFor="update-notes">Catatan</FieldLabel>
                  <Textarea
                    {...field}
                    id="update-notes"
                    placeholder="Catatan strategi dan kondisi market"
                    className="border-white/10 bg-[#080b18]"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <DialogFooter className="mt-5">
            <Button
              type="button"
              variant="ghost"
              disabled={isPending}
              onClick={() => setSelectedJurnal(null)}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
