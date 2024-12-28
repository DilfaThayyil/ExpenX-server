import { model,Schema } from "mongoose";
const OtpSchema = new Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

export default model('Otp', OtpSchema);
