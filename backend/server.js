const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const protect = require("./middleware/authMiddleware");

dotenv.config();
connectDB();

const app = express();

/* ======================
   MIDDLEWARE
====================== */
app.use(cors());
app.use(express.json());

/* ======================
   BASIC ROUTE
====================== */
app.get("/", (req, res) => {
  res.send("Server running...");
});

/* ======================
   AUTH ROUTES
====================== */
app.use("/api/auth", authRoutes);

/* ======================
   PROTECTED TEST ROUTE
====================== */
app.get("/api/protected", protect, (req, res) => {
  res.json({
    message: "You are authorized",
    userId: req.user,
  });
});

/* ======================
   CREATE HTTP SERVER
====================== */
const server = http.createServer(app);

/* ======================
   SOCKET.IO SETUP
====================== */
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

/* ======================
   REAL-TIME LOGIC
====================== */

// Track joined users (max 3)
let joinedUsers = [];

io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  /* -------- JOIN GENERAL GROUP -------- */
  socket.on("joinGeneral", (userId) => {
    socket.join("general");

    if (!joinedUsers.includes(userId)) {
      joinedUsers.push(userId);
    }

    console.log("Joined Users:", joinedUsers);

    // Send updated user count to room
    io.to("general").emit("userCount", joinedUsers.length);

    // Activate chat when 3 users joined
    if (joinedUsers.length === 3) {
      io.to("general").emit("chatActivated");
    }
  });

  /* -------- SEND MESSAGE -------- */
  socket.on("sendMessage", (messageData) => {
    io.to("general").emit("receiveMessage", messageData);
  });

  /* -------- DISCONNECT -------- */
  socket.on("disconnect", () => {
    console.log("User Disconnected:", socket.id);
  });

  socket.on("typing", (email) => {
  socket.broadcast.emit("showTyping", email);
});

socket.on("stopTyping", () => {
  socket.broadcast.emit("hideTyping");
});

});

/* ======================
   START SERVER
====================== */
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
