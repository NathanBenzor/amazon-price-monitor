import { createApp } from "./app";
import { env } from "./config/env";
import { ProductService } from "./domains/products/product.service";

const app = createApp();
const productService = new ProductService();

async function startServer() {
  await productService.syncConfiguredProducts();

  app.listen(env.PORT, () => {
    console.log(`Backend server running on http://localhost:${env.PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
