import express from "express";
import { getOwnerRatings } from "../controllers/ownerController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

// Owner ratings dashboard
router.get("/ratings", getOwnerRatings);

export default router;
