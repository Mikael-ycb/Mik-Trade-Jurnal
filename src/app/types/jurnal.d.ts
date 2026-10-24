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
