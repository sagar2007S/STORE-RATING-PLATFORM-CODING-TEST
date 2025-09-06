import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./User.js";
import Store from "./Store.js";

const Rating = sequelize.define("Rating", {
  rating: { type: DataTypes.INTEGER, allowNull: false }
}, { 
  timestamps: true   
});

// Relations
User.hasMany(Rating, { foreignKey: "userId" });
Rating.belongsTo(User, { foreignKey: "userId" });

Store.hasMany(Rating, { foreignKey: "storeId" });
Rating.belongsTo(Store, { foreignKey: "storeId" });

export default Rating;
