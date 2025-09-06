import express from "express";
import { getStats, getUsers, createUser, getStores, createStore } from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";
import { updateUserRole } from "../controllers/adminController.js";

const router = express.Router();

// middleware to protect all admin routes
router.use(protect);

// for Dashboard stats
router.get("/stats", getStats);

// for Users
router.get("/users", getUsers);
router.post("/users", createUser);

// for Stores
router.get("/stores", getStores);
router.post("/stores", createStore);


router.patch("/users/:id/role", updateUserRole);


export default router;
