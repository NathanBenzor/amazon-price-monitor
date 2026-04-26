import { describe, expect, it } from "vitest";
import { PriceComparisonService } from "./priceComparison.service";

describe("PriceComparisonService", () => {
  it("detects a price drop that meets the threshold", () => {
    const service = new PriceComparisonService();

    const result = service.evaluatePriceDrop(10000, 8000, 10);

    expect(result.dropped).toBe(true);
    expect(result.meetsThreshold).toBe(true);
    expect(result.deltaCents).toBe(-2000);
    expect(result.deltaPercent).toBe(20);
  });

  it("does not meet threshold for a small drop", () => {
    const service = new PriceComparisonService();

    const result = service.evaluatePriceDrop(10000, 9700, 5);

    expect(result.dropped).toBe(true);
    expect(result.meetsThreshold).toBe(false);
  });

  it("returns false when there is no previous price", () => {
    const service = new PriceComparisonService();

    const result = service.evaluatePriceDrop(null, 9700, 5);

    expect(result.dropped).toBe(false);
    expect(result.meetsThreshold).toBe(false);
    expect(result.deltaCents).toBeNull();
  });
});
