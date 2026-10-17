"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ImagePlus,
  Images,
  LoaderCircle,
  Trash2,
  Upload,
  X,
} from "lucide-react";
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
  user_id: string;
  stage: Stage;
  storage_path: string;
  original_name: string;
  mime_type: string;
  size_bytes: number;
  created_at: string;
};

type GalleryImage = JournalImage & {
  signedUrl: string;
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
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

      const signedImages = await Promise.all(
        rows.map(async (image) => {
          const { data: signed, error: signedError } = await supabase.storage
            .from(BUCKET)
            .createSignedUrl(image.storage_path, 300);

          if (signedError || !signed?.signedUrl) {
            return null;
          }

          return { ...image, signedUrl: signed.signedUrl };
        }),
      );

      const validImages = signedImages.filter(
        (image): image is GalleryImage => image !== null,
      );

      setImages(validImages);
      setCount(rows.length);
    } catch (error) {
      console.error("Gagal memuat gambar jurnal:", error);
      toast.error("Gagal memuat gambar jurnal.");
    } finally {
      setLoading(false);
    }
  }, [supabase, jurnalId, stage]);

  // Muat jumlah gambar tanpa mengunduh file gambar.
  const loadCount = useCallback(async () => {
    const { count: total, error } = await supabase
      .from("jurnal_images")
      .select("id", { count: "exact", head: true })
      .eq("jurnal_id", jurnalId)
      .eq("stage", stage);

    if (error) {
      console.error("Gagal memuat jumlah gambar:", error);
      return;
    }

    setCount(total ?? 0);
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

        const signedImages = await Promise.all(
          rows.map(async (image) => {
            const { data: signed, error: signedError } = await supabase.storage
              .from(BUCKET)
              .createSignedUrl(image.storage_path, 300);

            if (signedError || !signed?.signedUrl) return null;

            return { ...image, signedUrl: signed.signedUrl };
          }),
        );

        if (cancelled) return;

        setImages(
          signedImages.filter((image): image is GalleryImage => image !== null),
        );
        setCount(rows.length);
      } catch (error) {
        if (!cancelled) {
          console.error("Gagal memuat gambar jurnal:", error);
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

    if (!files.length) return;

    const invalidFile = files.find(
      (file) => !ALLOWED_TYPES.includes(file.type) || file.size > MAX_SIZE,
    );

    if (invalidFile) {
      toast.error(
        `${invalidFile.name}: gunakan JPG, PNG, atau WebP maksimal 5 MB per gambar.`,
      );
      return;
    }

    setUploading(true);
    const uploadedPaths: string[] = [];

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error("Silakan login kembali.");
      }

      for (const file of files) {
        const extension = file.name.split(".").pop()?.toLowerCase();
        const path = `${user.id}/${jurnalId}/${crypto.randomUUID()}.${extension}`;

        const { error } = await supabase.storage
          .from(BUCKET)
          .upload(path, file, {
            contentType: file.type,
            upsert: false,
          });

        if (error) throw error;
        uploadedPaths.push(path);

        const { error: insertError } = await supabase
          .from("jurnal_images")
          .insert({
            jurnal_id: jurnalId,
            user_id: user.id,
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

      // Bersihkan file yang sudah diunggah jika proses gagal.
      if (uploadedPaths.length) {
        const { error: cleanupError } = await supabase.storage
          .from(BUCKET)
          .remove(uploadedPaths);

        if (cleanupError) {
          console.error("Gagal membersihkan file:", cleanupError);
        }

        // Metadata yang sempat berhasil dibuat juga perlu dibersihkan.
        await supabase
          .from("jurnal_images")
          .delete()
          .in("storage_path", uploadedPaths);
      }

      toast.error(
        error instanceof Error ? error.message : "Gagal mengunggah gambar.",
      );
      await loadImages();
    } finally {
      setUploading(false);
      await loadCount();
    }
  };

  const handleDelete = async (image: GalleryImage) => {
    const confirmed = window.confirm(`Hapus gambar "${image.original_name}"?`);

    if (!confirmed) return;

    setDeletingId(image.id);

    try {
      const { error: storageError } = await supabase.storage
        .from(BUCKET)
        .remove([image.storage_path]);

      if (storageError) throw storageError;

      const { error: dbError } = await supabase
        .from("jurnal_images")
        .delete()
        .eq("id", image.id);

      if (dbError) {
        // File sudah terhapus. Jangan menyembunyikan kegagalan metadata.
        throw dbError;
      }

      toast.success("Gambar berhasil dihapus.");
      await loadImages();
      await loadCount();
    } catch (error) {
      console.error("Gagal menghapus gambar:", error);
      toast.error(
        "Gagal menghapus gambar. Periksa koneksi dan kebijakan akses.",
      );
      await loadImages();
    } finally {
      setDeletingId(null);
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
            {count} gambar tersimpan. Format JPG, PNG, atau WebP, maksimal 5 MB
            per gambar.
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
                  href={image.signedUrl}
                  target="_blank"
                  rel="noreferrer"
                  title="Buka gambar penuh"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.signedUrl}
                    alt={image.original_name}
                    className="h-44 w-full object-contain"
                  />
                </a>

                <div className="flex items-center justify-between gap-2 p-3">
                  <span className="min-w-0 truncate text-xs text-slate-300">
                    {image.original_name}
                  </span>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Hapus ${image.original_name}`}
                    disabled={deletingId === image.id}
                    onClick={() => void handleDelete(image)}
                    className="shrink-0 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300"
                  >
                    {deletingId === image.id ? (
                      <LoaderCircle className="size-4 animate-spin" />
                    ) : (
                      <Trash2 className="size-4" />
                    )}
                  </Button>
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
