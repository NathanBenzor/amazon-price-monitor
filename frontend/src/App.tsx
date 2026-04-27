import { useEffect, useMemo, useState } from "react";
import { fetchProductHistory, fetchProducts } from "./api/client";
import { PriceDropCard } from "./components/PriceDropCard";
import { ProductHistoryTable } from "./components/ProductHistoryTable";
import { ProductTable } from "./components/ProductTable";
import type {
  PriceDropEvent,
  ProductHistoryItem,
  ProductSummary,
} from "./types/api";
import { deriveLatestPriceDropEvent } from "./utils/priceDrops";
import "./styles.css";

function App() {
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null,
  );
  const [history, setHistory] = useState<ProductHistoryItem[]>([]);
  const [currentDropEvent, setCurrentDropEvent] =
    useState<PriceDropEvent | null>(null);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [productsError, setProductsError] = useState<string | null>(null);
  const [historyError, setHistoryError] = useState<string | null>(null);

  const selectedProduct = useMemo(() => {
    return products.find((product) => product.id === selectedProductId) ?? null;
  }, [products, selectedProductId]);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoadingProducts(true);
        setProductsError(null);

        const data = await fetchProducts();
        setProducts(data);

        if (data.length > 0 && !selectedProductId) {
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
  }, [selectedProductId]);

  useEffect(() => {
    async function loadHistory() {
      if (!selectedProductId) {
        setHistory([]);
        setCurrentDropEvent(null);
        return;
      }

      try {
        setLoadingHistory(true);
        setHistoryError(null);

        const data = await fetchProductHistory(selectedProductId);
        setHistory(data);

        const latestDropEvent = deriveLatestPriceDropEvent(data);

        setCurrentDropEvent((previousEvent) => {
          if (!latestDropEvent) {
            return null;
          }

          if (
            previousEvent &&
            previousEvent.latestCheckId === latestDropEvent.latestCheckId
          ) {
            return previousEvent;
          }

          return latestDropEvent;
        });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to load history";
        setHistoryError(message);
      } finally {
        setLoadingHistory(false);
      }
    }

    loadHistory();

    const intervalId = window.setInterval(() => {
      loadHistory();
    }, 20000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [selectedProductId]);

  return (
    <div className="app-shell">
      <h1>Amazon Price Monitor Dashboard</h1>

      <PriceDropCard product={selectedProduct} event={currentDropEvent} />

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
