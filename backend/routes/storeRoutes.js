import express from "express";
import { getStores, rateStore } from "../controllers/storeController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// browse stores
router.get("/", getStores);

// submit rating
router.post("/:id/rate", protect, rateStore);

export default router;
