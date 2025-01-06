import { model, Schema } from "mongoose";
import IUser from "../entities/userEntities";


const UserSchema: Schema = new Schema(
    {
      username: { type: String,},
      email: { type: String, unique: true },
      password: { type: String},
      isBlocked: {type: Boolean, default: false},
      isAdmin: {type: Boolean, default: false},
      refreshToken: {type: String},
      profilePic: {type:String},
    },
    { timestamps: true }
  );
  
  export default model<IUser>('User', UserSchema);