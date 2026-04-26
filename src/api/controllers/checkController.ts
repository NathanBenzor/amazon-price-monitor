import { Request, Response } from "express";
import { PriceCheckRunner } from "../../domains/priceChecks/priceCheck.runner";

const priceCheckRunner = new PriceCheckRunner();

export async function runProductCheck(req: Request, res: Response) {
  const { productId } = req.params;

  if (typeof productId !== "string") {
    return res.status(400).json({
      error: "Invalid productId parameter",
    });
  }

  try {
    const result = await priceCheckRunner.runCheckForProduct(productId);

    res.status(200).json(result);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unknown error running price check";

    res.status(500).json({
      error: message,
    });
  }
}
