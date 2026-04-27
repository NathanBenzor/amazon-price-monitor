import cron from "node-cron";
import { env } from "../../config/env";
import { logger } from "../../infrastructure/logging/logger";
import { PriceCheckRunner } from "../priceChecks/priceCheck.runner";

export class Scheduler {
  private priceCheckRunner: PriceCheckRunner;

  constructor() {
    this.priceCheckRunner = new PriceCheckRunner();
  }

  start() {
    logger.info({ cron: env.PRICE_CHECK_CRON }, "Scheduler started");

    cron.schedule(env.PRICE_CHECK_CRON, async () => {
      logger.info("Scheduled price check cycle started");

      try {
        const results = await this.priceCheckRunner.runAllChecks();

        logger.info(
          {
            totalProducts: results.length,
            successfulChecks: results.filter((result) => result.success).length,
            failedChecks: results.filter((result) => !result.success).length,
          },
          "Scheduled price check cycle completed",
        );
      } catch (error) {
        logger.error({ err: error }, "Scheduled price check cycle failed");
      }
    });
  }
}
