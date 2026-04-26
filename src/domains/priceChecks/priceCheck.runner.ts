import { AmazonScraper } from "../../infrastructure/scraping/amazonScraper";
import { ProductService } from "../products/product.service";
import { PriceCheckRepository } from "./priceCheck.repository";

export class PriceCheckRunner {
  private productService: ProductService;
  private priceCheckRepository: PriceCheckRepository;
  private amazonScraper: AmazonScraper;

  constructor() {
    this.productService = new ProductService();
    this.priceCheckRepository = new PriceCheckRepository();
    this.amazonScraper = new AmazonScraper();
  }

  async runCheckForProduct(productId: string) {
    const product = await this.productService.getProductById(productId);

    if (!product) {
      throw new Error(`Product not found for id: ${productId}`);
    }

    const scrapeResult = await this.amazonScraper.scrapeProduct(product.url);

    const priceCheck = await this.priceCheckRepository.create({
      productId: product.id,
      status: scrapeResult.success ? "SUCCESS" : "FAILED",
      priceCents: scrapeResult.priceCents,
      currency: scrapeResult.currency,
      scrapedTitle: scrapeResult.scrapedTitle,
      errorMessage: scrapeResult.errorMessage ?? null,
    });

    return {
      product,
      scrapeResult,
      priceCheck,
    };
  }
}
