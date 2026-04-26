import { prisma } from "../../infrastructure/db/prisma";
import { CreatePriceCheckInput } from "./priceCheck.types";

export class PriceCheckRepository {
  async create(input: CreatePriceCheckInput) {
    return prisma.priceCheck.create({
      data: {
        productId: input.productId,
        status: input.status,
        priceCents: input.priceCents,
        currency: input.currency,
        scrapedTitle: input.scrapedTitle,
        errorMessage: input.errorMessage,
      },
    });
  }

  async findByProductId(productId: string) {
    return prisma.priceCheck.findMany({
      where: { productId },
      orderBy: {
        checkedAt: "desc",
      },
    });
  }

  async findLatestByProductId(productId: string) {
    return prisma.priceCheck.findFirst({
      where: { productId },
      orderBy: {
        checkedAt: "desc",
      },
    });
  }

  async findLatestSuccessfulByProductId(productId: string) {
    return prisma.priceCheck.findFirst({
      where: {
        productId,
        status: "SUCCESS",
        priceCents: {
          not: null,
        },
      },
      orderBy: {
        checkedAt: "desc",
      },
    });
  }
}
