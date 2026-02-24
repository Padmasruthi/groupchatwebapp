const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

dotenv.config();
connectDB();

const app = express();

/* MIDDLEWARE */
app.use(cors());
app.use(express.json());

/* ROUTES */
app.get("/", (req, res) => {
  res.send("Server running...");
});

app.use("/api/auth", authRoutes);

/* CREATE SERVER */
const server = http.createServer(app);

/* SOCKET.IO */
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

let joinedUsers = new Set();

io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  socket.on("joinGeneral", (userId) => {
    socket.join("general");
    socket.userId = userId;

    joinedUsers.add(userId);

    io.to("general").emit("userCount", joinedUsers.size);

    if (joinedUsers.size === 3) {
      io.to("general").emit("chatActivated");
    }
  });

  socket.on("sendMessage", (data) => {
    io.to("general").emit("receiveMessage", data);
  });

  socket.on("typing", (name) => {
    socket.to("general").emit("showTyping", name);
  });

  socket.on("stopTyping", () => {
    socket.to("general").emit("hideTyping");
  });

  socket.on("disconnect", () => {
    if (socket.userId) {
      joinedUsers.delete(socket.userId);
    }

    io.to("general").emit("userCount", joinedUsers.size);

    if (joinedUsers.size < 3) {
      io.to("general").emit("chatDeactivated");
    }
  });
});

/* START */
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log("Server running on port", PORT);
});