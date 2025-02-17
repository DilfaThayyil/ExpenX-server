import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import messageSchema from "../models/messageSchema";

const initializeSocket = (server: HttpServer): Server => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["websocket", "polling"], 
  });

  io.on("connection", (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);
    socket.on("joinRoom", (roomId) => {
      console.log(`User joined room: ${roomId}`);
      socket.join(roomId);
    });
    socket.on("send_message", async({ senderId, receiverId, roomId, text }) => {
      try{
        console.log("Message received on server:", { senderId, receiverId, roomId, text });
        const newMessage = await messageSchema.create({
        senderId,
        receiverId,
        roomId,
        text,
        status: "sent",
        // time: new Date(),
      });
      io.to(roomId).emit("receive_message", newMessage);
      }catch(err){
        console.error("error saving message : ",err)
      }
  });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
};

export default initializeSocket;
