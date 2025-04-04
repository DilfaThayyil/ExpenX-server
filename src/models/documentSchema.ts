import { model,Schema } from "mongoose";

export interface IDocument{
    userId: string;
    advisorId: string;
    name: string;
    type: "PDF"|"XLSX"|"DOCX"|"CSV";
    url: string;
    uploadedAt: Date;
}

const documentSchema = new Schema({
  userId: { type: String},
  advisorId: { type: String },
  name: { type: String},
  type: { type: String, enum: ["PDF", "XLSX", "DOCX", "CSV"]},
  url: { type: String},
  uploadedAt: { type: Date, default: Date.now },
});

export default model<IDocument>("Document", documentSchema);
