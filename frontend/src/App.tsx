import { useEffect, useState } from "react";
import { fetchProductHistory, fetchProducts } from "./api/client";
import { ProductHistoryTable } from "./components/ProductHistoryTable";
import { ProductTable } from "./components/ProductTable";
import type { ProductHistoryItem, ProductSummary } from "./types/api";
import "./styles.css";

function App() {
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null,
  );
  const [history, setHistory] = useState<ProductHistoryItem[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [productsError, setProductsError] = useState<string | null>(null);
  const [historyError, setHistoryError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoadingProducts(true);
        setProductsError(null);

        const data = await fetchProducts();
        setProducts(data);

        if (data.length > 0) {
          setSelectedProductId(data[0].id);
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to load products";
        setProductsError(message);
      } finally {
        setLoadingProducts(false);
      }
    }

    loadProducts();
  }, []);

  useEffect(() => {
    async function loadHistory() {
      if (!selectedProductId) {
        setHistory([]);
        return;
      }

      try {
        setLoadingHistory(true);
        setHistoryError(null);

        const data = await fetchProductHistory(selectedProductId);
        setHistory(data);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to load history";
        setHistoryError(message);
      } finally {
        setLoadingHistory(false);
      }
    }

    loadHistory();
  }, [selectedProductId]);

  return (
    <div className="app-shell">
      <h1>Amazon Price Monitor Dashboard</h1>

      {loadingProducts ? (
        <p>Loading products...</p>
      ) : productsError ? (
        <p>{productsError}</p>
      ) : (
        <ProductTable
          products={products}
          selectedProductId={selectedProductId}
          onSelectProduct={setSelectedProductId}
        />
      )}

      <div className="history-section">
        {loadingHistory ? (
          <p>Loading history...</p>
        ) : historyError ? (
          <p>{historyError}</p>
        ) : (
          <ProductHistoryTable history={history} />
        )}
      </div>
    </div>
  );
}

export default App;
