import type { PriceDropEvent, ProductSummary } from "../types/api";

type PriceDropCardProps = {
  product: ProductSummary | null;
  event: PriceDropEvent | null;
};

function formatPrice(priceCents: number): string {
  return `$${(priceCents / 100).toFixed(2)}`;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString();
}

export function PriceDropCard({ product, event }: PriceDropCardProps) {
  if (!product || !event) {
    return null;
  }

  return (
    <div
      style={{
        background: "#ecfdf5",
        border: "1px solid #10b981",
        borderRadius: "8px",
        padding: "16px",
        marginBottom: "24px",
      }}
    >
      <h2 style={{ marginTop: 0, color: "#10b981" }}>Price Drop Detected</h2>
      <p>
        <strong>Product:</strong> {product.name}
      </p>
      <p>
        <strong>Previous Price:</strong> {formatPrice(event.previousPriceCents)}
      </p>
      <p>
        <strong>Current Price:</strong> {formatPrice(event.currentPriceCents)}
      </p>
      <p>
        <strong>Drop Amount:</strong> {formatPrice(Math.abs(event.deltaCents))}{" "}
        ({event.deltaPercent.toFixed(2)}%)
      </p>
      <p>
        <strong>Detected At:</strong> {formatDate(event.checkedAt)}
      </p>
    </div>
  );
}
