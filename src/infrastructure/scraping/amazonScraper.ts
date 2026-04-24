import axios from "axios";
import * as cheerio from "cheerio";
import { ScrapeResult } from "../../domains/priceChecks/priceCheck.types";

export class AmazonScraper {
  async scrapeProduct(url: string): Promise<ScrapeResult> {
    try {
      const response = await axios.get(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
          "Accept-Language": "en-US,en;q=0.9",
        },
        timeout: 10000,
      });

      return this.parseHtml(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          scrapedTitle: null,
          priceCents: null,
          currency: "USD",
          errorMessage: `HTTP ${error.response?.status ?? "unknown"} while fetching product page`,
        };
      }

      const message =
        error instanceof Error ? error.message : "Unknown scraping error";

      return {
        success: false,
        scrapedTitle: null,
        priceCents: null,
        currency: "USD",
        errorMessage: message,
      };
    }
  }

  parseHtml(html: string): ScrapeResult {
    const $ = cheerio.load(html);

    const scrapedTitle = this.extractTitle($);
    const priceText = this.extractPriceText($);
    const priceCents = priceText ? this.parsePriceToCents(priceText) : null;

    if (!scrapedTitle && priceCents === null) {
      return {
        success: false,
        scrapedTitle: null,
        priceCents: null,
        currency: "USD",
        errorMessage: "Failed to extract title and price from HTML",
      };
    }

    return {
      success: true,
      scrapedTitle,
      priceCents,
      currency: "USD",
    };
  }

  private extractTitle($: cheerio.CheerioAPI): string | null {
    const candidates = [
      "#productTitle",
      "span#productTitle",
      "h1 span#productTitle",
    ];

    for (const selector of candidates) {
      const value = $(selector).first().text().trim();
      if (value) return value;
    }

    return null;
  }

  private extractPriceText($: cheerio.CheerioAPI): string | null {
    const value =
      $(".a-price .a-offscreen").first().text().trim() ||
      $("#priceblock_ourprice").first().text().trim() ||
      $("#priceblock_dealprice").first().text().trim() ||
      $("#price_inside_buybox").first().text().trim();

    return value || null;
  }

  private parsePriceToCents(priceText: string): number | null {
    const cleaned = priceText.replace(/[^0-9.]/g, "");
    const amount = Number.parseFloat(cleaned);

    if (Number.isNaN(amount)) {
      return null;
    }

    return Math.round(amount * 100);
  }
}
