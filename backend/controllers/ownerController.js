import Store from "../models/Store.js";
import Rating from "../models/Rating.js";
import User from "../models/User.js";

export const getOwnerRatings = async (req, res) => {
  try {
    // Owner's ID comes from JWT 
    const ownerId = req.user.id;

    // Get all stores owned by this owner
    const stores = await Store.findAll({ where: { ownerId } });
    const storeIds = stores.map((s) => s.id);

    if (storeIds.length === 0) {
      return res.json({ ratings: [], averageRating: null });
    }

    // Get ratings for owned stores
    const ratings = await Rating.findAll({
      where: { storeId: storeIds },
      include: [{ model: User, attributes: ["id", "name", "email"] }],
    });

    
    const averageRating =
      ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
        : null;

    
    const formattedRatings = ratings.map((r) => ({
      userId: r.User.id,
      userName: r.User.name,
      userEmail: r.User.email,
      rating: r.rating,
    }));

    res.json({ ratings: formattedRatings, averageRating });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch ratings" });
  }
};
