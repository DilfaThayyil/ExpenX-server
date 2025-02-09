import { Schema, model, Document } from "mongoose";

export interface Category extends Document {
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<Category>(
  {
    name: { type: String},
  },
  { timestamps: true }
);

export default model<Category>("Category", CategorySchema);
