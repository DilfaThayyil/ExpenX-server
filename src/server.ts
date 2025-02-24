import 'reflect-metadata';
import './config/diContainer';
import express, { Application } from "express";
import morgan from 'morgan';
import { createServer } from "http";
import { connectDB } from "./config/connectDB";
import cors from 'cors';
import dotenv from 'dotenv';
import { CLIENTURL, PORT } from "./config/env";
import router from './routes';
import initializeSocket from "./utils/socket";  
import cookieParser from 'cookie-parser';

dotenv.config();

const app: Application = express();
const server = createServer(app);  

// Middleware
app.use(cors({
  origin: CLIENTURL,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.get('/', (req, res) => {
  res.send('Hello world');
});
app.use("/", router);

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });

  initializeSocket(server);
}).catch(error => {
  console.error("Database connection failed:", error);
});

process.on("SIGINT", async () => {
  console.log("Shutting down server...");
  process.exit(0);
});
