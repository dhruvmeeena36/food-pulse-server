import express from "express";
import {
  getAllFoodsHandler,
  getMyFoodsHandler,
  getFoodByIdHandler,
  getExpiredFoodsHandler,
  getExpiringFoodsHandler,
  getCategoryFoodsHandler,
  searchFoodsHandler,
  createFoodHandler,
  updateFoodHandler,
  deleteFoodHandler,
} from "../controllers/foodController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Protected routes
router.post("/", verifyToken, createFoodHandler);
router.get("/my-foods", verifyToken, getMyFoodsHandler);
router.get("/expired-foods", verifyToken, getExpiredFoodsHandler);
router.get("/expiring-soon", verifyToken, getExpiringFoodsHandler);
router.get("/search", verifyToken, searchFoodsHandler);
router.get("/category", verifyToken, getCategoryFoodsHandler);
router.get("/:id", verifyToken, getFoodByIdHandler);
router.put("/:id", verifyToken, updateFoodHandler);
router.delete("/:id", verifyToken, deleteFoodHandler);

export default router;
