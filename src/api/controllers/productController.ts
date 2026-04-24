import { Request, Response } from "express";
import { ProductService } from "../../domains/products/product.service";

const productService = new ProductService();

export async function getProducts(_req: Request, res: Response) {
  const products = await productService.getAllProducts();

  res.status(200).json(products);
}
