import mongoose, { Schema, Document } from 'mongoose';

export interface IGoal extends Document {
  userId: string;
  title: string;
  description?: string;
  target: number;
  current: number;
  deadline: Date;
  category: string;
  status: "inProgress" | "completed" | "not Started"
  createdAt: Date;
  updatedAt: Date;
}

const GoalSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  target: { type: Number, required: true, min: 0 },
  current: { type: Number, default: 0, min: 0 },
  deadline: { type: Date, required: true },
  category: { type: String, default: 'savings' },
  status: { type: String, enum:["inProgress","completed","not Started"],default:"inProgress"},
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model<IGoal>('Goal', GoalSchema);