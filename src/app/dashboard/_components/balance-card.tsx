"use client";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  TrendingDownIcon,
  TrendingUpIcon,
  ChartNoAxesCombinedIcon,
  TargetIcon,
} from "lucide-react";

export function BalanceCards({
  data,
  error,
}: {
  data:
    | {
        totalProfit: number;
        totalTrades: number;
        winningTrades: number;
        losingTrades: number;
      }
    | undefined;
  error: unknown;
}) {
  if (error) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-[#0c1020] p-4 text-sm text-red-400">
        Gagal mengambil ringkasan trading.
      </div>
    );
  }

  const totalProfit = data?.totalProfit ?? 0;
  const totalTrades = data?.totalTrades ?? 0;
  const winningTrades = data?.winningTrades ?? 0;
  const losingTrades = data?.losingTrades ?? 0;

  const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;

  const isProfit = totalProfit >= 0;

  const cardStyle =
    "rounded-2xl border border-white/[0.08] bg-[#0c1020] text-white shadow-none transition-colors duration-200 hover:border-purple-500/30";

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
      {/* Total Profit / Loss */}
      <Card className={cardStyle}>
        <CardHeader className="gap-4">
          <CardTitle className="flex items-center gap-3 text-sm font-medium text-slate-300">
            <span className="flex size-9 items-center justify-center rounded-lg border border-emerald-400/15 bg-emerald-400/[0.08]">
              {isProfit ? (
                <TrendingUpIcon className="size-[18px] text-emerald-400" />
              ) : (
                <TrendingDownIcon className="size-[18px] text-rose-400" />
              )}
            </span>
            Total Profit / Loss
          </CardTitle>

          <CardDescription
            className={`text-2xl font-semibold tracking-tight ${
              isProfit ? "text-emerald-400" : "text-rose-400"
            }`}
          >
            {isProfit ? "+" : ""}
            {totalProfit.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{" "}
            USDT
          </CardDescription>
        </CardHeader>

        <CardFooter className="text-sm text-slate-400">
          Akumulasi hasil trading
        </CardFooter>
      </Card>

      {/* Total Trades */}
      <Card className={cardStyle}>
        <CardHeader className="gap-4">
          <CardTitle className="flex items-center gap-3 text-sm font-medium text-slate-300">
            <span className="flex size-9 items-center justify-center rounded-lg border border-blue-400/15 bg-blue-400/[0.08]">
              <ChartNoAxesCombinedIcon className="size-[18px] text-blue-400" />
            </span>
            Total Trades
          </CardTitle>

          <CardDescription className="text-2xl font-semibold tracking-tight text-white">
            {totalTrades.toLocaleString("id-ID")}
          </CardDescription>
        </CardHeader>

        <CardFooter className="text-sm text-slate-400">
          Total jurnal trading tercatat
        </CardFooter>
      </Card>

      {/* Win Rate */}
      <Card className={cardStyle}>
        <CardHeader className="gap-4">
          <CardTitle className="flex items-center gap-3 text-sm font-medium text-slate-300">
            <span className="flex size-9 items-center justify-center rounded-lg border border-fuchsia-400/15 bg-fuchsia-400/[0.08]">
              <TargetIcon className="size-[18px] text-fuchsia-400" />
            </span>
            Win Rate
          </CardTitle>

          <CardDescription className="text-2xl font-semibold tracking-tight text-white">
            {winRate.toFixed(1)}%
          </CardDescription>
        </CardHeader>

        <CardFooter className="text-sm text-slate-400">
          <span className="text-emerald-400">{winningTrades} profit</span>
          <span className="mx-2 text-slate-600">·</span>
          <span className="text-rose-400">{losingTrades} loss</span>
        </CardFooter>
      </Card>
    </div>
  );
}
