import { Payment } from "../../../models/paymentSchema";


export interface IPaymentService {
  initiatePayment(slotId: string, userId: string, advisorId: string, amount: number): Promise<{
    clientSecret: string; paymentId: string;}>;
  confirmPayment(paymentIntentId: string): Promise<Payment>;
}