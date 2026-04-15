import express from "express";
import { registerHandler, loginHandler } from "../controllers/authController.js";

const router = express.Router();

// Public routes
router.post("/register", registerHandler);
router.post("/login", loginHandler);

export default router;