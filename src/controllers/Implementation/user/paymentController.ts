import { Request, Response } from 'express';
import { IPaymentService } from '../../../services/Interface/user/IPaymentService';
import { IPaymentController } from '../../Interface/user/IPaymentController';
import { inject, injectable } from 'tsyringe';
import { HttpStatusCode } from '../../../utils/httpStatusCode';
import { IWalletService } from '../../../services/Interface/wallet/IWalletService';
import { ITransactionService } from '../../../services/Interface/transaction/ITransactionService';


@injectable()
export default class PaymentController implements IPaymentController {
  private _paymentService: IPaymentService
  private _walletService: IWalletService
  private _transactionService: ITransactionService

  constructor(
    @inject('IPaymentService')paymentService: IPaymentService,
    @inject('IWalletService')walletService: IWalletService,
    @inject('ITransactionService')transactionService: ITransactionService
  ){
    this._paymentService = paymentService
    this._walletService = walletService
    this._transactionService = transactionService
  }
  
  async initiatePayment(req: Request, res: Response): Promise<Response>{
    try {
      const { slotId, userId, advisorId, amount } = req.body;
      const result = await this._paymentService.initiatePayment(
        slotId,
        userId,
        advisorId,
        amount
      );
      const wallet = await this._walletService.updateWallet(advisorId,amount)
      await this._transactionService.createTransaction({
        userId: advisorId,
        walletId: wallet?._id as string,
        type: 'credit',
        amount: amount,
        status:'completed',
        description: 'Slot booking fee credited successfully!',
      })
      return res.status(HttpStatusCode.OK).json(result);
    } catch (error) {
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'Failed to initiate payment' });
    }
  };

  async confirmPayment(req: Request, res: Response):Promise<Response>{
    try {
      const { paymentIntentId } = req.body;
      const payment = await this._paymentService.confirmPayment(paymentIntentId);
      return res.status(HttpStatusCode.OK).json(payment);
    } catch (error) {
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'Failed to confirm payment' });
    }
  };
  
}