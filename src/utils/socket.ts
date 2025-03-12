import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import { CLIENTURL } from "../config/env";
import messageSchema from "../models/messageSchema";
import notificationSchema from "../models/notificationSchema";

interface IUser {
  userId: string;
  socketId: string;
}

let users: IUser[] = [];

const initializeSocket = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: CLIENTURL,
      methods: ["GET", "POST"],
      credentials: true,
    },
    path: "/socket.io",
  });

  io.on("connection", (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("addUser", (userId: string) => {
      users = users.filter((user) => user.userId !== userId);
      users.push({ userId, socketId: socket.id });
      console.log(`User ${userId} added with socket ${socket.id}`);
      console.log("Current users:", users);
    });

    socket.on("joinRoom", (roomId: string) => {
      socket.join(roomId);
      console.log(`Socket ${socket.id} joined room: ${roomId}`);
    });

    socket.on("leaveRoom", (roomId: string) => {
      socket.leave(roomId);
      console.log(`Socket ${socket.id} left room: ${roomId}`);
    });

    socket.on("send_message", async (messageData) => { 
      io.to(messageData.roomId).emit("receive_message", messageData);
      try {
        console.log("Message received:", messageData);
        const newMessage = new messageSchema({
          senderId: messageData.senderId,
          receiverId: messageData.receiverId,
          roomId: messageData.roomId,
          text: messageData.text || "",
          fileUrl: messageData.fileUrl || null,
          fileType: messageData.fileType || null,
          fileName: messageData.fileName || null,
          status: "sent",
        });
        const savedMessage = await newMessage.save();
        console.log("savedMessage : ", savedMessage)

        const newNotification = new notificationSchema({
          senderId: messageData.senderId,
          receiverId: messageData.receiverId,
          message: messageData.text || "Sent a file",
          type: "message",
          isRead: false,
          createdAt: new Date(),
        });

        const savedNotification = await newNotification.save();
        console.log("Notification saved-socket-utils:", savedNotification);
        io.to(messageData.receiverId).emit("new_notification", savedNotification);
      } catch (error) {
        console.error("Error saving message or notification:", error);
      }
    });
 
    socket.on("typing", ({ senderId, roomId }) => {
      socket.to(roomId).emit("display_typing", { senderId });
    });

    socket.on("stop_typing", ({ senderId, roomId }) => {
      socket.to(roomId).emit("hide_typing");
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
      users = users.filter((user) => user.socketId !== socket.id);
      console.log("Remaining users:", users);
    });
  });

  return io;
};

export default initializeSocket;