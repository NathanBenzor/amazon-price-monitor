import { PriceComparisonResult } from "./priceComparison.types";

export class PriceComparisonService {
  evaluatePriceDrop(
    previousPriceCents: number | null,
    currentPriceCents: number | null,
    thresholdPercent: number,
  ): PriceComparisonResult {
    if (
      previousPriceCents === null ||
      currentPriceCents === null ||
      previousPriceCents <= 0
    ) {
      return {
        previousPriceCents,
        currentPriceCents,
        deltaCents: null,
        deltaPercent: null,
        dropped: false,
        meetsThreshold: false,
      };
    }

    const deltaCents = currentPriceCents - previousPriceCents;
    const dropped = deltaCents < 0;
    const deltaPercent = (Math.abs(deltaCents) / previousPriceCents) * 100;

    return {
      previousPriceCents,
      currentPriceCents,
      deltaCents,
      deltaPercent,
      dropped,
      meetsThreshold: dropped && deltaPercent >= thresholdPercent,
    };
  }
}
