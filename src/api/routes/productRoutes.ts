import { Router } from "express";
import { getProducts } from "../controllers/productController";

const productRoutes = Router();

productRoutes.get("/", getProducts);

export default productRoutes;
