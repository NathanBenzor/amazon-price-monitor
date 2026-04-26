import { SlackNotifier } from "../../infrastructure/notifications/slackNotifier";
import {
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
    return this.slackNotifier.sendPriceDropAlert(payload);
  }
}
