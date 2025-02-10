import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import { CLIENTURL } from "../config/env";
import { IMessage } from "../entities/messageEntities";
import Message from "../models/messageSchema";
import ChatRepository from "../repositories/Implementation/chatRepository";

interface SocketUser {
  id: string;
  socketId: string;
}

const chatRepository = new ChatRepository();

const initializeSocket = (server: HttpServer): Server => {
  const io = new Server(server, {
    cors: {
      origin: CLIENTURL,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const chatNamespace = io.of("/socket");
  let users: SocketUser[] = [];

  const addUser = (id: string, socketId: string) => {
    if (!users.some((user) => user.id === id)) {
      users.push({ id, socketId });
      console.log(`User added: ${id}, Socket ID: ${socketId}`);
    }
  };

  const removeUser = (socketId: string) => {
    users = users.filter((user) => user.socketId !== socketId);
    console.log(`User removed. Current online users:`, users);
  };

  const getUser = (id: string) => users.find((user) => user.id === id);

  chatNamespace.on("connection", (socket: Socket) => {
    console.log(`A user connected: ${socket.id}`);

    socket.on("addUser", (id: string) => {
      addUser(id, socket.id);
      chatNamespace.emit("getUser", users);
    });

    socket.on("initialMessage", async (messageData) => {
      console.log("Received initial message:", messageData);
      const { currentUserId, message, id, messageId } = messageData;
      let savedMessage = await chatRepository.saveMessage(
        currentUserId,
        id,
        message,
        true,
        messageId
      );
      console.log("Initial message saved:", savedMessage);
      chatNamespace.emit("getinitialMessage", savedMessage.conversationId);
    });

    socket.on("message", async (message: IMessage) => {
      console.log("Received message:", message);
      const { senderId, text, receiverId, messageId } = message;
      const user = getUser(receiverId);
      if(messageId){
        const savedMessage = await chatRepository.saveMessage(
          senderId,
          receiverId,
          text,
          false,
          messageId
        );
        console.log("Message saved:", savedMessage);
        if (user) {
          chatNamespace.to(user.socketId).emit("messagecount", { count: 1, senderId });
          chatNamespace.to(user.socketId).emit("messageContent", savedMessage);
        }
      }
    });

    socket.on("sendFileMessage", async (fileData) => {
      console.log("Received file message:", fileData);
      const { file, senderId, receiverId, messageId } = fileData;
      await chatRepository.saveImage(file, senderId, receiverId, messageId);

      const user = getUser(receiverId);
      if (user) {
        chatNamespace.to(user.socketId).emit("messagecount", { count: 1, senderId });
        chatNamespace.to(user.socketId).emit("messageContent", {
          messageId,
          sender: senderId,
          file,
          timestamp: new Date(),
        });
      }
    });

    socket.on("messageRead", async (messageId: string) => {
      console.log(`Marking message ${messageId} as read`);
      const message = await Message.findOne({ messageId });

      if (message) {
        message.status = "read";
        await message.save();
        const sender = getUser(message.sender.toString());

        if (sender) {
          chatNamespace.to(sender.socketId).emit("messageReadConfirmation", messageId);
        }
      }
    });

    socket.on("typing", (data) => {
      console.log("Typing event received:", data);
      const { conversationId, type, receiverId } = data;
      const sender = getUser(receiverId);

      if (sender) {
        chatNamespace.to(sender.socketId).emit("changestatus", {
          conversationId,
          type,
          receiverId,
        });
      }
    });

    socket.on("videoCall", (data) => {
      console.log("Incoming video call:", data);
      const { receiverId } = data;
      const user = getUser(receiverId);

      if (user) {
        chatNamespace.to(user.socketId).emit("videocallAlert", data);
      }
    });

    socket.on("videoDecline", (data) => {
      console.log("Video call declined:", data);
      const { receiverId } = data;
      const user = getUser(receiverId);

      if (user) {
        chatNamespace.to(user.socketId).emit("declineVideoCall", data);
      }
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
      removeUser(socket.id);
      chatNamespace.emit("removeUser", users);
    });
  });
  

  return io;
};

export default initializeSocket;
