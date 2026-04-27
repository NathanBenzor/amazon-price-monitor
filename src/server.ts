import { createApp } from "./app";
import { env } from "./config/env";
import { Scheduler } from "./domains/monitoring/scheduler";
import { ProductService } from "./domains/products/product.service";
import { logger } from "./infrastructure/logging/logger";

const app = createApp();
const productService = new ProductService();
const scheduler = new Scheduler();

async function startServer() {
  await productService.syncConfiguredProducts();

  logger.info("Configured products synced to database");

  scheduler.start();

  app.listen(env.PORT, () => {
    logger.info({ port: env.PORT }, "Backend server started");
  });
}

startServer().catch((error) => {
  logger.error({ err: error }, "Failed to start server");
  process.exit(1);
});
