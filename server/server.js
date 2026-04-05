import app from "./app.js"; // the actual Express application
import { createServer } from "http";
import { Server } from "socket.io";
import { PORT } from "./utils/config.js";
import { info } from "./utils/logger.js";

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Adjust to your frontend URL
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  info("User connected:", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId);
    info(`User ${userId} joined room`);
  });

  socket.on("sendMessage", (data) => {
    // Emit to receiver
    socket.to(data.receiverId).emit("receiveMessage", data);
  });

  socket.on("disconnect", () => {
    info("User disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  info(`Server running on port ${PORT}`);
});

export { io };
