import mongoose from "mongoose";
import { MONGODBURL } from "./env";

export const connectDB=async ()=>{
    try{
        await mongoose.connect(MONGODBURL??'')
        console.log('Mongodb Connected');
        
    }catch(err){
        console.log('Failed to connect MongoDB',err);
        process.exit(1);
    }
}