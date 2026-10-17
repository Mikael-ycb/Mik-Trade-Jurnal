"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ReferenceLine,
} from "recharts";

export type ProfitPoint = {
  date: string;
  profit: number;
};

type ProfitLossChartProps = {
  data: ProfitPoint[];
  isProfit: boolean;
};

export default function ProfitLossChart({
  data,
  isProfit,
}: ProfitLossChartProps) {
  const color = isProfit ? "#34d399" : "#fb7185";

  return (
    <div className="h-28 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 8, right: 4, left: 4, bottom: 0 }}
        >
          <defs>
            <linearGradient id="profitLossGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>

          <XAxis dataKey="date" hide />
          <YAxis hide domain={["auto", "auto"]} />

          <ReferenceLine y={0} stroke="#475569" strokeDasharray="3 3" />

          <Tooltip
            contentStyle={{
              backgroundColor: "#0c1020",
              border: "1px solid #293247",
              borderRadius: "8px",
              color: "#fff",
              fontSize: "12px",
            }}
            formatter={(value) => [
              `${Number(value).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })} USDT`,
              "Profit / Loss",
            ]}
            labelFormatter={(label) => `Tanggal: ${label}`}
          />

          <Area
            type="monotone"
            dataKey="profit"
            stroke={color}
            strokeWidth={2}
            fill="url(#profitLossGradient)"
            activeDot={{ r: 4, fill: color }}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
