import express from "express";
import {
  getAllNotesHandler,
  getNotesByFoodHandler,
  createNoteHandler,
} from "../controllers/noteController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Public routes
router.get("/", getAllNotesHandler);
router.get("/:foodId", getNotesByFoodHandler);

// Protected routes
router.post("/", verifyToken, createNoteHandler);

export default router;
