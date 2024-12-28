import express, { Application } from "express";
import authRoutes from "./routes/userRouter";
const PORT = 3000
import { connectDB } from "./config/connectDB";

const app: Application = express();
app.use(express.json());
app.get('/',(req,res)=>{
  res.send('Hello world')
})
app.use("/api/auth", authRoutes);


connectDB().then(()=>{
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })