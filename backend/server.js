import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from"./routes/adminRoutes.js";
import ownerRoutes from"./routes/ownerRoutes.js";
import storeRoutes from "./routes/storeRoutes.js";
import rateLimit from "express-rate-limit";
import errorHandler from "./middleware/errorHandler.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, 
  message: { error: "Too many auth requests from this IP, please try again later." },
});

app.use("/api/auth", authLimiter, authRoutes);

// Routes Middlewares
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/owner", ownerRoutes);
app.use("/api/stores" , storeRoutes);

const PORT = process.env.PORT || 5000;





sequelize
  .sync()
  .then(() => {
    console.log("Database synced");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Failed to sync DB or start server", err);
  });

// Centralized error handler 
app.use(errorHandler);

