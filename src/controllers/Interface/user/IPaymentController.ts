import { Request,Response } from 'express'

export interface IPaymentController{
    initiatePayment(req:Request,res:Response):Promise<Response>
    confirmPayment(req:Request,res:Response):Promise<Response>
}