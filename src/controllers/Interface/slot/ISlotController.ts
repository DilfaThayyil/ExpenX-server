import {Request,Response} from 'express'

export interface ISlotController{
    bookslot(req: Request, res: Response): Promise<void>
    fetchSlotsByUser(req:Request, res:Response): Promise<Response>
}