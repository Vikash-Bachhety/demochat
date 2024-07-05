const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`socket connected ${socket.id}`);

  socket.on("send_message", (data) => {
    io.emit("receive_message", data); // Broadcast to all clients
  });
});

server.listen(3000, () => {
  console.log("Server is connected at 3000");
});
