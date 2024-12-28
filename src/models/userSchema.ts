import { model, Schema } from "mongoose";
import IUser from "../entities/userEntities";


const UserSchema: Schema = new Schema(
    {
      username: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
    },
    { timestamps: true }
  );
  
  export default model<IUser>('User', UserSchema);