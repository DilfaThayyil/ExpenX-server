import mongoose, { Schema, Document } from "mongoose";

export interface IReport extends Document {
  userId: string;
  advisorId: string;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
  createdAt: Date;
}

const ReportSchema: Schema = new Schema(
  {
    userId: { type: String },
    advisorId: { type: String },
    reason: { type: String},
    status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
  },
  { timestamps: true }
);

export default mongoose.model<IReport>("Report", ReportSchema);
