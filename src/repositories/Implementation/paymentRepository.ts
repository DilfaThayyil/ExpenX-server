import { IPaymentRepository } from '../Interface/IPaymentRepository';
import paymentSchema, { Payment } from '../../models/paymentSchema';
import { Types } from 'mongoose';
import { BaseRepository } from './baseRepository';

export default class PaymentRepository extends BaseRepository<Payment> implements IPaymentRepository {
  constructor(){
    super(paymentSchema)
  }

  async createPayment(paymentData: Partial<Payment>): Promise<Payment> {
    const payment = await paymentSchema.create(paymentData);
    return payment
  }

  async updatePaymentStatus(paymentId: string, status: string): Promise<Payment | null> {
    const payment = await paymentSchema.findByIdAndUpdate(
      paymentId,
      { status },
      { new: true }
    );
    return payment
  }

  async getPaymentBySlotId(slotId: Types.ObjectId): Promise<Payment | null> {
    const payment = await paymentSchema.findOne({ slotId });
    return payment
  }
}