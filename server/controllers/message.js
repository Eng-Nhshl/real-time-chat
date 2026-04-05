import express from "express";
import Message from "../models/Message.js";
import User from "../models/User.js";
import { io } from "../server.js";

const router = express.Router();

// Get messages between two users
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  const currentUserId = req.user.id; // Assuming middleware sets req.user

  console.log(
    "Fetching messages for userId:",
    userId,
    "currentUserId:",
    currentUserId,
  );

  const messages = await Message.find({
    $or: [
      { senderId: currentUserId, receiverId: userId },
      { senderId: userId, receiverId: currentUserId },
    ],
  }).sort({ createdAt: 1 });

  res.json(messages);
});

// Send a message
router.post("/send/:receiverId", async (req, res) => {
  const { receiverId } = req.params;
  const { text, image } = req.body;
  const senderId = req.user.id;

  const receiver = await User.findById(receiverId);
  if (!receiver) {
    return res.status(404).json({ error: "User not found" });
  }

  const message = new Message({
    senderId,
    receiverId,
    text,
    image,
  });

  await message.save();

  // Emit to receiver
  console.log("Emitting receiveMessage to room:", receiverId);
  io.to(receiverId).emit("receiveMessage", message);

  res.status(201).json(message);
});

export default router;
