"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { getJurnals } from "@/features/jurnal/action";
import { PencilIcon, SearchIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Dispatch, SetStateAction } from "react";
import JurnalImageGallery from "./jurnal-image-gallery";

type JurnalResult = Awaited<ReturnType<typeof getJurnals>>;

type JurnalRow = NonNullable<JurnalResult>["data"][number];

export type SelectedJurnal = {
  data: JurnalRow;
  action: "update" | "delete";
} | null;

const TABLE_HEADERS = [
  "#",
  "Date",
  "Symbol",
  "Type",
  "Analisa Teknikal",
  "Entry Price",
  "Exit Price",
  "Quantity",
  "Result Image",
  "P/L (USDT)",
  "Notes",
  "Action",
];

export default function JurnalTable({
  jurnals,
  isLoading,
  page,
  limit,
  search,
  setPage,
  setLimit,
  setSearch,
  refetch,
  setSelectedJurnal,
}: {
  jurnals?: JurnalResult;
  isLoading: boolean;
  page: number;
  limit: number;
  search: string;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setSearch: (search: string) => void;
  refetch: () => void;
  setSelectedJurnal: Dispatch<SetStateAction<SelectedJurnal>>;
}) {
  const [localSearch, setLocalSearch] = useState(search);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== search) {
        setSearch(localSearch);
        setPage(1);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [localSearch, search, setSearch, setPage]);

  const totalPages = jurnals?.totalPages ?? 0;

  return (
    <Card className="w-full gap-0 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c1020] text-white shadow-none">
      <CardHeader className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <CardTitle className="text-lg text-white">Trading Journal</CardTitle>
          <CardDescription className="text-slate-400">
            Review your crypto trading history.
          </CardDescription>
        </div>

        <div className="relative w-full md:w-72">
          <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />

          <input
            type="text"
            placeholder="Search symbol..."
            value={localSearch}
            onChange={(event) => setLocalSearch(event.target.value)}
            className="h-10 w-full rounded-lg border border-white/10 bg-[#080b16] pl-9 pr-3 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-fuchsia-500/50"
          />
        </div>
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
                  <TableCell
                    colSpan={TABLE_HEADERS.length}
                    className="py-8 text-center text-slate-400"
                  >
                    Loading journals...
                  </TableCell>
                </TableRow>
              ) : jurnals?.data?.length ? (
                jurnals.data.map((jurnal, index) => (
                  <TableRow
                    key={jurnal.id}
                    className="border-white/[0.06] transition-colors hover:bg-white/[0.025]"
                  >
                    <TableCell className="text-slate-500">
                      {(page - 1) * limit + index + 1}
                    </TableCell>

                    <TableCell className="whitespace-nowrap text-slate-300">
                      {new Date(`${jurnal.date}T00:00:00`).toLocaleDateString(
                        "id-ID",
                      )}
                    </TableCell>

                    <TableCell className="whitespace-nowrap font-semibold text-white">
                      {jurnal.symbol}
                    </TableCell>

                    <TableCell>
                      <span
                        className={
                          jurnal.type === "buy"
                            ? "rounded-md border border-emerald-400/20 bg-emerald-400/10 px-2 py-1 text-xs font-medium text-emerald-400"
                            : "rounded-md border border-rose-400/20 bg-rose-400/10 px-2 py-1 text-xs font-medium text-rose-400"
                        }
                      >
                        {jurnal.type.toUpperCase()}
                      </span>
                    </TableCell>

                    {/* Screenshot analisis sebelum entry */}
                    <TableCell>
                      <JurnalImageGallery jurnalId={jurnal.id} stage="before" />
                    </TableCell>

                    <TableCell className="whitespace-nowrap text-slate-300">
                      {jurnal.entry_price.toLocaleString("en-US")}
                    </TableCell>

                    <TableCell className="whitespace-nowrap text-slate-300">
                      {jurnal.exit_price === null
                        ? "—"
                        : jurnal.exit_price.toLocaleString("en-US")}
                    </TableCell>

                    <TableCell className="whitespace-nowrap text-slate-300">
                      {jurnal.quantity.toLocaleString("en-US", {
                        maximumFractionDigits: 8,
                      })}
                    </TableCell>

                    {/* Screenshot hasil setelah trading */}
                    <TableCell>
                      <JurnalImageGallery jurnalId={jurnal.id} stage="after" />
                    </TableCell>

                    <TableCell
                      className={`whitespace-nowrap font-semibold ${
                        jurnal.result === null
                          ? "text-slate-500"
                          : jurnal.result > 0
                            ? "text-emerald-400"
                            : jurnal.result < 0
                              ? "text-rose-400"
                              : "text-slate-300"
                      }`}
                    >
                      {jurnal.result === null
                        ? "Open"
                        : `${jurnal.result > 0 ? "+" : ""}${jurnal.result.toLocaleString(
                            "en-US",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 8,
                            },
                          )} USDT`}
                    </TableCell>

                    <TableCell className="max-w-48 truncate text-slate-400">
                      {jurnal.notes || "—"}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Edit jurnal"
                          className="text-slate-400 hover:bg-yellow-400/10 hover:text-yellow-400"
                          onClick={() =>
                            setSelectedJurnal({
                              data: jurnal,
                              action: "update",
                            })
                          }
                        >
                          <PencilIcon className="size-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Hapus jurnal"
                          className="text-slate-400 hover:bg-red-400/10 hover:text-red-400"
                          onClick={() =>
                            setSelectedJurnal({
                              data: jurnal,
                              action: "delete",
                            })
                          }
                        >
                          <Trash2Icon className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={TABLE_HEADERS.length}
                    className="py-8 text-center text-slate-400"
                  >
                    No trading journals found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>

            {!isLoading && jurnals?.data?.length === 0 && (
              <TableCaption className="mb-4 text-slate-500">
                Tidak ada jurnal yang cocok dengan pencarian.
              </TableCaption>
            )}
          </Table>
        </div>

        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-400">Rows per page</span>

            <Select
              value={limit.toString()}
              onValueChange={(value) => {
                setLimit(Number(value));
                setPage(1);
              }}
            >
              <SelectTrigger className="w-20 border-white/10 bg-[#080b16] text-white">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                {[10, 20, 50, 100].map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between gap-4 sm:justify-end">
            <span className="text-sm text-slate-400">
              Page {page} of {Math.max(totalPages, 1)}
            </span>

            <Pagination className="mx-0 w-auto">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    aria-disabled={page <= 1 || isLoading}
                    className={
                      page <= 1 || isLoading
                        ? "pointer-events-none opacity-40"
                        : "cursor-pointer"
                    }
                    onClick={() => setPage(Math.max(1, page - 1))}
                  />
                </PaginationItem>

                <PaginationItem>
                  <PaginationNext
                    aria-disabled={
                      page >= totalPages || totalPages === 0 || isLoading
                    }
                    className={
                      page >= totalPages || totalPages === 0 || isLoading
                        ? "pointer-events-none opacity-40"
                        : "cursor-pointer"
                    }
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
