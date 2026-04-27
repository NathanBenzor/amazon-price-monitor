import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { AmazonScraper } from "./amazonScraper";

describe("AmazonScraper", () => {
  it("extracts title and price from fixture HTML", () => {
    const scraper = new AmazonScraper();
    const fixturePath = path.resolve("test/fixtures/amazon-product.html");
    const html = fs.readFileSync(fixturePath, "utf-8");

    const result = scraper.parseHtml(html);

    expect(result.success).toBe(true);
    expect(result.scrapedTitle).toBe("Echo Dot (5th Gen)");
    expect(result.priceCents).toBe(3999);
    expect(result.currency).toBe("USD");
  });
});
