"use server";

import { Jurnal } from "@/features/jurnal/action";
import { findJurnalEmbedding } from "./embedding";
import { createAI } from "./instance";
import { Type } from "@google/genai";

export async function generateChart(request: string) {
  const ai = createAI();

  const data = await findJurnalEmbedding(request, 0.5, 50);

  let contextData: string;

  if (!data || data.length === 0) {
    contextData =
      "Tidak ada jurnal trading yang relevan dengan permintaan pengguna.";
  } else {
    contextData = data
      .map((jurnal: Jurnal) => JSON.stringify(jurnal))
      .join("\n");
  }

  const contents = {
    role: "user",
    parts: [
      {
        text: `
<role>
Kamu adalah AI Trading Analyst dan spesialis visualisasi data di Miternal, platform jurnal trading cryptocurrency.
Tugasmu menganalisis data jurnal yang tersedia dan menghasilkan konfigurasi JSON untuk membuat grafik sesuai permintaan pengguna.
</role>

<input>
Permintaan pengguna: "${request}"
</input>

<instruction>
1. Analisis data:
   - Gunakan hanya data jurnal yang tersedia di dalam context.
   - Pilih jurnal yang relevan dengan permintaan pengguna.
   - Jangan mengarang data transaksi atau hasil perhitungan.

2. Pengelompokan data:
   - Jika pengguna meminta perbandingan performa antar aset, kelompokkan berdasarkan symbol.
   - Jika pengguna meminta perbandingan buy dan sell, kelompokkan berdasarkan type.
   - Jika pengguna meminta distribusi hasil trading, kelompokkan berdasarkan nilai result positif, negatif, dan nol.
   - Jika pengguna meminta tren waktu, kelompokkan berdasarkan tanggal atau bulan.
   - Jika pengguna meminta jumlah transaksi, hitung jumlah jurnal yang relevan.
   - Batasi hasil menjadi maksimal 10 kelompok agar grafik mudah dibaca.
   - Gabungkan kelompok kecil ke dalam "Lainnya" hanya jika penggabungan tersebut tidak mengubah makna analisis.

3. Perhitungan:
   - Hitung agregasi berdasarkan data yang benar-benar tersedia.
   - Untuk total profit/loss, gunakan kolom result dan jumlahkan nilainya.
   - Untuk jumlah transaksi, hitung jumlah catatan jurnal, bukan jumlah aset.
   - Untuk perbandingan aset, kelompokkan berdasarkan symbol.
   - Jangan menganggap setiap transaksi sell sebagai profit atau setiap transaksi buy sebagai loss.
   - Jangan menghitung profit/loss dari entry_price dan exit_price jika result sudah tersedia, kecuali pengguna secara khusus meminta perhitungan ulang dan datanya memadai.
   - Jika data tidak cukup untuk menjawab permintaan, kembalikan data kosong.

4. Pemilihan grafik:
   - Gunakan chartType "pie" untuk proporsi atau komposisi, misalnya distribusi hasil trading positif dan negatif.
   - Gunakan chartType "bar" untuk perbandingan aset, jumlah transaksi, hasil trading, atau tren waktu.
   - Setiap item data harus memiliki name dan value.
   - Gunakan nilai numerik yang sesuai dengan metrik yang diminta.
   - Untuk grafik profit/loss, pertahankan tanda positif dan negatif agar arah hasil tetap terlihat.
   - Jangan menggunakan nilai absolut jika hal itu menghilangkan informasi kerugian.

5. Jika permintaan pengguna tidak menyebutkan metrik secara jelas, pilih visualisasi yang paling relevan dengan data yang tersedia.
</instruction>

<context>
Tanggal saat ini: ${new Date().toISOString()}
Platform: Miternal
Data jurnal trading:
${contextData}
</context>

<constraints>
- Jawab hanya dengan objek JSON valid sesuai schema.
- Jangan menyertakan Markdown, code fence, atau teks tambahan.
- Jangan membuat data yang tidak tersedia.
- Jika data tidak cukup atau tidak relevan, kembalikan data kosong.
</constraints>
`,
      },
    ],
  };

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          chartType: {
            type: Type.STRING,
            enum: ["bar", "pie"],
            description: "Jenis grafik yang akan ditampilkan",
          },
          data: {
            type: Type.ARRAY,
            description: "Data hasil analisis untuk grafik",
            items: {
              type: Type.OBJECT,
              properties: {
                name: {
                  type: Type.STRING,
                  description: "Nama kategori atau kelompok data",
                },
                value: {
                  type: Type.NUMBER,
                  description: "Nilai numerik untuk grafik",
                },
              },
              required: ["name", "value"],
            },
          },
        },
        required: ["chartType", "data"],
      },
    },
  });

  if (!response.text) {
    throw new Error("Gagal menghasilkan konfigurasi grafik.");
  }

  try {
    const chartData = JSON.parse(response.text);

    return chartData;
  } catch {
    throw new Error("AI menghasilkan konfigurasi grafik yang tidak valid.");
  }
}
