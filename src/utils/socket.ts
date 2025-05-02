import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import { CLIENTURL } from "../config/env";
import messageSchema from "../models/messageSchema";
import notificationSchema from "../models/notificationSchema";
import { IUser } from "../dto/userDTO";



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
    socket.on("addUser", (userId: string) => {
      users = users.filter((user) => user.userId !== userId);
      users.push({ userId, socketId: socket.id });
    });

    socket.on("joinRoom", (roomId: string) => {
      socket.join(roomId);
    });

    socket.on("leaveRoom", (roomId: string) => {
      socket.leave(roomId);
    });

    socket.on("send_message", async (messageData) => { 
      io.to(messageData.roomId).emit("receive_message", messageData);
      try {
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
        const newNotification = new notificationSchema({
          senderId: messageData.senderId,
          receiverId: messageData.receiverId,
          message: messageData.text || "Sent a file",
          type: "message",
          isRead: false,
          createdAt: new Date(),
        });

        const savedNotification = await newNotification.save();
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
      users = users.filter((user) => user.socketId !== socket.id);
    });
  });

  return io;
};

export default initializeSocket;