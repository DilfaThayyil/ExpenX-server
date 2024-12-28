import express, { Application } from "express";
import authRoutes from "./routes/userRouter";
const PORT = 3000
import { connectDB } from "./config/connectDB";
import cors from 'cors'


const app: Application = express();
app.get('/',(req,res)=>{
  res.send('Hello world')
})
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use("/api/auth", authRoutes);


connectDB().then(()=>{
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })