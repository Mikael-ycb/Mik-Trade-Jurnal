import { FunctionDeclaration, Type } from "@google/genai";

const jurnalProperties = {
  id: {
    type: Type.STRING,
    description: "ID unik dari jurnal trading",
  },
  symbol: {
    type: Type.STRING,
    description:
      "Simbol aset cryptocurrency yang diperdagangkan, misalnya BTC, ETH, atau SOL",
  },
  type: {
    type: Type.STRING,
    enum: ["buy", "sell"],
    description: "Jenis transaksi trading, yaitu buy atau sell",
  },
  entry_price: {
    type: Type.NUMBER,
    description: "Harga masuk posisi (entry price)",
  },
  exit_price: {
    type: Type.NUMBER,
    description:
      "Harga keluar posisi (exit price), dapat kosong jika belum tersedia",
  },
  quantity: {
    type: Type.NUMBER,
    description: "Jumlah aset cryptocurrency yang diperdagangkan",
  },
  result: {
    type: Type.NUMBER,
    description:
      "Hasil trading berupa profit atau loss, dapat kosong jika belum tersedia",
  },
  notes: {
    type: Type.STRING,
    description:
      "Catatan trading, termasuk analisis, alasan entry, dan evaluasi transaksi",
  },
  date: {
    type: Type.STRING,
    description: 'Tanggal trading dengan format "YYYY-MM-DD"',
  },
};

export const getJurnalDeclaration: FunctionDeclaration = {
  name: "get_jurnal",
  description:
    "Mengambil data jurnal trading cryptocurrency pengguna berdasarkan kriteria yang diberikan.",
  parameters: {
    type: Type.OBJECT,
    properties: jurnalProperties,
  },
};

export const createJurnalDeclaration: FunctionDeclaration = {
  name: "create_jurnal",
  description:
    "Membuat catatan jurnal trading cryptocurrency baru berdasarkan informasi yang diberikan pengguna.",
  parameters: {
    type: Type.OBJECT,
    properties: jurnalProperties,
    required: ["symbol", "type", "entry_price", "quantity", "date"],
  },
};

export const deleteJurnalDeclaration: FunctionDeclaration = {
  name: "delete_jurnal",
  description:
    "Menghapus catatan jurnal trading berdasarkan ID jurnal yang ditentukan.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      id: jurnalProperties.id,
    },
    required: ["id"],
  },
};

export const updateJurnalDeclaration: FunctionDeclaration = {
  name: "update_jurnal",
  description:
    "Memperbarui data jurnal trading cryptocurrency yang sudah ada berdasarkan ID jurnal.",
  parameters: {
    type: Type.OBJECT,
    properties: jurnalProperties,
    required: ["id"],
  },
};
