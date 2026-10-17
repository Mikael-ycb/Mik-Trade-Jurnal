"use client";

import { createClient } from "@/lib/supabase/client";

const BUCKET = "jurnal-images";
const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function uploadJurnalImages(jurnalId: string, files: File[]) {
  if (files.length === 0) return;

  const invalidFile = files.find(
    (file) =>
      !ALLOWED_TYPES.includes(file.type) ||
      file.size === 0 ||
      file.size > MAX_SIZE,
  );

  if (invalidFile) {
    throw new Error(
      `${invalidFile.name}: gunakan JPG, PNG, atau WebP maksimal 5 MB.`,
    );
  }

  const supabase = createClient();

  for (const file of files) {
    const extension =
      file.type === "image/jpeg" ? "jpg" : file.type.split("/")[1];

    const path = `${jurnalId}/${crypto.randomUUID()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      throw new Error(`Gagal mengunggah ${file.name}: ${uploadError.message}`);
    }

    const { error: metadataError } = await supabase
      .from("jurnal_images")
      .insert({
        jurnal_id: jurnalId,
        user_id: null,
        stage: "before",
        storage_path: path,
        original_name: file.name,
        mime_type: file.type,
        size_bytes: file.size,
      });

    if (metadataError) {
      throw new Error(
        `File ${file.name} sudah terunggah, tetapi metadata gagal disimpan: ${metadataError.message}`,
      );
    }
  }
}
