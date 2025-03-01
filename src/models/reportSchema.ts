import mongoose, { Document, Schema, Model, model } from "mongoose";

export interface IReport {
    userId: mongoose.Types.ObjectId;
    advisorId: mongoose.Types.ObjectId;
    reason: "Spam" | "Inappropriate Content" | "Harassment" | "Other";
    customReason?: string;
    status: "pending" | "reviewed" | "resolved";
    createdAt: Date;
}

const reportSchema: Schema<IReport> = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    advisorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Advisor",
        required: true,
    },
    reason: {
        type: String,
        required: true,
        enum: ["Spam", "Inappropriate Content", "Harassment", "Other"],
    },
    customReason: {
        type: String,
        required: function () {
            return this.reason === "Other";
        },
    },
    status: {
        type: String,
        default: "pending",
        enum: ["pending", "reviewed", "resolved"],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Report: Model<IReport> = model<IReport>("Report", reportSchema);
export default Report;





// import mongoose, { Schema } from "mongoose";

// export interface IReport {
//   userId: string;
//   advisorId: string;
//   reason: string;
//   status: "Pending" | "Approved" | "Rejected";
//   createdAt: Date;
//   updatedAt: Date;
// }

// const ReportSchema: Schema = new Schema(
//   {
//     userId: { type: String },
//     advisorId: { type: String },
//     reason: { type: String},
//     status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
//   },
//   { timestamps: true }
// );

// export default mongoose.model<IReport>("Report", ReportSchema);