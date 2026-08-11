"use client";

import * as React from "react";

import { HEATMAP_MAX_COLOR_BLEND_PERCENT } from "@/constants";
import type {
  HeatmapCellType,
  HeatmapGridPropsType,
  HeatmapRowType,
} from "@/types";

// Floor so a near-flat period (every change close to 0) doesn't divide by
// ~0 and blow every cell out to full color for essentially no movement.
const MIN_INTENSITY_CLAMP_PERCENT = 0.05;

// Scales color intensity to whatever the biggest mover in the current
// grid actually is, rather than a fixed magic number — a 1-day view
// (moves usually under 1%) and a 5-year view (moves that can exceed 30%)
// both end up using the full color range instead of one looking washed
// out and the other maxed out everywhere.
function getMaxAbsChange(rows: HeatmapRowType[]): number {
  let max = MIN_INTENSITY_CLAMP_PERCENT;

  for (const row of rows) {
    for (const cell of row.cells) {
      if (cell.changePercent === null) continue;
      max = Math.max(max, Math.abs(cell.changePercent));
    }
  }

  return max;
}

function getCellStyle(
  changePercent: number | null,
  intensityClamp: number,
): React.CSSProperties {
  if (!changePercent) return {};

  const magnitude = Math.min(Math.abs(changePercent) / intensityClamp, 1);
  const blend = magnitude * HEATMAP_MAX_COLOR_BLEND_PERCENT;
  const colorVar = changePercent > 0 ? "--green" : "--red";

  // color-mix() needs a modern browser — consistent with the oklch
  // colors already used throughout this project's design tokens.
  return {
    backgroundColor: `color-mix(in oklch, var(${colorVar}) ${blend}%, var(--card))`,
  };
}

function getCellDisplay(rowCurrency: string, cell: HeatmapCellType) {
  const isSelf = rowCurrency === cell.currency;

  if (isSelf) {
    return { text: "—", label: `${rowCurrency}: same currency` };
  }

  if (cell.changePercent === null) {
    return { text: "—", label: `${rowCurrency} vs ${cell.currency}: no data` };
  }

  const sign = cell.changePercent >= 0 ? "+" : "";
  const formatted = `${sign}${cell.changePercent.toFixed(2)}%`;

  return {
    text: formatted,
    label: `${rowCurrency} vs ${cell.currency}: ${formatted}`,
  };
}

const HeatmapGrid = ({ currencies, rows }: HeatmapGridPropsType) => {
  const intensityClamp = React.useMemo(() => getMaxAbsChange(rows), [rows]);

  return (
    <div className="overflow-x-auto rounded-10 border border-neutral-500">
      <table className="w-full border-collapse text-center">
        <thead>
          <tr>
            <td className="sticky left-0 z-10 bg-neutral-600 p-step-100 md:p-step-200" />

            {currencies.map((code) => (
              <th
                key={code}
                scope="col"
                className="preset-5 md:preset-4 min-w-16 border-neutral-500 border-l bg-neutral-600 p-step-125 text-neutral-200 uppercase md:p-step-200"
              >
                {code}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => (
            <tr key={row.currency}>
              <th
                scope="row"
                className="preset-5 md:preset-4 sticky left-0 z-10 border-neutral-500 border-t bg-neutral-600 p-step-125 text-left text-neutral-200 uppercase md:p-step-200"
              >
                {row.currency}
              </th>

              {row.cells.map((cell) => {
                const { text, label } = getCellDisplay(row.currency, cell);

                return (
                  <td
                    key={cell.currency}
                    style={getCellStyle(cell.changePercent, intensityClamp)}
                    aria-label={label}
                    className="preset-5 md:preset-4 border-neutral-500 border-t border-l p-step-125 text-foreground tabular-nums md:p-step-200"
                  >
                    {text}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HeatmapGrid;
