"use server";

import { createClient } from "@/lib/supabase/server";
// import { generateEmbedding } from "../ai/embedding";

export type Jurnal = {
  id: string;
  user_id: string | null;
  symbol: string;
  type: "buy" | "sell";
  entry_price: number;
  exit_price: number | null;
  quantity: number;
  result: number | null;
  notes: string | null;
  date: string;
  created_at: string;
};

export type JurnalInput = Omit<Jurnal, "id" | "user_id" | "created_at">;

export async function getBalanceSummary() {
  const supabase = await createClient();

  const { data, error } = await supabase.from("jurnal").select("result, date");

  if (error) throw new Error(error.message);

  const results = data ?? [];

  const totalProfit = results.reduce(
    (total, jurnal) => total + (jurnal.result ?? 0),
    0,
  );

  const winningTrades = results.filter(
    (jurnal) => (jurnal.result ?? 0) > 0,
  ).length;

  const losingTrades = results.filter(
    (jurnal) => (jurnal.result ?? 0) < 0,
  ).length;

  // Kelompokkan hasil trading berdasarkan tanggal.
  const dailyResults = new Map<string, number>();

  for (const jurnal of results) {
    if (jurnal.result === null) continue;

    dailyResults.set(
      jurnal.date,
      (dailyResults.get(jurnal.date) ?? 0) + jurnal.result,
    );
  }

  // Urutkan tanggal dari yang paling lama ke terbaru,
  // kemudian hitung akumulasi profit/loss.
  let cumulativeProfit = 0;

  const profitHistory = Array.from(dailyResults.entries())
    .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
    .map(([date, dailyProfit]) => {
      cumulativeProfit += dailyProfit;

      return {
        date,
        profit: cumulativeProfit,
      };
    });

  return {
    totalProfit,
    totalTrades: results.length,
    winningTrades,
    losingTrades,
    profitHistory,
  };
}

export async function getJurnals(params?: {
  limit?: number;
  page?: number;
  search?: string;
}) {
  const { limit = 10, page = 1, search } = params ?? {};
  const supabase = await createClient();

  let query = supabase
    .from("jurnal")
    .select(
      "id, user_id, symbol, type, entry_price, exit_price, quantity, result, notes, date, created_at",
      { count: "exact" },
    )
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });

  if (search?.trim()) {
    query = query.ilike("symbol", `%${search.trim()}%`);
  }

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await query.range(from, to);

  if (error) throw new Error(error.message);

  const totalData = count ?? 0;

  return {
    data: (data ?? []) as Jurnal[],
    totalData,
    totalPages: Math.ceil(totalData / limit),
  };
}

// ========================================
// AI EMBEDDING — BELUM DIGUNAKAN
// Aktifkan kembali ketika fitur AI dibuat.
// ========================================

// async function handleEmbedding(jurnal: JurnalInput) {
//   const embeddingText = JSON.stringify({
//     symbol: jurnal.symbol,
//     type: jurnal.type,
//     entry_price: jurnal.entry_price,
//     exit_price: jurnal.exit_price,
//     quantity: jurnal.quantity,
//     result: jurnal.result,
//     notes: jurnal.notes,
//     date: jurnal.date,
//   });

//   try {
//     return await generateEmbedding(embeddingText);
//   } catch {
//     throw new Error("Gagal membuat embedding jurnal trading.");
//   }
// }

export async function createJurnal(jurnal: JurnalInput) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("jurnal")
    .insert({
      ...jurnal,
      // embedding: await handleEmbedding(jurnal),
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
}

export async function updateJurnal(id: string, jurnal: JurnalInput) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("jurnal")
    .update({
      ...jurnal,
      // embedding: await handleEmbedding(jurnal),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
}

export async function deleteJurnal(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("jurnal").delete().eq("id", id);

  if (error) throw new Error(error.message);

  return { success: true };
}
