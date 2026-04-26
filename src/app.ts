import express from "express";
import cors from "cors";
import healthRoutes from "./api/routes/healthRoutes";
import productRoutes from "./api/routes/productRoutes";
import checkRoutes from "./api/routes/checkRoutes";

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use("/api/health", healthRoutes);
  app.use("/api/products", productRoutes);
  app.use("/api/checks", checkRoutes);

  return app;
}
