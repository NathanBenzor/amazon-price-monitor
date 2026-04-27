import type { ProductSummary } from "../types/api";

type ProductTableProps = {
  products: ProductSummary[];
  selectedProductId: string | null;
  onSelectProduct: (productId: string) => void;
};

function formatPrice(priceCents: number | null): string {
  if (priceCents === null) {
    return "—";
  }

  return `$${(priceCents / 100).toFixed(2)}`;
}

function formatDate(dateString: string | null): string {
  if (!dateString) {
    return "—";
  }

  return new Date(dateString).toLocaleString();
}

export function ProductTable({
  products,
  selectedProductId,
  onSelectProduct,
}: ProductTableProps) {
  return (
    <div>
      <h2>Tracked Products</h2>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", padding: "8px" }}>Name</th>
            <th style={{ textAlign: "left", padding: "8px" }}>Latest Price</th>
            <th style={{ textAlign: "left", padding: "8px" }}>Last Checked</th>
            <th style={{ textAlign: "left", padding: "8px" }}>Status</th>
            <th style={{ textAlign: "left", padding: "8px" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const isSelected = selectedProductId === product.id;

            return (
              <tr
                key={product.id}
                style={{
                  backgroundColor: isSelected ? "#f3f4f6" : "transparent",
                }}
              >
                <td style={{ padding: "8px" }}>{product.name}</td>
                <td style={{ padding: "8px" }}>
                  {formatPrice(product.latestPriceCents)}
                </td>
                <td style={{ padding: "8px" }}>
                  {formatDate(product.lastCheckedAt)}
                </td>
                <td style={{ padding: "8px" }}>{product.lastStatus ?? "—"}</td>
                <td style={{ padding: "8px" }}>
                  <button onClick={() => onSelectProduct(product.id)}>
                    View History
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
