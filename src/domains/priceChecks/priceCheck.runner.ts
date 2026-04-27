import { env } from "../../config/env";
import { logger } from "../../infrastructure/logging/logger";
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
      logger.warn({ productId }, "Price check requested for missing product");
      throw new Error(`Product not found for id: ${productId}`);
    }

    logger.info(
      {
        productId: product.id,
        productName: product.name,
        productUrl: product.url,
      },
      "Price check started",
    );

    const previousSuccessfulCheck =
      await this.priceCheckRepository.findLatestSuccessfulByProductId(
        product.id,
      );

    const scrapeResult = await this.amazonScraper.scrapeProduct(product.url);

    logger.info(
      {
        productId: product.id,
        scrapeSuccess: scrapeResult.success,
        scrapedTitle: scrapeResult.scrapedTitle,
        scrapedPriceCents: scrapeResult.priceCents,
        scrapeErrorMessage: scrapeResult.errorMessage ?? null,
      },
      "Scrape completed",
    );

    const priceCheck = await this.priceCheckRepository.create({
      productId: product.id,
      status: scrapeResult.success ? "SUCCESS" : "FAILED",
      priceCents: scrapeResult.priceCents,
      currency: scrapeResult.currency,
      scrapedTitle: scrapeResult.scrapedTitle,
      errorMessage: scrapeResult.errorMessage ?? null,
    });

    logger.info(
      {
        productId: product.id,
        priceCheckId: priceCheck.id,
        status: priceCheck.status,
        priceCents: priceCheck.priceCents,
      },
      "Price check persisted",
    );

    const comparison = this.priceComparisonService.evaluatePriceDrop(
      previousSuccessfulCheck?.priceCents ?? null,
      scrapeResult.success ? scrapeResult.priceCents : null,
      env.PRICE_DROP_THRESHOLD_PERCENT,
    );

    logger.info(
      {
        productId: product.id,
        previousPriceCents: comparison.previousPriceCents,
        currentPriceCents: comparison.currentPriceCents,
        deltaCents: comparison.deltaCents,
        deltaPercent: comparison.deltaPercent,
        dropped: comparison.dropped,
        meetsThreshold: comparison.meetsThreshold,
      },
      "Price comparison completed",
    );

    let notificationResult = null;

    if (
      comparison.meetsThreshold &&
      comparison.previousPriceCents !== null &&
      comparison.currentPriceCents !== null &&
      comparison.deltaCents !== null &&
      comparison.deltaPercent !== null
    ) {
      logger.info(
        {
          productId: product.id,
          previousPriceCents: comparison.previousPriceCents,
          currentPriceCents: comparison.currentPriceCents,
          deltaCents: comparison.deltaCents,
          deltaPercent: comparison.deltaPercent,
        },
        "Notification attempt started",
      );

      notificationResult = await this.notificationService.sendPriceDropAlert({
        productId: product.id,
        productName: product.name,
        productUrl: product.url,
        previousPriceCents: comparison.previousPriceCents,
        currentPriceCents: comparison.currentPriceCents,
        deltaCents: comparison.deltaCents,
        deltaPercent: comparison.deltaPercent,
      });

      if (notificationResult.success) {
        logger.info(
          { productId: product.id },
          "Notification sent successfully",
        );
      } else {
        logger.error(
          {
            productId: product.id,
            errorMessage: notificationResult.errorMessage ?? null,
          },
          "Notification failed",
        );
      }
    }

    logger.info({ productId: product.id }, "Price check finished");

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

    logger.info(
      { totalProducts: products.length },
      "Running checks for active products",
    );

    const settledResults = await Promise.allSettled(
      products.map(async (product) => {
        try {
          const result = await this.runCheckForProduct(product.id);

          return {
            productId: product.id,
            success: true as const,
            result,
          };
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : "Unknown error running scheduled check";

          logger.error(
            {
              productId: product.id,
              errorMessage: message,
            },
            "Price check failed for product",
          );

          return {
            productId: product.id,
            success: false as const,
            errorMessage: message,
          };
        }
      }),
    );

    return settledResults.map((item, index) => {
      if (item.status === "fulfilled") {
        return item.value;
      }

      const product = products[index];
      const message =
        item.reason instanceof Error
          ? item.reason.message
          : "Unknown promise rejection";

      logger.error(
        {
          productId: product?.id ?? "unknown",
          errorMessage: message,
        },
        "Price check promise rejected",
      );

      return {
        productId: product?.id ?? "unknown",
        success: false as const,
        errorMessage: message,
      };
    });
  }
}
