import { Schema, model, Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {name: { type: String},},
  { timestamps: true }
);

export default model<ICategory>("Category", CategorySchema);
