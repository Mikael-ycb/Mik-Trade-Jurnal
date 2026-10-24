"use server";

import { Conversation } from "@/app/types/ai";
import { createAI } from "./instance";
import { findEmbedding } from "./embedding";
import {
  Content,
  FunctionCall,
  HarmBlockThreshold,
  HarmCategory,
  Part,
} from "@google/genai";
import { getTransactionDeclaration } from "./function-transaction";

export async function handleChat(
  conversation: Conversation[],
  isThinking: boolean,
) {
  const ai = createAI();
  const response = await ai.models.generateContent({
    model: "gemini-3.7-flash",
    contents: [...conversation],
    config: {
      thinkingConfig: {
        includeThoughts: isThinking,
      },
    },
  });

  const result = {
    thought: "",
    answer: "",
  };

  if (isThinking) {
    const parts = response.candidates?.[0]?.content?.parts;
    if (!parts) {
      return;
    }

    for (const part of parts) {
      if (!part.text) {
        continue;
      } else if (part.thought) {
        result.thought += part.text;
      } else {
        result.answer += part.text;
      }
    }
  } else {
    result.answer = `${response.text}`;
  }

  return result;
}

async function generalChat(conversation: Content[], isThinking?: boolean) {
  const ai = createAI();
  const response = await ai.models.generateContentStream({
    model: "gemini-2.5-flash",
    contents: [...conversation],
    config: {
      thinkingConfig: {
        includeThoughts: isThinking,
        // thinkingLevel: isThinking ? ThinkingLevel.HIGH : ThinkingLevel.MINIMAL,
        // thinkingBudget: isThinking ? -1 : 0,
      },
      tools: [
        {
          googleSearch: {},
          urlContext: {},
        },
      ],

      systemInstruction: `

      [Role]
Kamu bernama Mik, asisten AI di Miternal, sebuah platform jurnal trading cryptocurrency. Kamu membantu pengguna memahami aktivitas trading, mengevaluasi strategi, menganalisis hasil trading, dan meningkatkan disiplin dalam mengambil keputusan.

[Context]
Miternal ditujukan untuk trader crypto, termasuk pemula. Pengguna dapat bertanya tentang analisis teknikal, manajemen risiko, psikologi trading, evaluasi profit/loss, dan pengelolaan jurnal trading.

[Instruction]
- Jawab pertanyaan yang berkaitan dengan cryptocurrency, trading, analisis pasar, manajemen risiko, dan evaluasi jurnal trading.
- Jelaskan konsep trading secara edukatif, terstruktur, dan mudah dipahami.
- Jika relevan, gunakan analogi kehidupan sehari-hari untuk menjelaskan konsep yang sulit.
- Bedakan fakta, asumsi, dan opini.
- Jangan menjanjikan profit atau menyatakan bahwa suatu strategi pasti berhasil.
- Jangan mengarang harga, indikator, data pasar, atau informasi jurnal pengguna.
- Jika data pasar terbaru diperlukan, gunakan hasil pencarian yang tersedia dan jelaskan waktu serta keterbatasan datanya.
- Jika pengguna memberikan chart atau indikator, analisis hanya informasi yang benar-benar terlihat atau tersedia.

[Trading Journal]
- Jika pengguna bertanya tentang jurnal trading miliknya, gunakan hanya data jurnal yang benar-benar tersedia melalui konteks atau fitur yang diberikan.
- Jangan mengarang riwayat transaksi, harga entry/exit, jumlah aset, profit/loss, atau hasil perhitungan.
- Jika data yang dibutuhkan tidak tersedia, jelaskan data apa yang perlu diberikan.
- Bantu pengguna mengevaluasi win rate, profit/loss, konsistensi, risk/reward, dan pola kesalahan apabila data yang diperlukan tersedia.
- Bedakan hasil trading masa lalu dari kemungkinan hasil trading di masa depan.

[Risk Management]
- Tekankan pentingnya menentukan risiko sebelum entry, menggunakan stop-loss sesuai strategi, memperhatikan ukuran posisi, dan menghindari leverage berlebihan.
- Ingatkan pengguna tentang risiko volatilitas, slippage, likuiditas rendah, dan potensi kehilangan modal.
- Jangan mendorong revenge trading, FOMO, atau keputusan impulsif.
- Jangan menyajikan analisis sebagai jaminan atau kepastian pergerakan harga.

[Constraints]
- Gunakan bahasa Indonesia yang santai, sopan, jelas, dan profesional.
- Jangan membuat asumsi tentang modal, pengalaman, toleransi risiko, atau posisi pengguna jika tidak disebutkan.
- Jika informasi penting belum tersedia, ajukan pertanyaan klarifikasi yang relevan.
- Jika pertanyaan berada di luar konteks trading, cryptocurrency, dan pengelolaan jurnal trading, jelaskan secara singkat bahwa kamu berfokus pada topik tersebut.
- Jika memberikan saran trading atau manajemen risiko, akhiri jawaban dengan:
  "Catatan: Informasi ini bersifat edukasi, bukan jaminan hasil trading. Keputusan dan risiko transaksi tetap menjadi tanggung jawab pengguna."

[Workflow]
1. Pahami pertanyaan dan tujuan pengguna.
2. Identifikasi data yang tersedia dan data yang masih dibutuhkan.
3. Analisis masalah menggunakan konsep trading yang relevan.
4. Periksa kembali logika, perhitungan, dan risiko.
5. Berikan jawaban yang jelas dan dapat diterapkan.

[Response Format]
Sesuaikan panjang jawaban dengan kompleksitas pertanyaan.
- Untuk pertanyaan sederhana, jawab langsung.
- Untuk analisis, gunakan subjudul dan bullet points bila membantu.
- Untuk perhitungan, tampilkan rumus dan langkah perhitungan yang relevan.
- Untuk evaluasi trading, jelaskan temuan, keterbatasan data, dan kemungkinan tindakan perbaikan.
- Hindari tabel jika daftar sederhana sudah cukup.
`,
      // sampling params
      temperature: 0.2,
      topK: 5,
      topP: 0.1,
      //output control
      maxOutputTokens: 2048,
      stopSequences: ["\n\n\n", "###", "User:", "Pengguna:"],
      //repetition penalties
      // presencePenalty:1.5,
      // frequencyPenalty:1.5,
    },
  });

  return response;
}

export async function* handleChatStreaming(
  conversation: Content[],
  isThinking: boolean,
  mode: "general" | "personal",
) {
  if (mode === "general") {
    const response = await generalChat(conversation, isThinking);
    if (isThinking) {
      for await (const chunk of response) {
        const parts = chunk.candidates?.[0]?.content?.parts;
        if (parts) {
          for (const part of parts) {
            if (!part.text) {
              continue;
            } else if (part.thought) {
              return `[thounght]${part.text}`;
            } else {
              yield part.text;
            }
          }
        }
      }
    } else {
      for await (const chunk of response) {
        if (chunk.text) {
          yield chunk.text;
        }
      }
    }
  } else {
    const query = conversation[conversation.length - 1].parts?.[0].text;
    const historyChat = conversation.slice(0, -1);

    const ai = createAI();

    const contents: Content[] = [
      ...historyChat,
      {
        role: "user",
        parts: [
          {
            text: `
<role>
  You are an AI Financial Advisor. You are helping the user analyze their finance data.
</role>
<input>
  User Question: "${query}"
</input>
<instruction>
- Extract the transaction details from the input.
- Answer the user question ONLY based on the relevant transaction data (if there's need data).
- If there are calculations (total spending, average, etc), calculate them accurately based on data.
- Provide the answer in a neat, professional, yet eazy-to-understand markdown format.
- If there is no relevant data at all, state that data is not avaible in the history.
- If user question is general and not need a data, response generally.
- The final response if there are no more functions being called is as simple as possible.
</instruction>
<context>
  Current Date : ${new Date().toISOString()}
</context>
<constraints>
- Answer in relaxed, polite but professional in Indonesia.
- Don't make assumptions about data from users if they don't mention it.
- If there are quetions outside the context related to finance, you most only answer questions related to finance.
- Don't answer in table format instead of markdown.
</constraints>
`,
          },
        ],
      },
    ];

    let running = true;

    while (running) {
      const response = await ai.models.generateContentStream({
        model: "gemini-2.5-flash",
        contents,
        config: {
          tools: [
            {
              // googleSearch: {},
              // urlContext: {},
              functionDeclarations: [getTransactionDeclaration],
            },
          ],
          // toolConfig: {
          //   includeServerSideToolInvocations: true,
          // },
          thinkingConfig: {
            includeThoughts: isThinking,
          },
          safetySettings: [
            {
              category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
              threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
            },
          ],
        },
      });

      const modelParts: Part[] = [];
      const functionCalls: FunctionCall[] = [];

      for await (const chunk of response) {
        const parts = chunk.candidates?.[0]?.content?.parts || [];
        if (parts) {
          for (const part of parts) {
            modelParts.push(part);
            if (part.functionCall) {
              functionCalls.push(part.functionCall);
            } else if (part.text) {
              if (part.thought) {
                if (isThinking) yield `[thounght]${part.text}`;
              } else {
                yield part.text;
              }
            }
          }
        }
      }

      if (functionCalls.length > 0) {
        contents.push({ role: "model", parts: modelParts });

        const functionResponseParts = await Promise.all(
          functionCalls.map(async (functionCall) => {
            const { name, args, id } = functionCall;
            if (!args) {
              throw new Error("No arguments provided for Action");
            }

            let resultData = {};

            switch (name) {
              case "get_transaction":
                const dataFind = await findEmbedding(
                  JSON.stringify(args),
                  0.3,
                  100,
                );
                resultData = dataFind || [];
                break;

              default:
                throw new Error("Unknow function call");
            }

            return {
              functionResponse: {
                name,
                response: { result: resultData },
                id,
              },
            };
          }),
        );
        contents.push({
          role: "user",
          parts: functionResponseParts,
        });
      } else {
        running = false;
      }
    }
  }
}
