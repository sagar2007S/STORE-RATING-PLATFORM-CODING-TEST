import Sequelize from "sequelize";
import sequelize from "../config/db.js"; //My sequelize instance
import UserModel from "./User.js";
import StoreModel from "./Store.js";
import RatingModel from "./Rating.js";

const User = typeof UserModel === "function" && UserModel.length === 2
  ? UserModel(sequelize, Sequelize.DataTypes)
  : UserModel; 


const Store = typeof StoreModel === "function" && StoreModel.length === 2
  ? StoreModel(sequelize, Sequelize.DataTypes)
  : StoreModel;

const Rating = typeof RatingModel === "function" && RatingModel.length === 2
  ? RatingModel(sequelize, Sequelize.DataTypes)
  : RatingModel;


//a User can own many Stores, Store belongsTo User using Order id
User.hasMany(Store, { foreignKey: "ownerId", as: "Stores" });
Store.belongsTo(User, { foreignKey: "ownerId", as: "Owner" });


User.hasMany(Rating, { foreignKey: "userId", as: "Ratings" });
Rating.belongsTo(User, { foreignKey: "userId", as: "User" });


Store.hasMany(Rating, { foreignKey: "storeId", as: "Ratings" });
Rating.belongsTo(Store, { foreignKey: "storeId", as: "Store" });

// Exporting a single object so other files import from one place
export { sequelize };
export default {
  sequelize,
  Sequelize,
  User,
  Store,
  Rating,
};
