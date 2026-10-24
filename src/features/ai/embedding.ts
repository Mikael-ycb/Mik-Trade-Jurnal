"use server";

import { createClient } from "@/lib/supabase/server";
import { createAI } from "./instance";

export async function generateEmbedding(contents: string) {
  const ai = createAI();

  const response = await ai.models.embedContent({
    model: "gemini-embedding-2",
    contents,
    config: {
      outputDimensionality: 768,
    },
  });

  const values = response.embeddings?.[0]?.values;

  if (!values?.length) {
    throw new Error("Gagal menghasilkan embedding.");
  }

  return values;
}

export async function findJurnalEmbedding(
  query: string,
  match_threshold = 0.3,
  match_count = 15,
) {
  const supabase = await createClient();
  const queryEmbedding = await generateEmbedding(query);

  const { data, error } = await supabase.rpc("match_jurnal", {
    query_embedding: queryEmbedding,
    match_threshold,
    match_count,
  });

  if (error) {
    console.error("Jurnal vector search error:", error);
    throw new Error(`Pencarian jurnal gagal: ${error.message}`);
  }

  return data;
}
