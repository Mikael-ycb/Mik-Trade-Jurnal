import { Button } from "@/components/ui/button";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  ChartNoAxesCombined,
  NotebookPenIcon,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050611] text-white">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-violet-600/20 blur-[140px]" />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-indigo-600/10 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(148,163,184,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.15) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage: "linear-gradient(to bottom, black, transparent 85%)",
          }}
        />
      </div>

      {/* Navbar */}
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl border border-blue-400/20 bg-gradient-to-br from-blue-500/20 to-violet-500/20 shadow-lg shadow-blue-500/10">
            <NotebookPenIcon className="size-5 text-blue-300" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            Miternal<span className="text-blue-400">.</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 text-sm text-slate-400 sm:flex">
          <a href="#features" className="transition hover:text-white">
            Features
          </a>
          <a href="#preview" className="transition hover:text-white">
            Preview
          </a>
        </div>

        <Link href="/dashboard">
          <Button
            variant="outline"
            className="border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white"
          >
            Open Dashboard <ArrowUpRight className="ml-2 size-4" />
          </Button>
        </Link>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto grid max-w-7xl items-center gap-16 px-6 pb-24 pt-16 lg:grid-cols-2 lg:px-10 lg:pb-32 lg:pt-20">
        <div>
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/[0.07] px-4 py-2 text-sm text-blue-200">
            <Sparkles className="size-4 text-violet-300" />
            Your trading journey, documented.
          </div>

          <h1 className="max-w-2xl text-5xl font-bold leading-[1.12] tracking-tight sm:text-6xl lg:text-7xl">
            Trade with purpose.
            <span className="mt-2 block bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
              Learn with every trade.
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-base leading-8 text-slate-400 sm:text-lg">
            Your personal trading journal to track decisions, analyze
            performance, and understand the habits behind every trade. Stop
            guessing. Start learning.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <Link href="/dashboard">
              <Button
                size="lg"
                className="h-12 bg-gradient-to-r from-blue-600 to-violet-600 px-6 text-base shadow-lg shadow-blue-600/20 transition hover:scale-[1.02] hover:from-blue-500 hover:to-violet-500"
              >
                Get Started
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>

            <a href="#features">
              <Button
                size="lg"
                variant="outline"
                className="h-12 border-white/10 bg-white/[0.03] px-6 text-base text-slate-200 hover:bg-white/[0.08] hover:text-white"
              >
                Explore Features
              </Button>
            </a>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-500">
            <span className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-blue-400" />
              Your personal journal
            </span>
            <span className="flex items-center gap-2">
              <ChartNoAxesCombined className="size-4 text-violet-400" />
              Performance insights
            </span>
          </div>
        </div>

        {/* Dashboard preview */}
        <div id="preview" className="relative mx-auto w-full max-w-xl">
          <div className="absolute -inset-5 rounded-[2rem] bg-gradient-to-br from-blue-500/20 to-violet-600/20 blur-2xl" />

          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0c1020]/90 shadow-2xl shadow-black/40 backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-4">
              <div>
                <p className="text-sm font-semibold">Trading Overview</p>
                <p className="mt-1 text-xs text-slate-500">
                  Your performance at a glance
                </p>
              </div>
              <div className="flex gap-1.5">
                <span className="size-2.5 rounded-full bg-red-400/70" />
                <span className="size-2.5 rounded-full bg-yellow-400/70" />
                <span className="size-2.5 rounded-full bg-emerald-400/70" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 p-5">
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4">
                <p className="text-xs text-slate-400">Total Trades</p>
                <p className="mt-3 text-2xl font-bold">128</p>
                <p className="mt-2 text-xs text-slate-500">Trades recorded</p>
              </div>

              <div className="rounded-xl border border-violet-400/15 bg-violet-400/[0.05] p-4">
                <p className="text-xs text-slate-400">Win Rate</p>
                <p className="mt-3 text-2xl font-bold text-violet-300">68.4%</p>
                <p className="mt-2 flex items-center gap-1 text-xs text-emerald-400">
                  <ArrowUpRight className="size-3.5" />
                  Performance metric
                </p>
              </div>
            </div>

            <div className="px-5 pb-5">
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Performance</p>
                    <p className="mt-1 text-xs text-slate-500">
                      Illustrative example
                    </p>
                  </div>
                  <ChartNoAxesCombined className="size-5 text-blue-400" />
                </div>

                <div className="relative h-36 w-full">
                  <div className="absolute inset-0 flex flex-col justify-between">
                    <div className="border-t border-dashed border-white/[0.07]" />
                    <div className="border-t border-dashed border-white/[0.07]" />
                    <div className="border-t border-dashed border-white/[0.07]" />
                    <div className="border-t border-dashed border-white/[0.07]" />
                  </div>

                  <svg
                    viewBox="0 0 400 130"
                    preserveAspectRatio="none"
                    className="relative h-full w-full overflow-visible"
                    aria-label="Illustrative trading performance chart"
                    role="img"
                  >
                    <defs>
                      <linearGradient
                        id="areaGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#6366f1"
                          stopOpacity="0.35"
                        />
                        <stop
                          offset="100%"
                          stopColor="#6366f1"
                          stopOpacity="0"
                        />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0 105 L40 90 L80 98 L120 65 L160 78 L200 45 L240 60 L280 25 L320 40 L360 12 L400 20 L400 130 L0 130 Z"
                      fill="url(#areaGradient)"
                    />
                    <path
                      d="M0 105 L40 90 L80 98 L120 65 L160 78 L200 45 L240 60 L280 25 L320 40 L360 12 L400 20"
                      fill="none"
                      stroke="#818cf8"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      vectorEffect="non-scaling-stroke"
                    />
                    <circle cx="360" cy="12" r="4" fill="#a5b4fc" />
                  </svg>
                </div>

                <div className="mt-3 flex justify-between text-[11px] text-slate-500">
                  <span>Week 1</span>
                  <span>Week 2</span>
                  <span>Week 3</span>
                  <span>Week 4</span>
                </div>
              </div>
            </div>

            <div className="border-t border-white/[0.08] px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-blue-500/10">
                  <BookOpen className="size-5 text-blue-300" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Trading Journal</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Record the why, not just the result.
                  </p>
                </div>
                <ArrowDownRight className="size-4 text-violet-400" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="relative z-10 border-t border-white/[0.07] bg-white/[0.015] px-6 py-20 lg:px-10"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
              Built for traders
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Make every trade a lesson.
            </h2>
            <p className="mt-4 leading-7 text-slate-400">
              A place to review your process, recognize patterns, and become
              more intentional with every decision.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            <FeatureCard
              icon={<NotebookPenIcon className="size-5" />}
              number="01"
              title="Log Your Trades"
              description="Document your entries, exits, strategy, and reasoning in one organized journal."
            />
            <FeatureCard
              icon={<ChartNoAxesCombined className="size-5" />}
              number="02"
              title="Review Performance"
              description="Turn your trading history into insights that help you understand your results."
            />
            <FeatureCard
              icon={<Sparkles className="size-5" />}
              number="03"
              title="Learn Your Patterns"
              description="Reflect on your decisions, identify recurring mistakes, and improve your process."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.07] px-6 py-6 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-sm text-slate-500 sm:flex-row">
          <p>
            © {new Date().getFullYear()} Miternal. Built for thoughtful traders.
          </p>
          <p>Trade mindfully. Keep learning.</p>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({
  icon,
  number,
  title,
  description,
}: {
  icon: React.ReactNode;
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="group rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-400/30 hover:bg-blue-400/[0.04]">
      <div className="flex items-center justify-between">
        <div className="flex size-11 items-center justify-center rounded-xl border border-blue-400/15 bg-gradient-to-br from-blue-500/15 to-violet-500/15 text-blue-300 transition group-hover:text-violet-300">
          {icon}
        </div>
        <span className="text-xs font-medium tracking-widest text-slate-600">
          {number}
        </span>
      </div>
      <h3 className="mt-6 text-lg font-semibold">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-400">{description}</p>
    </div>
  );
}
