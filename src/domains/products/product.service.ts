import { loadProductsConfig } from "../../config/products";
import { ProductRepository } from "./product.repository";
import { ProductSummary } from "./product.types";

export class ProductService {
  private productRepository: ProductRepository;

  constructor() {
    this.productRepository = new ProductRepository();
  }

  async syncConfiguredProducts() {
    const configuredProducts = loadProductsConfig();
    await this.productRepository.upsertMany(configuredProducts);
  }

  async getAllProducts() {
    return this.productRepository.findAll();
  }

  async getActiveProducts() {
    return this.productRepository.findActive();
  }

  async getProductById(productId: string) {
    return this.productRepository.findById(productId);
  }

  async getProductSummaries(): Promise<ProductSummary[]> {
    const products = await this.productRepository.findAllWithLatestCheck();

    return products.map((product) => {
      const latestCheck = product.priceChecks[0] ?? null;

      return {
        id: product.id,
        name: product.name,
        url: product.url,
        isActive: product.isActive,
        latestPriceCents: latestCheck?.priceCents ?? null,
        lastCheckedAt: latestCheck?.checkedAt.toISOString() ?? null,
        lastStatus: latestCheck?.status ?? null,
      };
    });
  }
}
