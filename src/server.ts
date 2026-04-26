import { createApp } from "./app";
import { env } from "./config/env";
import { Scheduler } from "./domains/monitoring/scheduler";
import { ProductService } from "./domains/products/product.service";

const app = createApp();
const productService = new ProductService();
const scheduler = new Scheduler();

async function startServer() {
  await productService.syncConfiguredProducts();

  scheduler.start();

  app.listen(env.PORT, () => {
    console.log(`Backend server running on http://localhost:${env.PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
