
import Store from "../models/Store.js";
import Rating from "../models/Rating.js";
import User from "../models/User.js";
import { isValidEmail, validateAddress } from "../utils/validators.js";

//Get all stores with average rating
export const getStores = async (req, res, next) => {
  try {
    const stores = await Store.findAll({
      include: [{ model: Rating, attributes: ["rating"] }],
    });

    const formattedStores = stores.map((store) => {
      const ratings = store.Ratings || [];
      const avg =
        ratings.length > 0
          ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
          : null;

      return {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        averageRating: avg,
      };
    });

    res.json(formattedStores);
  } catch (err) {
    next(err);
  }
};

export const rateStore = async (req, res, next) => {
  try {
    const { rating } = req.body;
    const { id: storeId } = req.params;
    const userId = req.user.id; // from JWT

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be an integer between 1 and 5" });
    }

    // verify store exists
    const store = await Store.findByPk(storeId);
    if (!store) return res.status(404).json({ error: "Store not found" });

    // checking if user already rated this store
    let existing = await Rating.findOne({ where: { userId, storeId } });

    if (existing) {
      existing.rating = rating;
      await existing.save();
      return res.json({ message: "Rating updated", rating: existing });
    }

    const newRating = await Rating.create({ rating, userId, storeId });
    res.json({ message: "Rating added", rating: newRating });
  } catch (err) {
    next(err);
  }
};
