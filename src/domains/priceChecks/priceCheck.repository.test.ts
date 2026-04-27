import { beforeAll, describe, expect, it } from "vitest";
import { prisma } from "../../infrastructure/db/prisma";
import { PriceCheckRepository } from "./priceCheck.repository";

describe("PriceCheckRepository", () => {
  const repository = new PriceCheckRepository();

  beforeAll(async () => {
    await prisma.product.upsert({
      where: { id: "test-product" },
      update: {},
      create: {
        id: "test-product",
        name: "Test Product",
        url: "https://amazon.com/dp/test-product",
        isActive: true,
      },
    });
  });

  it("creates and retrieves a price check", async () => {
    await repository.create({
      productId: "test-product",
      status: "SUCCESS",
      priceCents: 1999,
      currency: "USD",
      scrapedTitle: "Test Product Title",
      errorMessage: null,
    });

    const history = await repository.findByProductId("test-product");

    expect(history.length).toBeGreaterThan(0);
    expect(history[0].productId).toBe("test-product");
    expect(history[0].priceCents).toBe(1999);
    expect(history[0].status).toBe("SUCCESS");
  });
});
