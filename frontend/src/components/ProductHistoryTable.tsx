import type { ProductHistoryItem } from "../types/api";

type ProductHistoryTableProps = {
  history: ProductHistoryItem[];
};

function formatPrice(priceCents: number | null): string {
  if (priceCents === null) {
    return "—";
  }

  return `$${(priceCents / 100).toFixed(2)}`;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString();
}

export function ProductHistoryTable({ history }: ProductHistoryTableProps) {
  return (
    <div>
      <h2>Price History</h2>

      {history.length === 0 ? (
        <p>No history available.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: "8px" }}>Checked At</th>
              <th style={{ textAlign: "left", padding: "8px" }}>Price</th>
              <th style={{ textAlign: "left", padding: "8px" }}>Status</th>
              <th style={{ textAlign: "left", padding: "8px" }}>
                Error Message
              </th>
            </tr>
          </thead>
          <tbody>
            {history.map((item) => (
              <tr key={item.id}>
                <td style={{ padding: "8px" }}>{formatDate(item.checkedAt)}</td>
                <td style={{ padding: "8px" }}>
                  {formatPrice(item.priceCents)}
                </td>
                <td style={{ padding: "8px" }}>{item.status}</td>
                <td style={{ padding: "8px" }}>{item.errorMessage ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
