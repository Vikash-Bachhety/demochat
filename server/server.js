const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");
require('dotenv').config();

const app = express();

app.use(cors("https://demochat-omega.vercel.app"));
// app.use(cors("http://localhost:5173"));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    // origin: "https://demochat-omega.vercel.app",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.emit("message", {message: "Welcome to the chat app!", id: socket.id});

  socket.on("send_message", (data) => {
    io.emit("receive_message", { message: data.message, userId: socket.id });
  });

  // socket.on("disconnect", () => {
  //   io.emit("user_left", { message: "A user has left the chat." });
  //   console.log(`Socket disconnected: ${socket.id}`);
  // });
});

const PORT = 3000 || process.env.PORT;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
