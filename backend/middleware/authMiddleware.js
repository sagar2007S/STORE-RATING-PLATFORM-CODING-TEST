import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findByPk(decoded.id, {
        attributes: ["id", "name", "email", "role"],
      });

      if (!req.user) return res.status(401).json({ message: "Unauthorized" });

      next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
  }

  if (!token) return res.status(401).json({ message: "No token provided" });
};
