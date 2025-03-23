import { IPaymentRepository } from '../Interface/IPaymentRepository';
import paymentSchema, { Payment } from '../../models/paymentSchema';
import { Types } from 'mongoose';
import { BaseRepository } from './baseRepository';

export default class PaymentRepository extends BaseRepository<Payment> implements IPaymentRepository {
  constructor(){
    super(paymentSchema)
  }

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