export type PriceDropNotificationPayload = {
  productId: string;
  productName: string;
  productUrl: string;
  previousPriceCents: number;
  currentPriceCents: number;
  deltaCents: number;
  deltaPercent: number;
};

export type NotificationResult = {
  success: boolean;
  errorMessage?: string;
};
