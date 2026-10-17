"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

type WinRateChartProps = {
  winRate: number;
};

export default function WinRateChart({ winRate }: WinRateChartProps) {
  const rate = Math.min(100, Math.max(0, winRate));

  const data = [
    { name: "Win", value: rate },
    { name: "Remaining", value: 100 - rate },
  ];

  return (
    <div className="relative mx-auto h-36 w-36">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            cx="50%"
            cy="50%"
            innerRadius={53}
            outerRadius={65}
            startAngle={90}
            endAngle={-270}
            paddingAngle={2}
            stroke="none"
          >
            <Cell fill="#d946ef" />
            <Cell fill="#252b40" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-semibold tracking-tight text-white">
          {rate.toFixed(1)}%
        </span>
        <span className="text-[10px] tracking-widest text-slate-400">
          WIN RATE
        </span>
      </div>
    </div>
  );
}
