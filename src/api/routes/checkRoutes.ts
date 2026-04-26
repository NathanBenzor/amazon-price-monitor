import { Router } from "express";
import { runProductCheck } from "../controllers/checkController";

const checkRoutes = Router();

checkRoutes.post("/:productId", runProductCheck);

export default checkRoutes;
