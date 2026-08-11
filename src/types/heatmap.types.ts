export type HeatmapCellType = {
  currency: string;
  changePercent: number | null;
};

export type HeatmapRowType = {
  currency: string;
  cells: HeatmapCellType[];
};
