import axios from "axios";
import { env } from "../../config/env";
import {
  NotificationResult,
  PriceDropNotificationPayload,
} from "../../domains/notifications/notification.types";

function formatPrice(priceCents: number): string {
  return `$${(priceCents / 100).toFixed(2)}`;
}

export class SlackNotifier {
  async sendPriceDropAlert(
    payload: PriceDropNotificationPayload,
  ): Promise<NotificationResult> {
    if (!env.SLACK_WEBHOOK_URL) {
      return {
        success: false,
        errorMessage: "Missing SLACK_WEBHOOK_URL",
      };
    }

    const message = {
      text: [
        `Price drop detected for ${payload.productName}`,
        `Previous price: ${formatPrice(payload.previousPriceCents)}`,
        `Current price: ${formatPrice(payload.currentPriceCents)}`,
        `Drop: ${formatPrice(Math.abs(payload.deltaCents))} (${payload.deltaPercent.toFixed(2)}%)`,
        `Product URL: ${payload.productUrl}`,
      ].join("\n"),
    };

    try {
      await axios.post(env.SLACK_WEBHOOK_URL, message);

      return { success: true };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unknown Slack notification error";

      return {
        success: false,
        errorMessage: message,
      };
    }
  }
}
