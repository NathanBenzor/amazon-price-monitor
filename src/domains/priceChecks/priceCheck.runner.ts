import { env } from "../../config/env";
import { AmazonScraper } from "../../infrastructure/scraping/amazonScraper";
import { ProductService } from "../products/product.service";
import { PriceComparisonService } from "../priceComparison/priceComparison.service";
import { PriceCheckRepository } from "./priceCheck.repository";

export class PriceCheckRunner {
  private productService: ProductService;
  private priceCheckRepository: PriceCheckRepository;
  private amazonScraper: AmazonScraper;
  private priceComparisonService: PriceComparisonService;

  constructor() {
    this.productService = new ProductService();
    this.priceCheckRepository = new PriceCheckRepository();
    this.amazonScraper = new AmazonScraper();
    this.priceComparisonService = new PriceComparisonService();
  }

  async runCheckForProduct(productId: string) {
    const product = await this.productService.getProductById(productId);

    if (!product) {
      throw new Error(`Product not found for id: ${productId}`);
    }

    const previousSuccessfulCheck =
      await this.priceCheckRepository.findLatestSuccessfulByProductId(
        product.id,
      );

    const scrapeResult = await this.amazonScraper.scrapeProduct(product.url);

    const priceCheck = await this.priceCheckRepository.create({
      productId: product.id,
      status: scrapeResult.success ? "SUCCESS" : "FAILED",
      priceCents: scrapeResult.priceCents,
      currency: scrapeResult.currency,
      scrapedTitle: scrapeResult.scrapedTitle,
      errorMessage: scrapeResult.errorMessage ?? null,
    });

    const comparison = this.priceComparisonService.evaluatePriceDrop(
      previousSuccessfulCheck?.priceCents ?? null,
      scrapeResult.success ? scrapeResult.priceCents : null,
      env.PRICE_DROP_THRESHOLD_PERCENT,
    );

    return {
      product,
      previousSuccessfulCheck,
      scrapeResult,
      comparison,
      priceCheck,
    };
  }
}
