export type PriceCheckStatus = "SUCCESS" | "FAILED";

export type ScrapeResult = {
  success: boolean;
  scrapedTitle: string | null;
  priceCents: number | null;
  currency: string | null;
  errorMessage?: string;
};

export type CreatePriceCheckInput = {
  productId: string;
  status: PriceCheckStatus;
  priceCents: number | null;
  currency: string | null;
  scrapedTitle: string | null;
  errorMessage: string | null;
};
