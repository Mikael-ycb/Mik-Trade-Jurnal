"use server";

import { createAI } from "./instance";
import { Content } from "@google/genai";
import { z } from "zod";

const jurnalImageSchema = z.object({
  symbol: z.string(),
  type: z.enum(["buy", "sell"]),
  entry_price: z.number().positive(),
  exit_price: z.number().positive().nullable(),
  quantity: z.number().positive(),
  result: z.number().nullable(),
  notes: z.string().nullable(),
  date: z.string(),
});

export async function extractJurnalImageData(formData: FormData) {
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    throw new Error("Tidak ada file gambar yang diunggah.");
  }

  const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];

  if (!allowedMimeTypes.includes(file.type)) {
    throw new Error("Format gambar harus JPG, PNG, atau WebP.");
  }

  const maxSize = 5 * 1024 * 1024;

  if (file.size > maxSize) {
    throw new Error("Ukuran gambar maksimal 5 MB.");
  }

  const mimeType = file.type;
  const base64Data = Buffer.from(await file.arrayBuffer()).toString("base64");

  const ai = createAI();

  const contents: Content[] = [
    {
      role: "user",
      parts: [
        {
          inlineData: {
            mimeType,
            data: base64Data,
          },
        },
        {
          text: `
<role>
Kamu adalah asisten AI Miternal yang membantu mengekstrak informasi trading cryptocurrency dari gambar.
</role>

<instruction>
Analisis gambar yang diberikan dan ekstrak informasi trading yang benar-benar terlihat.

Kembalikan objek JSON dengan field berikut:
- "symbol": simbol aset cryptocurrency yang terlihat, misalnya BTCUSDT atau ETHUSDT.
- "type": jenis transaksi, "buy" atau "sell".
- "entry_price": harga entry jika terlihat dengan jelas.
- "exit_price": harga exit jika terlihat, atau null jika tidak tersedia.
- "quantity": jumlah aset jika terlihat dengan jelas.
- "result": profit atau loss jika nilai hasilnya terlihat dengan jelas, atau null jika tidak tersedia.
- "notes": catatan singkat mengenai informasi relevan pada gambar, atau null jika tidak ada.
- "date": tanggal transaksi dalam format YYYY-MM-DD jika terlihat jelas.

Aturan:
- Jangan mengarang informasi yang tidak terlihat.
- Jangan menganggap warna candle atau arah chart sebagai bukti bahwa pengguna telah melakukan buy atau sell.
- Jika jenis transaksi tidak dapat dipastikan, jangan menebaknya.
- Jika harga entry atau jumlah aset tidak tersedia, jangan mengarang nilainya.
- Jika informasi wajib tidak dapat diidentifikasi dengan yakin, jelaskan bahwa gambar belum cukup jelas untuk membuat jurnal yang akurat. Jangan mengisi nilai perkiraan.
- Jangan menganggap harga saat ini sebagai exit price.
- Jangan menyimpulkan profit atau loss hanya dari pergerakan chart.
- Gunakan tanggal hari ini hanya sebagai konteks, bukan sebagai bukti tanggal transaksi.

Tanggal saat ini:
${new Date().toISOString()}
</instruction>
          `,
        },
      ],
    },
  ];

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: {
          symbol: { type: "STRING" },
          type: {
            type: "STRING",
            enum: ["buy", "sell"],
          },
          entry_price: { type: "NUMBER" },
          exit_price: {
            type: "NUMBER",
            nullable: true,
          },
          quantity: { type: "NUMBER" },
          result: {
            type: "NUMBER",
            nullable: true,
          },
          notes: {
            type: "STRING",
            nullable: true,
          },
          date: { type: "STRING" },
        },
        required: [
          "symbol",
          "type",
          "entry_price",
          "exit_price",
          "quantity",
          "result",
          "notes",
          "date",
        ],
      },
    },
  });

  if (!response.text) {
    throw new Error("AI gagal mengekstrak data dari gambar.");
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(response.text);
  } catch {
    throw new Error("AI menghasilkan JSON yang tidak valid.");
  }

  return jurnalImageSchema.parse(parsed);
}
