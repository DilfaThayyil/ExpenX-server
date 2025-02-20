import { Payment } from '../../models/paymentSchema';
import { Types } from 'mongoose';

export interface IPaymentRepository {
  createPayment(paymentData: Partial<Payment>): Promise<Payment>;
  updatePaymentStatus(paymentId: string, status: string): Promise<Payment | null>;
  getPaymentBySlotId(slotId: Types.ObjectId): Promise<Payment | null>;
}