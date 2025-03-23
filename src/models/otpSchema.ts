import { Document, model,Schema } from "mongoose";

export interface IOtp extends Document{
  email:string
  otp:string
  expiresAt:Date
}

const OtpSchema = new Schema<IOtp>({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

export default model<IOtp>('Otp', OtpSchema);
