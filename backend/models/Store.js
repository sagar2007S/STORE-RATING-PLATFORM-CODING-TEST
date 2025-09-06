import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./User.js";

const Store = sequelize.define(
  "Store",
  {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.STRING, allowNull: false },

    
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: true, // allow stores without an owner
      references: {
        model: "Users", 
        key: "id",
      },
    },
  },
  {
    timestamps: true,
  }
);

// Associations and relationship between database model 
User.hasMany(Store, { foreignKey: "ownerId", as: "Stores" });
Store.belongsTo(User, { foreignKey: "ownerId", as: "Owner" });

export default Store;
