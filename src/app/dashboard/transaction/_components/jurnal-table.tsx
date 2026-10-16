"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { getJurnals } from "@/features/jurnal/action";

type JurnalResult = Awaited<ReturnType<typeof getJurnals>>;

const TABLE_HEADERS = [
  "#",
  "Date",
  "Symbol",
  "Type",
  "Entry Price",
  "Exit Price",
  "Quantity",
  "P/L (USDT)",
  "Notes",
  "Action",
];

export default function JurnalTable({
  jurnals,
  isLoading,
}: {
  jurnals?: JurnalResult;
  isLoading: boolean;
}) {
  return (
    <Card className="w-full gap-0 border border-white/[0.08] bg-[#0c1020] text-white">
      <CardHeader>
        <CardTitle>Trading Journal</CardTitle>
        <CardDescription className="text-slate-400">
          Review your crypto trading history.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/[0.08] hover:bg-transparent">
                {TABLE_HEADERS.map((header) => (
                  <TableHead
                    key={header}
                    className="whitespace-nowrap text-slate-400"
                  >
                    {header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableHead
                    colSpan={TABLE_HEADERS.length}
                    className="py-8 text-center text-slate-400"
                  >
                    Loading journals...
                  </TableHead>
                </TableRow>
              ) : jurnals?.data?.length ? (
                jurnals.data.map((jurnal, index) => (
                  <TableRow
                    key={jurnal.id}
                    className="border-white/[0.06] hover:bg-white/[0.025]"
                  >
                    <TableHead className="text-slate-500">
                      {1 - 1 + index + 1}
                    </TableHead>
                    <TableHead className="whitespace-nowrap text-slate-300">
                      {jurnal.date}
                    </TableHead>
                    <TableHead className="font-semibold text-white">
                      {jurnal.symbol}
                    </TableHead>
                    <TableHead
                      className={
                        jurnal.type === "buy"
                          ? "text-emerald-400"
                          : "text-rose-400"
                      }
                    >
                      {jurnal.type.toUpperCase()}
                    </TableHead>
                    <TableHead className="text-slate-300">
                      {jurnal.entry_price}
                    </TableHead>
                    <TableHead className="text-slate-300">
                      {jurnal.exit_price ?? "—"}
                    </TableHead>
                    <TableHead className="text-slate-300">
                      {jurnal.quantity}
                    </TableHead>
                    <TableHead
                      className={
                        jurnal.result === null
                          ? "text-slate-400"
                          : jurnal.result >= 0
                            ? "text-emerald-400"
                            : "text-rose-400"
                      }
                    >
                      {jurnal.result === null
                        ? "Open"
                        : `${jurnal.result > 0 ? "+" : ""}${jurnal.result} USDT`}
                    </TableHead>
                    <TableHead className="max-w-48 truncate text-slate-400">
                      {jurnal.notes || "—"}
                    </TableHead>
                    <TableHead className="text-slate-500">—</TableHead>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableHead
                    colSpan={TABLE_HEADERS.length}
                    className="py-8 text-center text-slate-400"
                  >
                    No trading journals found.
                  </TableHead>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
