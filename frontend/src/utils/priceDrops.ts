import type { PriceDropEvent, ProductHistoryItem } from "../types/api";

export function deriveLatestPriceDropEvent(
  history: ProductHistoryItem[],
): PriceDropEvent | null {
  const successfulChecks = history.filter(
    (item) => item.status === "SUCCESS" && item.priceCents !== null,
  );

  if (successfulChecks.length < 2) {
    return null;
  }

  const [latest, previous] = successfulChecks;

  if (latest.priceCents === null || previous.priceCents === null) {
    return null;
  }

  if (latest.priceCents >= previous.priceCents) {
    return null;
  }

  const deltaCents = latest.priceCents - previous.priceCents;
  const deltaPercent = (Math.abs(deltaCents) / previous.priceCents) * 100;

  return {
    latestCheckId: latest.id,
    productId: latest.productId,
    previousPriceCents: previous.priceCents,
    currentPriceCents: latest.priceCents,
    deltaCents,
    deltaPercent,
    checkedAt: latest.checkedAt,
  };
}
