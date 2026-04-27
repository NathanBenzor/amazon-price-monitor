export type TrackedProduct = {
  id: string;
  name: string;
  url: string;
  isActive: boolean;
};

export type ProductSummary = {
  id: string;
  name: string;
  url: string;
  isActive: boolean;
  latestPriceCents: number | null;
  lastCheckedAt: string | null;
  lastStatus: string | null;
};
