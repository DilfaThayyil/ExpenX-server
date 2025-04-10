import { inject, injectable } from 'tsyringe';
import { IPaymentRepository } from '../../../repositories/Interface/IPaymentRepository';
import { IPaymentService } from '../../Interface/user/IPaymentService';
import Stripe from 'stripe';
import mongoose from 'mongoose';
import { IExpenseRepository } from '../../../repositories/Interface/IExpenseRepository';
import { Payment } from '../../../dto/paymentDTO';



@injectable()
export default class PaymentService implements IPaymentService {
  private stripe: Stripe; 
  private paymentRepository: IPaymentRepository;
  private expenseRepository: IExpenseRepository;

  constructor(
    @inject('StripeSecretKey') stripeSecretKey: string,
    @inject('IPaymentRepository') paymentRepository: IPaymentRepository,
    @inject('IExpenseRepository') expenseRepository: IExpenseRepository
  ) {
    console.log("Stripe Secret Key:", stripeSecretKey);
    this.stripe = new Stripe(stripeSecretKey, { apiVersion: undefined });
    this.paymentRepository = paymentRepository;
    this.expenseRepository = expenseRepository;
  }

  async initiatePayment(slotId: string, userId: string, advisorId: string, amount: number): Promise<{ clientSecret: string; paymentId: string; }> {
    try {
      const slotObjectId = new mongoose.Types.ObjectId(slotId);
      const userObjectId = new mongoose.Types.ObjectId(userId);
      const advisorObjectId = new mongoose.Types.ObjectId(advisorId);
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: amount * 100,
        currency: 'usd',
        metadata: { slotId, userId, advisorId }
      });
      if (!paymentIntent.client_secret) {
        throw new Error("Failed to generate payment client secret");
      }
      const payment = await this.paymentRepository.createPayment({
        slotId: slotObjectId,
        userId: userObjectId,
        advisorId: advisorObjectId,
        amount,
        stripePaymentIntentId: paymentIntent.id,
        stripeClientSecret: paymentIntent.client_secret,
      }) as Payment;
      await this.expenseRepository.createExpense({
        userId:userObjectId.toString(),
        date:new Date(),
        amount,
        category: 'consultation',
        description: 'Advisor Fee'
      })
      const returning = {clientSecret: paymentIntent.client_secret,paymentId: payment._id.toString()};
      return returning

    } catch (error) {
      if (error instanceof Error) {
        throw new Error('Failed to initiate payment: ' + error.message);
      } else {
        throw new Error('Failed to initiate payment: An unknown error occurred.');
      }
    }
  }

  async confirmPayment(paymentIntentId: string) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
      if (paymentIntent.status === 'succeeded') {
        const payment = await this.paymentRepository.updatePaymentStatus(paymentIntentId, 'completed');
        return payment!;
      }
      throw new Error('Payment not successful');
    } catch (error) {
      if (error instanceof Error) {
        throw new Error('Failed to confirm payment: ' + error.message);
      } else {
        throw new Error('Failed to confirm payment: An unknown error occurred.');
      }
    }
  }
}
