import { loadProductsConfig } from "../../config/products";
import { ProductRepository } from "./product.repository";

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
}
