import "reflect-metadata";
import "./config/diContainer";
import express, { Application } from "express";
import { createServer } from "http";
import { connectDB } from "./config/connectDB";
import cors from "cors";
import dotenv from "dotenv";
import { CLIENTURL, PORT, BACKENDENDPOINT } from "./config/env";
import router from "./routes";
import initializeSocket from "./utils/socket";
import cookieParser from "cookie-parser";
import loggers from "./utils/logger";

dotenv.config();

const app: Application = express();
const server = createServer(app);  

app.use(cors({
  origin: ["https://expenx.vercel.app","https://expenx.dilfa.site"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

loggers.forEach((logger) => app.use(logger));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello, world! Server is running.");
});
app.use("/", router);

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`🚀 Server running at ${BACKENDENDPOINT}`);
    });
    const io = initializeSocket(server);
  })
  .catch((error) => {
    console.error("❌ Database connection failed:", error);
  });

process.on("SIGINT", async () => {
  process.exit(0);
});
