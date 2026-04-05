import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Register user
router.post("/signup", async (req, res) => {
  const { fullName, email, password, bio } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ email }, { fullName }],
  });

  if (existingUser) {
    return res.status(400).json({
      error: "User with this email or name already exists",
    });
  }

  // Create new user
  const user = new User({
    fullName,
    email,
    password,
    bio,
  });

  await user.save();

  // Generate token
  const token = generateToken(user._id);

  res.status(201).json({
    message: "User registered successfully",
    token,
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      bio: user.bio,
    },
  });
});

// Login user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ error: "Invalid email or password" });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(400).json({ error: "Invalid email or password" });
  }

  const token = generateToken(user._id);

  res.json({
    message: "Login successful",
    token,
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      bio: user.bio,
    },
  });
});

// Get all users except current
router.get("/", async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "authentication required" });
  }
  const users = await User.find({ _id: { $ne: req.user.id } }).select(
    "-password",
  );
  res.json(users);
});

// Get current user profile
router.get("/profile", async (req, res) => {
  res.json(req.user);
});

// Update current user profile
router.put("/profile", async (req, res) => {
  const { fullName, bio, profilePic } = req.body;
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  user.fullName = fullName || user.fullName;
  user.bio = bio || user.bio;
  user.profilePic = profilePic || user.profilePic;
  await user.save();
  res.json(user);
});

export default router;
