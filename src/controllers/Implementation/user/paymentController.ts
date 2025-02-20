import { Request, Response } from 'express';
import { IPaymentService } from '../../../services/Interface/user/IPaymentService';
import { IPaymentController } from '../../Interface/user/IPaymentController';
import { inject, injectable } from 'tsyringe';
import { HttpStatusCode } from '../../../utils/httpStatusCode';


@injectable()
export default class PaymentController implements IPaymentController {
  private paymentService: IPaymentService

  constructor(@inject('IPaymentService')paymentService: IPaymentService){
    this.paymentService = paymentService
  }
  
  async initiatePayment(req: Request, res: Response): Promise<Response>{
    try {
      console.log("req.body : ",req.body)
      const { slotId, userId, advisorId, amount } = req.body;
      const result = await this.paymentService.initiatePayment(
        slotId,
        userId,
        advisorId,
        amount
      );
      console.log("result : ",result)
      return res.status(HttpStatusCode.OK).json(result);
    } catch (error) {
      console.log("payment initiation error : ",error)
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'Failed to initiate payment' });
    }
  };

  async confirmPayment(req: Request, res: Response):Promise<Response>{
    try {
      const { paymentIntentId } = req.body;
      const payment = await this.paymentService.confirmPayment(paymentIntentId);
      return res.status(HttpStatusCode.OK).json(payment);
    } catch (error) {
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'Failed to confirm payment' });
    }
  };
}