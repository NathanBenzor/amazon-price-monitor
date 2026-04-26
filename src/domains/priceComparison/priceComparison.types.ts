export type PriceComparisonResult = {
  previousPriceCents: number | null;
  currentPriceCents: number | null;
  deltaCents: number | null;
  deltaPercent: number | null;
  dropped: boolean;
  meetsThreshold: boolean;
};
