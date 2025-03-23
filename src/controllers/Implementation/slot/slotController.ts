import {Request,Response} from 'express'
import { ISlotController } from "../../Interface/slot/ISlotController";
import { ISlotService } from '../../../services/Interface/slot/ISlotService';
import { inject, injectable } from 'tsyringe';
import { HttpStatusCode } from '../../../utils/httpStatusCode';
import { messageConstants } from '../../../utils/messageConstants';

@injectable()
export default class SlotController implements ISlotController{
    private slotService:ISlotService

    constructor(@inject('ISlotService') slotService:ISlotService){
        this.slotService = slotService
    }

    async bookslot(req: Request, res: Response): Promise<void> {
        try {
          const { slotId, userId } = req.body
          const bookedSlot = await this.slotService.bookslot(slotId, userId)
          res.status(HttpStatusCode.OK).json({ message: "slot booked successfully", slot: bookedSlot })
        } catch (err) {
          console.error(err)
          const errorMessage = err instanceof Error ? err.message : messageConstants.UNEXPECTED_ERROR
          res.status(HttpStatusCode.NOT_FOUND).json({ message: errorMessage })
        }
      }
    
      async fetchSlotsByUser(req: Request, res: Response): Promise<Response> {
        try {
          const { userId } = req.params;
          const page = parseInt(req.query.page as string) || 1;
          const limit = parseInt(req.query.limit as string) || 10;
          if (!userId) {
            return res.status(HttpStatusCode.BAD_REQUEST).json({ message: "User ID is required" });
          }
          const data = await this.slotService.fetchSlotsByUser(userId, page, limit);
          return res.status(HttpStatusCode.OK).json({ success: true, data });
        } catch (error:any) {
          return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
        }
      }
}