import { model, Schema } from "mongoose";
import IAdvisor from "../entities/advisorEntities";

const advisorSchema : Schema = new Schema({
    username: {type: String},
    email: {type: String, unique: true},
    password: {type: String},
    role: {type:String, default:'advisor'},
    isBlocked: {type:Boolean, default:false},
    isAdmin: {type:Boolean, default: false},
    profilePic: {type: String},
    refreshToken: {type:String}
})
    
export default model<IAdvisor>('Advisor',advisorSchema)