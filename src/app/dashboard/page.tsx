import type { Metadata } from "next";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  ChartNoAxesCombined,
  Clock3,
  NotebookPen,
  Plus,
  Target,
  TrendingUp,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Dashboard | Miternal",
  description: "Your personal trading journal dashboard",
};

const stats = [
  {
    label: "Total Trades",
    value: "0",
    note: "Start recording your trades",
    icon: NotebookPen,
    color: "text-blue-300",
    iconBg: "bg-blue-400/10",
  },
  {
    label: "Win Rate",
    value: "—",
    note: "Calculated from your results",
    icon: Target,
    color: "text-violet-300",
    iconBg: "bg-violet-400/10",
  },
  {
    label: "Net P&L",
    value: "Rp0",
    note: "Based on recorded trades",
    icon: TrendingUp,
    color: "text-cyan-300",
    iconBg: "bg-cyan-400/10",
  },
  {
    label: "Trading Journal",
    value: "0",
    note: "Entries documented",
    icon: Wallet,
    color: "text-indigo-300",
    iconBg: "bg-indigo-400/10",
  },
];

const bars = [24, 35, 28, 48, 38, 56, 44, 68, 52, 76, 63, 88];

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-[1600px] space-y-8">
      {/* Page heading */}
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <div className="mb-3 flex items-center gap-2 text-sm text-blue-300">
            <span className="size-2 rounded-full bg-blue-400 shadow-[0_0_12px_#60a5fa]" />
            Your trading workspace
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Dashboard<span className="text-blue-400">.</span>
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
            Review your trading journey, track your decisions, and learn from
            every trade.
          </p>
        </div>

        <Link href="/dashboard/transaction">
          <Button className="h-11 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 text-white shadow-lg shadow-blue-600/15 transition hover:from-blue-500 hover:to-violet-500">
            <Plus className="mr-2 size-4" />
            Record a Trade
          </Button>
        </Link>
      </section>

      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="group rounded-2xl border border-white/[0.08] bg-[#0c1020]/80 p-5 transition duration-300 hover:-translate-y-1 hover:border-blue-400/20 hover:bg-[#10162a]"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-400">{stat.label}</p>
                  <p className="mt-4 text-3xl font-bold tracking-tight text-white">
                    {stat.value}
                  </p>
                </div>

                <div
                  className={`flex size-11 items-center justify-center rounded-xl ${stat.iconBg}`}
                >
                  <Icon className={`size-5 ${stat.color}`} />
                </div>
              </div>

              <p className="mt-4 text-xs text-slate-500">{stat.note}</p>
            </div>
          );
        })}
      </section>

      {/* Main grid */}
      <section className="grid gap-5 xl:grid-cols-[1.65fr_1fr]">
        {/* Performance chart */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#0c1020]/80 p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <ChartNoAxesCombined className="size-5 text-blue-300" />
                <h2 className="font-semibold text-white">
                  Performance Overview
                </h2>
              </div>
              <p className="mt-2 text-sm text-slate-500">
                Your trading performance will appear here.
              </p>
            </div>

            <span className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs text-slate-400">
              Sample visualization
            </span>
          </div>

          <div className="mt-8">
            <div className="flex h-52 items-end gap-2 border-b border-l border-white/[0.08] px-3 pb-0 pt-4 sm:gap-4 sm:px-5">
              {bars.map((height, index) => (
                <div
                  key={index}
                  className="group relative flex h-full flex-1 items-end"
                >
                  <div
                    style={{ height: `${height}%` }}
                    className="w-full rounded-t-md bg-gradient-to-t from-blue-600/50 via-indigo-500/60 to-violet-400/90 opacity-75 transition-all duration-300 group-hover:opacity-100"
                  />
                </div>
              ))}
            </div>

            <div className="mt-3 flex justify-between pl-1 text-[11px] text-slate-500">
              <span>Period 01</span>
              <span>Period 04</span>
              <span>Period 08</span>
              <span>Period 12</span>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-2 rounded-xl border border-blue-400/10 bg-blue-400/[0.04] p-3 text-xs leading-5 text-slate-400">
            <Clock3 className="size-4 shrink-0 text-blue-300" />
            This is a visual placeholder. Connect your trade records to show
            actual performance.
          </div>
        </div>

        {/* Quick actions */}
        <div className="space-y-5">
          <div className="rounded-2xl border border-white/[0.08] bg-[#0c1020]/80 p-5 sm:p-6">
            <h2 className="font-semibold">Quick Actions</h2>
            <p className="mt-2 text-sm text-slate-500">
              Keep your trading journal up to date.
            </p>

            <div className="mt-5 space-y-3">
              <Link
                href="/dashboard/transaction"
                className="group flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 transition hover:border-blue-400/25 hover:bg-blue-400/[0.05]"
              >
                <div className="flex size-10 items-center justify-center rounded-xl bg-blue-400/10">
                  <Plus className="size-5 text-blue-300" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">Record a Trade</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Document a new trading decision
                  </p>
                </div>

                <ArrowRight className="size-4 text-slate-500 transition group-hover:translate-x-1 group-hover:text-blue-300" />
              </Link>

              <Link
                href="/dashboard/transaction"
                className="group flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 transition hover:border-violet-400/25 hover:bg-violet-400/[0.05]"
              >
                <div className="flex size-10 items-center justify-center rounded-xl bg-violet-400/10">
                  <NotebookPen className="size-5 text-violet-300" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">Review Journal</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Revisit your previous decisions
                  </p>
                </div>

                <ArrowRight className="size-4 text-slate-500 transition group-hover:translate-x-1 group-hover:text-violet-300" />
              </Link>
            </div>
          </div>

          {/* Reflection card */}
          <div className="relative overflow-hidden rounded-2xl border border-violet-400/15 bg-gradient-to-br from-blue-500/[0.09] via-[#101126] to-violet-500/[0.10] p-5 sm:p-6">
            <div className="absolute -right-8 -top-8 size-28 rounded-full bg-violet-500/10 blur-2xl" />

            <div className="relative">
              <div className="flex items-center gap-2 text-violet-300">
                <Target className="size-5" />
                <h2 className="font-semibold text-white">
                  Trader&apos;s Reminder
                </h2>
              </div>

              <p className="mt-4 text-lg font-medium leading-7 text-slate-200">
                Focus on your process, not just the outcome.
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                A good trade follows a sound plan. Use your journal to learn
                from both wins and losses.
              </p>

              <div className="mt-5 flex items-center gap-2 text-xs text-blue-300">
                <ArrowDownRight className="size-4" />
                Reflect. Improve. Repeat.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Empty state */}
      <section className="rounded-2xl border border-dashed border-white/10 bg-white/[0.015] px-5 py-10 text-center sm:py-12">
        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl border border-blue-400/15 bg-blue-400/[0.07]">
          <NotebookPen className="size-5 text-blue-300" />
        </div>

        <h2 className="mt-4 text-lg font-semibold">
          Your trading story starts here
        </h2>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
          Once you record trades, this space can display your recent activity,
          results, and trading insights.
        </p>

        <Link href="/dashboard/transaction" className="mt-5 inline-flex">
          <Button
            variant="outline"
            className="border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.08] hover:text-white"
          >
            Add your first trade
            <ArrowRight className="ml-2 size-4" />
          </Button>
        </Link>
      </section>
    </div>
  );
}
