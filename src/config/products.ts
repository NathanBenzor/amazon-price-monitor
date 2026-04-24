import fs from "node:fs";
import path from "node:path";
import { TrackedProduct } from "../domains/products/product.types";

function isTrackedProduct(value: unknown): value is TrackedProduct {
  if (!value || typeof value !== "object") {
    return false;
  }

  const product = value as Record<string, unknown>;

  return (
    typeof product.id === "string" &&
    typeof product.name === "string" &&
    typeof product.url === "string" &&
    typeof product.isActive === "boolean"
  );
}

export function loadProductsConfig(): TrackedProduct[] {
  const filePath = path.join(__dirname, "products.json");
  const fileContents = fs.readFileSync(filePath, "utf-8");
  const parsed = JSON.parse(fileContents) as unknown;

  if (!Array.isArray(parsed)) {
    throw new Error("products.json must contain an array of products");
  }

  const invalidProduct = parsed.find((item) => !isTrackedProduct(item));

  if (invalidProduct) {
    throw new Error("products.json contains an invalid product entry");
  }

  return parsed;
}
