import type { ProductHistoryItem, ProductSummary } from "../types/api";

const API_BASE_URL = "http://localhost:4000/api";

export async function fetchProducts(): Promise<ProductSummary[]> {
  const response = await fetch(`${API_BASE_URL}/products`);

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json();
}

export async function fetchProductHistory(
  productId: string,
): Promise<ProductHistoryItem[]> {
  const response = await fetch(`${API_BASE_URL}/products/${productId}/history`);

  if (!response.ok) {
    throw new Error("Failed to fetch product history");
  }

  return response.json();
}
