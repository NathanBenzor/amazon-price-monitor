import express from "express";
import cors from "cors";
import healthRoutes from "./api/routes/healthRoutes";

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use("/api/health", healthRoutes);

  return app;
}
