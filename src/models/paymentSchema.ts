import { model, Schema, Document, Types } from "mongoose";

export interface Payment extends Document {
  slotId: Types.ObjectId;
  userId: Types.ObjectId;
  advisorId: Types.ObjectId;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  stripePaymentIntentId: string;
  stripeClientSecret: string;
}

const PaymentSchema = new Schema({
  slotId: { type: Schema.Types.ObjectId, ref: 'Slot', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  advisorId: { type: Schema.Types.ObjectId, ref: 'Advisor', required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'usd' },
  status: { 
    type: String, 
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  stripePaymentIntentId: { type: String },
  stripeClientSecret: { type: String }
}, { timestamps: true });

export default model<Payment>('Payment', PaymentSchema);