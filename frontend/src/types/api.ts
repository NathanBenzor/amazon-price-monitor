export type ProductSummary = {
  id: string;
  name: string;
  url: string;
  isActive: boolean;
  latestPriceCents: number | null;
  lastCheckedAt: string | null;
  lastStatus: string | null;
};

export type ProductHistoryItem = {
  id: string;
  productId: string;
  priceCents: number | null;
  currency: string | null;
  status: string;
  errorMessage: string | null;
  checkedAt: string;
  scrapedTitle: string | null;
};
