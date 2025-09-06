import User from "../models/User.js";
import Store from "../models/Store.js";
import Rating from "../models/Rating.js";
import bcrypt from "bcrypt";
import {
  validateName,
  isValidEmail,
  validateAddress,
  validatePassword,
} from "../utils/validators.js";

//Dashboard stats
export const getStats = async (req, res, next) => {
  try {
    const users = await User.count();
    const stores = await Store.count();
    const ratings = await Rating.count();

    res.json({ users, stores, ratings });
  } catch (err) {
    next(err);
  }
};

//Manage Users
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "name", "email", "address", "role"],
    });
    res.json(users);
  } catch (err) {
    next(err);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const { name, email, address, password, role } = req.body;

    //validations
    const nameErr = validateName(name);
    if (nameErr) return res.status(400).json({ error: nameErr });

    if (!isValidEmail(email))
      return res.status(400).json({ error: "Invalid email" });

    const addrErr = validateAddress(address);
    if (addrErr) return res.status(400).json({ error: addrErr });

    const pwdErr = validatePassword(password);
    if (pwdErr) return res.status(400).json({ error: pwdErr });

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser)
      return res.status(400).json({ error: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase(),
      address,
      password: hashedPassword,
      role,
    });
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

export const getStores = async (req, res, next) => {
  try {
    const stores = await Store.findAll({
      include: [
        {
          model: Rating,
          as: "Ratings",
          attributes: ["rating"],
          required: false,
        },
        {
          model: User,
          as: "Owner",
          attributes: ["id", "name", "email"],
          required: false,
        },
      ],
    });

    const formatted = stores.map((store) => {
      const ratings = store.Ratings || [];
      const avg = ratings.length
        ? ratings.reduce((s, r) => s + r.rating, 0) / ratings.length
        : null;
      return {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        ownerId: store.Owner ? store.Owner.id : null,
        ownerName: store.Owner ? store.Owner.name : null,
        rating: avg,
        averageRating: avg,
      };
    });

    res.json(formatted);
  } catch (err) {
    next(err);
  }
};

export const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    if (!role || !["user", "owner", "admin"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.role = role;
    await user.save();

    res.json({
      message: "Role updated",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const createStore = async (req, res, next) => {
  try {
    const { name, email, address, ownerId } = req.body;

    if (!name || !name.trim())
      return res.status(400).json({ error: "Store name is required." });
    if (!isValidEmail(email))
      return res.status(400).json({ error: "Invalid email" });
    const addrErr = validateAddress(address);
    if (addrErr) return res.status(400).json({ error: addrErr });

    const store = await Store.create({
      name: name.trim(),
      email: email.toLowerCase(),
      address,
      ownerId,
    });
    res.status(201).json(store);
  } catch (err) {
    next(err);
  }
};
