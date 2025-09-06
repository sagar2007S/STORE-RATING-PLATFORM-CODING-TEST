// For seeding and initalizing default admin 
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import sequelize from "./config/db.js";
import User from "./models/User.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");

    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    const [admin, created] = await User.findOrCreate({
      where: { email: "admin@roxiller.com" },
      defaults: {
        name: "Default Admin User",
        email: "admin@roxiller.com",
        address: "HQ",
        password: hashedPassword,
        role: "admin",
      },
    });

    if (created) {
      console.log("Admin user created:");
    } else {
      console.log("Admin user already exists:");
    }

    console.log({
      email: admin.email,
      password: "Admin@123",
      role: admin.role,
    });

    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed", err);
    process.exit(1);
  }
};

seedAdmin();
