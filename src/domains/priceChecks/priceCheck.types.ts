export type PriceCheckStatus = "SUCCESS" | "FAILED";

export type ScrapeResult = {
  success: boolean;
  scrapedTitle: string | null;
  priceCents: number | null;
  currency: string | null;
  errorMessage?: string;
};
