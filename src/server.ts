import 'reflect-metadata';
import './config/diContainer'
import express, { Application } from "express";
import morgan from 'morgan';

import { connectDB } from "./config/connectDB";
import cors from 'cors'
import dotenv from 'dotenv'
import { CLIENTURL,PORT } from "./config/env";
import router from './routes';
dotenv.config()


const app: Application = express();
app.get('/',(req,res)=>{
  res.send('Hello world')
})
app.use(cors({
  origin: CLIENTURL,
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(morgan('dev'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use("/",router)


connectDB().then(()=>{
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })