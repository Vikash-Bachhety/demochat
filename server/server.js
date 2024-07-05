const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");
require('dotenv').config();

const app = express();
app.use(cors("https://demochat-omega.vercel.app"));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://demochat-omega.vercel.app",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`socket connected ${socket.id}`);

  socket.on("send_message", (data) => {
    io.emit("receive_message", data);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is connected at ${PORT}`);
});
