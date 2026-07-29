"use client";

import {
  Area,
  AreaChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { CustomTooltipPropsType, RateChartPropsType } from "@/types";
import { formatAmount } from "@/utils";

const CustomTooltip = ({
  active,
  payload,
  pair,
  dateFormatter,
}: CustomTooltipPropsType) => {
  if (!active || !payload?.length) return null;
  const point = payload[0]?.payload;
  if (!point) return null;

  return (
    <div className="flex flex-col gap-step-075 rounded-8 border border-border bg-popover px-step-150 py-step-100 shadow-lg">
      <p className="preset-6 text-neutral-200 uppercase">
        {dateFormatter(point.date)}
      </p>

      <p className="preset-4 font-bold text-foreground">
        {formatAmount(point.rate)} <span className="text-neutral-200">·</span>{" "}
        {pair}
      </p>
    </div>
  );
};

const RateChart = ({ data, pair, dateFormatter }: RateChartPropsType) => {
  const rates = data.map((point) => point.rate);
  const min = Math.min(...rates);
  const max = Math.max(...rates);
  const mid = (min + max) / 2;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 12, right: 8, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="rateGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.55} />
            <stop offset="55%" stopColor="var(--primary)" stopOpacity={0.12} />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
          </linearGradient>
        </defs>

        <ReferenceLine
          y={max}
          stroke="var(--neutral-500)"
          strokeDasharray="4 4"
          strokeOpacity={1}
        />

        <ReferenceLine
          y={mid}
          stroke="var(--neutral-500)"
          strokeDasharray="4 4"
          strokeOpacity={1}
        />

        <ReferenceLine
          y={min}
          stroke="var(--neutral-500)"
          strokeDasharray="4 4"
          strokeOpacity={1}
        />

        <XAxis
          dataKey="date"
          tickFormatter={dateFormatter}
          tick={{ fill: "var(--neutral-200)", fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          interval="preserveStartEnd"
          minTickGap={120}
          tickMargin={10}
        />

        <YAxis
          domain={[min, max]}
          ticks={[min, mid, max]}
          tickFormatter={(value: number) => formatAmount(value)}
          tick={{ fill: "var(--neutral-200)", fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          width={56}
          tickMargin={10}
        />

        <Tooltip
          content={<CustomTooltip pair={pair} dateFormatter={dateFormatter} />}
          cursor={{ stroke: "var(--neutral-400)", strokeDasharray: "4 4" }}
        />

        <Area
          type="linear"
          dataKey="rate"
          stroke="var(--primary)"
          strokeWidth={2}
          fill="url(#rateGradient)"
          dot={false}
          activeDot={{
            r: 4,
            fill: "var(--primary)",
            stroke: "var(--neutral-900)",
            strokeWidth: 2,
          }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default RateChart;
