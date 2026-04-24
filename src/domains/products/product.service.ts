import { loadProductsConfig } from "../../config/products";
import { TrackedProduct } from "./product.types";

export class ProductService {
  getAllProducts(): TrackedProduct[] {
    return loadProductsConfig();
  }

  getActiveProducts(): TrackedProduct[] {
    return this.getAllProducts().filter((product) => product.isActive);
  }
}
