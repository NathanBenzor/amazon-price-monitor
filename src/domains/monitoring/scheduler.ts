import cron from "node-cron";
import { env } from "../../config/env";
import { PriceCheckRunner } from "../priceChecks/priceCheck.runner";

export class Scheduler {
  private priceCheckRunner: PriceCheckRunner;

  constructor() {
    this.priceCheckRunner = new PriceCheckRunner();
  }

  start() {
    console.log(`Starting scheduler with cron: ${env.PRICE_CHECK_CRON}`);

    cron.schedule(env.PRICE_CHECK_CRON, async () => {
      console.log("Starting scheduled price check cycle");

      try {
        const results = await this.priceCheckRunner.runAllChecks();
        console.log("Completed scheduled price check cycle", {
          total: results.length,
        });
      } catch (error) {
        console.error("Scheduled price check cycle failed", error);
      }
    });
  }
}
