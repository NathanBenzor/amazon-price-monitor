import { env } from "../../config/env";
import { SlackNotifier } from "../../infrastructure/notifications/slackNotifier";
import type {
  NotificationResult,
  PriceDropNotificationPayload,
} from "./notification.types";

export class NotificationService {
  private slackNotifier: SlackNotifier;

  constructor() {
    this.slackNotifier = new SlackNotifier();
  }

  async sendPriceDropAlert(
    payload: PriceDropNotificationPayload,
  ): Promise<NotificationResult> {
    if (env.NOTIFICATION_METHOD === "slack") {
      return this.slackNotifier.sendPriceDropAlert(payload);
    }

    return {
      success: false,
      errorMessage: `Unsupported notification method: ${env.NOTIFICATION_METHOD}`,
    };
  }
}
