import express from "express";
import { protectEducator } from "../middlewares/authMiddleware.js";
import {
  createPromoCode,
  getAllPromoCodes,
  redeemCode,
} from "../controllers/promoCodeController.js";

const promoCodeRouter = express.Router();

promoCodeRouter.post("/generate", protectEducator, createPromoCode);
promoCodeRouter.get("/all", protectEducator, getAllPromoCodes);
promoCodeRouter.post("/redeem", redeemCode);

export default promoCodeRouter;
