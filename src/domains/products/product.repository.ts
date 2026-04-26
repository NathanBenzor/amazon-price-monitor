import { prisma } from "../../infrastructure/db/prisma";
import { TrackedProduct } from "./product.types";

export class ProductRepository {
  async findAll() {
    return prisma.product.findMany({
      orderBy: {
        name: "asc",
      },
    });
  }

  async findActive() {
    return prisma.product.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        name: "asc",
      },
    });
  }

  async findById(productId: string) {
    return prisma.product.findUnique({
      where: { id: productId },
    });
  }

  async upsertMany(products: TrackedProduct[]) {
    await Promise.all(
      products.map((product) =>
        prisma.product.upsert({
          where: { id: product.id },
          update: {
            name: product.name,
            url: product.url,
            isActive: product.isActive,
          },
          create: {
            id: product.id,
            name: product.name,
            url: product.url,
            isActive: product.isActive,
          },
        }),
      ),
    );
  }
}
