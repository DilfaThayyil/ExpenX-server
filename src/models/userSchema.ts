import { model, Schema } from "mongoose";
import IUser from "../entities/userEntities";

const UserSchema: Schema = new Schema({
    username: { type: String,},
    email: { type: String, unique: true },
    password: { type: String},
    role:{type:String, default:'user'},
    isBlocked: {type: Boolean, default: false},
    isAdmin: {type: Boolean, default: false},
    profilePic: {type:String},
    refreshToken: {type: String},
})  
  export default model<IUser>('User', UserSchema);