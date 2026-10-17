"use client";

import { Dispatch, SetStateAction } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { deleteJurnal, Jurnal } from "@/features/jurnal/action";

type SelectedJurnal = {
  data: Jurnal;
  action: "update" | "delete";
} | null;

type DeleteJurnalDialogProps = {
  selectedJurnal: SelectedJurnal;
  setSelectedJurnal: Dispatch<SetStateAction<SelectedJurnal>>;
  refetch: () => void;
};

export default function DeleteJurnalDialog({
  selectedJurnal,
  setSelectedJurnal,
  refetch,
}: DeleteJurnalDialogProps) {
  const { mutate, isPending } = useMutation({
    mutationFn: (id: string) => deleteJurnal(id),

    onSuccess: () => {
      setSelectedJurnal(null);
      refetch();
      toast.success("Jurnal trading berhasil dihapus");
    },

    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Gagal menghapus jurnal trading",
      );
    },
  });

  const isOpen = selectedJurnal !== null && selectedJurnal.action === "delete";

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && !isPending) {
          setSelectedJurnal(null);
        }
      }}
    >
      <DialogContent className="gap-4 border-white/10 bg-[#0c1020] text-white">
        <DialogHeader className="gap-3">
          <DialogTitle>Hapus Jurnal Trading?</DialogTitle>

          <DialogDescription className="text-slate-400">
            Jurnal ini akan dihapus secara permanen dari database. Tindakan ini
            tidak dapat dibatalkan.
            {selectedJurnal && (
              <span className="mt-2 block text-white">
                Symbol: {selectedJurnal.data.symbol}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setSelectedJurnal(null)}
            disabled={isPending}
          >
            Batal
          </Button>

          <Button
            type="button"
            variant="destructive"
            disabled={isPending || !selectedJurnal}
            onClick={() => {
              if (selectedJurnal) {
                mutate(selectedJurnal.data.id);
              }
            }}
          >
            {isPending ? "Menghapus..." : "Hapus Jurnal"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
