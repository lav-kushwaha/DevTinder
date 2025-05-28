const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/chat");
const ConnectionRequest = require("../models/connectionRequest");

// Generate a unique room ID for two users by hashing their sorted IDs
const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("_"))
    .digest("hex");
};

// Initialize Socket.IO server
const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173", // Allow frontend connection
    },
  });

  // Handle new socket connection
  io.on("connection", (socket) => {
    // console.log("New user connected:", socket.id);

    // Handle joining a chat room
    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      socket.join(roomId); // Join a private room based on both user IDs
      console.log(`${firstName} joined room: ${roomId}`);
    });

    // Handle sending a new message
    socket.on("sendMessage", async ({ firstName, lastName, userId, targetUserId, text }) => {
      try {
        const roomId = getSecretRoomId(userId, targetUserId);

        //check if the userID and toUserID are friends
        const connection = await ConnectionRequest.findOne({
          status: "accepted",
          $or: [
            { fromUserId: userId, toUserId: targetUserId },
            { fromUserId: targetUserId, toUserId: userId }
          ]
        });

        if (!connection) {
          console.warn(`Connection not accepted between ${userId} and ${targetUserId}`);
          return;
        }

        // Check if chat between the two users exists
        let chat = await Chat.findOne({
          participants: { $all: [userId, targetUserId] }
        });

        // If no chat exists, create a new one
        if (!chat) {
          chat = new Chat({
            participants: [userId, targetUserId],
            messages: [],
          });
        }

        // Push new message to messages array
        chat.messages.push({
          senderId: userId,
          text,
        });

        // Save chat to the database
        await chat.save();

        // Emit the message to everyone in the room
        io.to(roomId).emit("messageReceived", { firstName, lastName, text });

      } catch (err) {
        console.error("Error saving message:", err);
      }
    });

    // Handle user disconnection
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });

  });
};

module.exports = { initializeSocket };
