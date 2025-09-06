import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import {
  validateName,
  isValidEmail,
  validatePassword,
  validateAddress,
} from "../utils/validators.js";

//Handling Signup
export const signup = async (req, res, next) => {
  try {
    const { name, email, address, password, role } = req.body;

    const nameErr = validateName(name);
    if (nameErr) return res.status(400).json({ error: nameErr });

    if (!isValidEmail(email))
      return res.status(400).json({ error: "Invalid email" });

    const addrErr = validateAddress(address);
    if (addrErr) return res.status(400).json({ error: addrErr });

    const pwdErr = validatePassword(password);
    if (pwdErr) return res.status(400).json({ error: pwdErr });

    // Checking if user already exists
    const existingUser = await User.findOne({
      where: { email: email.toLowerCase() },
    });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hashing password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase(),
      address,
      password: hashedPassword,
      role: role || "user",
    });

    res.status(201).json({ message: "User created successfully", user });
  } catch (err) {
    next(err);
  }
};

//Handling Login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!isValidEmail(email))
      return res.status(400).json({ error: "Invalid credentials" });
    if (!password)
      return res.status(400).json({ error: "Invalid credentials" });

    const user = await User.findOne({ where: { email: email.toLowerCase() } });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    //Setting up Json web tokens to share data from user to server
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.json({
      message: "Login successful",
      token,
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

export const changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    if (!oldPassword)
      return res.status(400).json({ error: "Old password is required" });

    const pwdErr = validatePassword(newPassword);
    if (pwdErr) return res.status(400).json({ error: pwdErr });

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ error: "Old password is incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    next(err);
  }
};
