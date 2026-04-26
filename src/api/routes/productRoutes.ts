import { Router } from "express";
import {
  getProducts,
  getProductHistory,
} from "../controllers/productController";

const productRoutes = Router();

productRoutes.get("/", getProducts);
productRoutes.get("/:productId/history", getProductHistory);

export default productRoutes;
