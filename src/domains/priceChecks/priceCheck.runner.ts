import { env } from "../../config/env";
import { AmazonScraper } from "../../infrastructure/scraping/amazonScraper";
import { NotificationService } from "../notifications/notification.service";
import { ProductService } from "../products/product.service";
import { PriceComparisonService } from "../priceComparison/priceComparison.service";
import { PriceCheckRepository } from "./priceCheck.repository";

export class PriceCheckRunner {
  private productService: ProductService;
  private priceCheckRepository: PriceCheckRepository;
  private amazonScraper: AmazonScraper;
  private priceComparisonService: PriceComparisonService;
  private notificationService: NotificationService;

  constructor() {
    this.productService = new ProductService();
    this.priceCheckRepository = new PriceCheckRepository();
    this.amazonScraper = new AmazonScraper();
    this.priceComparisonService = new PriceComparisonService();
    this.notificationService = new NotificationService();
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

    let notificationResult = null;

    if (
      comparison.meetsThreshold &&
      comparison.previousPriceCents !== null &&
      comparison.currentPriceCents !== null &&
      comparison.deltaCents !== null &&
      comparison.deltaPercent !== null
    ) {
      notificationResult = await this.notificationService.sendPriceDropAlert({
        productId: product.id,
        productName: product.name,
        productUrl: product.url,
        previousPriceCents: comparison.previousPriceCents,
        currentPriceCents: comparison.currentPriceCents,
        deltaCents: comparison.deltaCents,
        deltaPercent: comparison.deltaPercent,
      });
    }

    return {
      product,
      previousSuccessfulCheck,
      scrapeResult,
      comparison,
      notificationResult,
      priceCheck,
    };
  }

  async runAllChecks() {
    const products = await this.productService.getActiveProducts();

    const results = [];

    for (const product of products) {
      try {
        const result = await this.runCheckForProduct(product.id);
        results.push({
          productId: product.id,
          success: true,
          result,
        });
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Unknown error running scheduled check";

        results.push({
          productId: product.id,
          success: false,
          errorMessage: message,
        });
      }
    }

    return results;
  }
}
