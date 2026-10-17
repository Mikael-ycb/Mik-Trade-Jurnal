"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ImagePlus, Images, LoaderCircle, Upload, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createClient } from "@/lib/supabase/client";

type Stage = "before" | "after";

type JournalImage = {
  id: string;
  jurnal_id: string;
  user_id: string | null;
  stage: Stage;
  storage_path: string;
  original_name: string;
  mime_type: string;
  size_bytes: number;
  created_at: string;
};

type GalleryImage = JournalImage & {
  publicUrl: string;
};

type Props = {
  jurnalId: string;
  stage: Stage;
};

const BUCKET = "jurnal-images";
const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function JurnalImageGallery({ jurnalId, stage }: Props) {
  const supabase = useMemo(() => createClient(), []);

  const [images, setImages] = useState<GalleryImage[]>([]);
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const title = stage === "before" ? "Analisa Teknikal" : "Result Trading";

  const loadImages = useCallback(async () => {
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("jurnal_images")
        .select("*")
        .eq("jurnal_id", jurnalId)
        .eq("stage", stage)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const rows = (data ?? []) as JournalImage[];

      const publicImages = rows.map((image) => {
        const { data: publicData } = supabase.storage
          .from(BUCKET)
          .getPublicUrl(image.storage_path);

        return {
          ...image,
          publicUrl: publicData.publicUrl,
        };
      });

      setImages(publicImages);
      setCount(rows.length);
    } catch (error) {
      console.error("Gagal memuat gambar:", error);
      toast.error("Gagal memuat gambar jurnal.");
    } finally {
      setLoading(false);
    }
  }, [supabase, jurnalId, stage]);

  useEffect(() => {
    let cancelled = false;

    const fetchCount = async () => {
      const { count: total, error } = await supabase
        .from("jurnal_images")
        .select("id", { count: "exact", head: true })
        .eq("jurnal_id", jurnalId)
        .eq("stage", stage);

      if (cancelled) return;

      if (error) {
        console.error("Gagal memuat jumlah gambar:", error);
        return;
      }

      setCount(total ?? 0);
    };

    void fetchCount();

    return () => {
      cancelled = true;
    };
  }, [supabase, jurnalId, stage]);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    const fetchImages = async () => {
      setLoading(true);

      try {
        const { data, error } = await supabase
          .from("jurnal_images")
          .select("*")
          .eq("jurnal_id", jurnalId)
          .eq("stage", stage)
          .order("created_at", { ascending: false });

        if (error) throw error;
        if (cancelled) return;

        const rows = (data ?? []) as JournalImage[];

        const result = rows.map((image) => {
          const { data: publicData } = supabase.storage
            .from(BUCKET)
            .getPublicUrl(image.storage_path);

          return {
            ...image,
            publicUrl: publicData.publicUrl,
          };
        });

        if (!cancelled) {
          setImages(result);
          setCount(rows.length);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Gagal memuat gambar:", error);
          toast.error("Gagal memuat gambar jurnal.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void fetchImages();

    return () => {
      cancelled = true;
    };
  }, [open, supabase, jurnalId, stage]);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const files = Array.from(input.files ?? []);
    input.value = "";

    if (files.length === 0) return;

    const invalidFile = files.find(
      (file) =>
        !ALLOWED_TYPES.includes(file.type) ||
        file.size > MAX_SIZE ||
        file.size === 0,
    );

    if (invalidFile) {
      toast.error(
        `${invalidFile.name}: gunakan JPG, PNG, atau WebP maksimal 5 MB.`,
      );
      return;
    }

    setUploading(true);
    const uploadedPaths: string[] = [];

    try {
      for (const file of files) {
        const extension = file.type.split("/")[1].replace("jpeg", "jpg");
        const path = `${jurnalId}/${crypto.randomUUID()}.${extension}`;

        const { error: uploadError } = await supabase.storage
          .from(BUCKET)
          .upload(path, file, {
            contentType: file.type,
            upsert: false,
          });

        if (uploadError) throw uploadError;

        uploadedPaths.push(path);

        const { error: insertError } = await supabase
          .from("jurnal_images")
          .insert({
            jurnal_id: jurnalId,
            user_id: null,
            stage,
            storage_path: path,
            original_name: file.name,
            mime_type: file.type,
            size_bytes: file.size,
          });

        if (insertError) throw insertError;
      }

      toast.success(`${files.length} gambar berhasil diunggah.`);
      await loadImages();
    } catch (error) {
      console.error("Gagal mengunggah gambar:", error);

      toast.error(
        error instanceof Error ? error.message : "Gagal mengunggah gambar.",
      );

      // Jangan menghapus file otomatis di sini:
      // upload mungkin berhasil sementara insert metadata gagal.
      // File tersebut dapat dibersihkan dari dashboard Supabase.
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="sm"
            aria-label={`${title}, ${count} gambar`}
            className="h-8 gap-1.5 border border-white/10 text-slate-300 hover:bg-white/5 hover:text-white"
          />
        }
      >
        <Images className="size-4" />
        <span>{count}</span>
      </DialogTrigger>

      <DialogContent className="max-h-[85vh] overflow-y-auto border-white/10 bg-[#0c1020] text-white sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="text-slate-400">
            {count} gambar tersimpan. JPG, PNG, atau WebP, maksimal 5 MB per
            gambar.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-fuchsia-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-fuchsia-500">
            {uploading ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <Upload className="size-4" />
            )}

            {uploading ? "Mengunggah..." : "Upload gambar"}

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              disabled={uploading}
              onChange={handleUpload}
              className="sr-only"
            />
          </label>

          <span className="text-xs text-slate-500">
            Bisa memilih beberapa gambar sekaligus
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <LoaderCircle className="size-6 animate-spin text-fuchsia-400" />
          </div>
        ) : images.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-white/10 py-12 text-center">
            <ImagePlus className="size-8 text-slate-500" />
            <p className="text-sm text-slate-400">
              Belum ada gambar untuk tahap ini.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((image) => (
              <div
                key={image.id}
                className="overflow-hidden rounded-xl border border-white/10 bg-[#080b16]"
              >
                <a
                  href={image.publicUrl}
                  target="_blank"
                  rel="noreferrer"
                  title="Buka gambar penuh"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.publicUrl}
                    alt={image.original_name}
                    className="h-44 w-full object-contain"
                  />
                </a>

                <div className="p-3">
                  <span className="block truncate text-xs text-slate-300">
                    {image.original_name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            className="border-white/10 text-slate-300"
          >
            <X className="mr-2 size-4" />
            Tutup
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
