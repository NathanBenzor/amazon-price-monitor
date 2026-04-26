import { Request, Response } from "express";
import { ProductService } from "../../domains/products/product.service";
import { PriceCheckRepository } from "../../domains/priceChecks/priceCheck.repository";

const productService = new ProductService();
const priceCheckRepository = new PriceCheckRepository();

export async function getProducts(_req: Request, res: Response) {
  const products = await productService.getAllProducts();
  res.status(200).json(products);
}

export async function getProductHistory(req: Request, res: Response) {
  const { productId } = req.params;

  if (typeof productId !== "string") {
    return res.status(400).json({
      error: "Invalid productId parameter",
    });
  }

  const history = await priceCheckRepository.findByProductId(productId);

  res.status(200).json(history);
}
