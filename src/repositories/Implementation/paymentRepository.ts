import { IPaymentRepository } from '../Interface/IPaymentRepository';
import paymentSchema, { Payment } from '../../models/paymentSchema';
import { Types } from 'mongoose';

export default class PaymentRepository implements IPaymentRepository {

  async createPayment(paymentData: Partial<Payment>): Promise<Payment> {
    console.log("creating payment...")
    const payment = await paymentSchema.create(paymentData);
    console.log("createPayment : ",payment)
    return payment
  }

  async updatePaymentStatus(paymentId: string, status: string): Promise<Payment | null> {
    console.log("updating payment status...")
    const payment = await paymentSchema.findByIdAndUpdate(
      paymentId,
      { status },
      { new: true }
    );
    console.log("updatePaymentStatus : ",payment)
    return payment
  }

  async getPaymentBySlotId(slotId: Types.ObjectId): Promise<Payment | null> {
    console.log("finding paymentBySlot...")
    const payment = await paymentSchema.findOne({ slotId });
    console.log("getPaymentBySlotId : ",payment)
    return payment
  }
}