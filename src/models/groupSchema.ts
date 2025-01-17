import { model, Schema } from "mongoose";
import IGroup from "../entities/groupEntities";

const GroupSchema: Schema = new Schema({
    name: {type:String},
    description: {type:String},
    members: [{type: Schema.Types.ObjectId,ref: 'User'}],
    createdAt: {type:Date, default:Date.now},
    updatedAt: {type:Date, default:Date.now}
})
export default model<IGroup>('Group',GroupSchema)