import 'reflect-metadata';
import './config/diContainer'
import express, { Application } from "express";
import morgan from 'morgan';
import routes from './routes/user/userAuthRouter'
import userRoutes from './routes/user/userRouter'
import advisorRoutes from './routes/advisor/advisorRouter'
import adminRoutes from './routes/admin/adminRouter'
import { connectDB } from "./config/connectDB";
import cors from 'cors'
import dotenv from 'dotenv'
import { CLIENTURL,PORT } from "./config/env";
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
app.use("/user/auth", routes);
app.use("/user",userRoutes)
app.use("/advisor/auth",advisorRoutes)
app.use("/admin",adminRoutes)


connectDB().then(()=>{
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })