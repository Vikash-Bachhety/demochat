const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");
const mongoose = require("mongoose");
require('dotenv').config();

const app = express();

app.use(cors("https://demochat-omega.vercel.app"));
// app.use(cors("http://localhost:5173"));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://demochat-omega.vercel.app",
    // origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error: ", err));

// Define the message schema and model
const messageSchema = new mongoose.Schema({
  userId: String,
  username: String,
  message: String,
  timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model("Message", messageSchema);

// Remove any unique index on the `email` field if it exists
mongoose.connection.on('open', async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    try {
      await collection.dropIndex('email_1');
    } catch (error) {
      if (error.codeName !== 'IndexNotFound') {
        console.error('Error dropping index:', error);
      }
    }
  }
});

io.on("connection", async (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.emit("message", { message: "Welcome to the chat app!", id: socket.id });

  // Send all previous messages to the newly connected user
  try {
    const messages = await Message.find().sort({ timestamp: 1 }).exec();
    socket.emit("receive_message", messages);
  } catch (err) {
    console.error(err);
  }

  socket.on("send_message", async (data) => {
    const newMessage = new Message({
      userId: socket.id,
      username: data.username,
      message: data.message,
    });

    try {
      await newMessage.save();
      io.emit("receive_message", { message: data.message, userId: socket.id, username: data.username });
    } catch (err) {
      console.error(err);
    }
  });

  // socket.on("disconnect", () => {
  //   io.emit("user_left", { message: "A user has left the chat." });
  //   console.log(`Socket disconnected: ${socket.id}`);
  // });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
