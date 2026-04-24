import { Request, Response } from "express";
import { ProductService } from "../../domains/products/product.service";

const productService = new ProductService();

export function getProducts(_req: Request, res: Response) {
  const products = productService.getAllProducts();

  res.status(200).json(products);
}
