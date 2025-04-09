import {Request,Response} from 'express'

export interface ISlotController{
    bookslot(req: Request, res: Response): Promise<void>
    fetchSlotsByUser(req:Request, res:Response): Promise<Response>
    createSlot(req:Request,res:Response): Promise<void>
    fetchSlots(req:Request,res:Response): Promise<Response>
    updateSlot(req:Request,res:Response): Promise<void>
    deleteSlot(req:Request,res:Response): Promise<void>
    getBookedSlotsForAdvisor(req: Request, res: Response): Promise<Response>
    cancelBookedSlot(req: Request, res: Response): Promise<Response>
}