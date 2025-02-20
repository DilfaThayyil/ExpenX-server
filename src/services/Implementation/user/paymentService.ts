import { inject, injectable } from 'tsyringe';
import { IPaymentRepository } from '../../../repositories/Interface/IPaymentRepository';
import { IPaymentService } from '../../Interface/user/IPaymentService';
import Stripe from 'stripe';
import mongoose from 'mongoose';

interface Payment {
  _id: mongoose.Types.ObjectId;
  slotId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  advisorId: mongoose.Types.ObjectId;
  amount: number;
  stripePaymentIntentId: string;
  stripeClientSecret: string;
}

@injectable()
export default class PaymentService implements IPaymentService {
  private stripe: Stripe;
  private paymentRepository: IPaymentRepository;

  constructor(
    @inject('StripeSecretKey') stripeSecretKey: string,
    @inject('IPaymentRepository') paymentRepository: IPaymentRepository
  ) {
    console.log("Stripe Secret Key:", stripeSecretKey);
    this.stripe = new Stripe(stripeSecretKey, { apiVersion: undefined });
    this.paymentRepository = paymentRepository;
  }

  async initiatePayment(slotId: string, userId: string, advisorId: string, amount: number): Promise<{ clientSecret: string; paymentId: string; }> {
    try {
      console.log("service -: ",slotId,",",userId,",",advisorId,",",amount)
      const slotObjectId = new mongoose.Types.ObjectId(slotId);
      const userObjectId = new mongoose.Types.ObjectId(userId);
      const advisorObjectId = new mongoose.Types.ObjectId(advisorId);
      console.log("Hello from service...")
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: amount * 100,
        currency: 'usd',
        metadata: { slotId, userId, advisorId }
      });
      console.log("paymentIntent-service : ",paymentIntent)
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
      console.log("payment-service ; ",payment)
      const returning = {clientSecret: paymentIntent.client_secret,paymentId: payment._id.toString()};
      console.log("returning object -service : ",returning)
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
