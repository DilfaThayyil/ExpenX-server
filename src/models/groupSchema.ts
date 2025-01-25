// import { model, Schema } from "mongoose";
// import IGroup from "../entities/groupEntities";

// const GroupSchema: Schema = new Schema(
//     {
//         name: { type: String },
//         members: [{ type:String}],
//         expenses: [{ type: String }],
//         splitMethod: { type: String },
//         createdBy: {type:String}
//     },
//     { timestamps: true }
// )
// export default model<IGroup>('Group', GroupSchema)


import mongoose, { Schema, Document } from 'mongoose';

export interface IGroup extends Document {
  name: string;
  members: string[];
  splitMethod: string;
  createdAt: Date;
  updatedAt: Date;
}

const GroupSchema = new Schema<IGroup>(
  {
    name: { type: String},
    members: { type: [String]},
    splitMethod: { type: String},
  },
  { timestamps: true }
)

export default mongoose.model<IGroup>('Group', GroupSchema);
