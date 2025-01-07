import { model, Schema } from "mongoose";
import IAdvisor from "../entities/advisorEntities";

const advisorSchema : Schema = new Schema({
    username: {type: String},
    email: {type: String, unique: true},
    password: {type: String},
    profilePic: {type: String},
    role: {type:String, default:'advisor'},
    isBlocked : {type: Boolean}
})
    
export default model<IAdvisor>('Advisor',advisorSchema)