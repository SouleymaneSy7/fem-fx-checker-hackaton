"use client";

import * as React from "react";

import { Container, Title, VisuallyHidden } from "@/components/common";
import {
  Empty,
  EmptyDescription,
  EmptyTitle,
  Separator,
  Skeleton,
} from "@/components/ui";
import { DEFAULT_HEATMAP_CURRENCIES, SHORTCUT_EVENTS } from "@/constants";
import { useHeatmap } from "@/hooks";
import type { SetRateRangeDetail } from "@/types";
import { formatFullDate } from "@/utils";
import RangeSelector from "../markets/range-selector";
import HeatmapGrid from "./heatmap-grid";
import HeatmapHint from "./heatmap-hint";
import HeatmapSkeleton from "./heatmap-skeleton";

const HeatmapPanel = () => {
  const { currencies, rows, range, setRange, asOfDate, isLoading, error } =
    useHeatmap(DEFAULT_HEATMAP_CURRENCIES);

  // Same bare 1...6 shortcut as HistoryPanel's own range selector (see
  // constants/shortcut-registry.ts's "set-rate-range" group) — both
  // listeners only ever fire while their own tab is mounted (Radix Tabs
  // unmounts inactive TabsContent), so reusing the event is safe: it
  // just means "1...6 changes whichever range selector is currently on
  // screen" instead of needing a second, heatmap-only shortcut.
  React.useEffect(() => {
    const handleSetRange = (event: Event) => {
      const detail = (event as CustomEvent<SetRateRangeDetail>).detail;
      if (detail?.range) setRange(detail.range);
    };

    window.addEventListener(SHORTCUT_EVENTS.setRateRange, handleSetRange);

    return () =>
      window.removeEventListener(SHORTCUT_EVENTS.setRateRange, handleSetRange);
  }, [setRange]);

  const hasData = rows.length > 0 && !error;

  return (
    <Container className="space-y-step-200 rounded-xl border border-neutral-600 bg-card p-step-200 md:space-y-step-250 md:p-step-250">
      <div className="flex flex-wrap items-center justify-between gap-step-125">
        <div className="flex flex-wrap items-center gap-step-150">
          <Title level="h3" className="preset-4 text-neutral-200 uppercase">
            Currency strength
          </Title>

          {asOfDate && !isLoading ? (
            <span className="preset-3-med text-neutral-100 uppercase">
              Since {formatFullDate(asOfDate)}
            </span>
          ) : (
            <Skeleton className="h-4.5 w-45" />
          )}
        </div>

        <div className="flex flex-wrap items-center gap-step-200">
          <HeatmapHint />

          <Separator
            orientation="vertical"
            className="hidden sm:inline-block"
          />

          <RangeSelector
            value={range}
            onValueChange={setRange}
            className="bg-neutral-600"
          />
        </div>
      </div>

      {/* biome-ignore lint/a11y/useSemanticElements: live region for loading state — <output> is semantically wrong for loading announcements */}
      <VisuallyHidden role="status">
        {isLoading ? "Loading currency strength heatmap" : ""}
      </VisuallyHidden>

      {isLoading ? (
        <HeatmapSkeleton />
      ) : hasData ? (
        <HeatmapGrid currencies={currencies} rows={rows} />
      ) : (
        <Empty className="py-step-300 md:py-step-400">
          <EmptyTitle>No heatmap data available</EmptyTitle>

          <EmptyDescription>
            We couldn't load currency strength data right now. This usually
            clears up in a minute.
          </EmptyDescription>
        </Empty>
      )}
    </Container>
  );
};

export default HeatmapPanel;
