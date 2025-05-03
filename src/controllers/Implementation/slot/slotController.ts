import { Request, Response } from 'express'
import { ISlotController } from "../../Interface/slot/ISlotController";
import { ISlotService } from '../../../services/Interface/slot/ISlotService';
import { inject, injectable } from 'tsyringe';
import { HttpStatusCode } from '../../../utils/httpStatusCode';
import { messageConstants } from '../../../utils/messageConstants';

@injectable()
export default class SlotController implements ISlotController {
  private _slotService: ISlotService

  constructor(@inject('ISlotService') slotService: ISlotService) {
    this._slotService = slotService
  }

  async bookslot(req: Request, res: Response): Promise<void> {
    try {
      const { slotId, userId } = req.body
      const bookedSlot = await this._slotService.bookslot(slotId, userId)
      res.status(HttpStatusCode.OK).json({ message: "slot booked successfully", slot: bookedSlot })
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : messageConstants.UNEXPECTED_ERROR;
      res.status(HttpStatusCode.CONFLICT).json({ message: errorMessage });
    }
  }

  async fetchSlotsByUser(req: Request, res: Response): Promise<Response> {
    try {
      const { userId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string
      if (!userId) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({ message: "User ID is required" });
      }
      const data = await this._slotService.fetchSlotsByUser(userId, page, limit, search);
      return res.status(HttpStatusCode.OK).json({ success: true, data });
    } catch (error: any) {
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
    }
  }

  async createSlot(req: Request, res: Response): Promise<Response> {
    try {
      if (req.body.slotData._id === '') {
        delete req.body.slotData._id;
      }
      const Slot = await this._slotService.createSlot(req.body.id, req.body.slotData);
      return res.status(HttpStatusCode.CREATED).json({ message: 'Slot created successfully', Slot });
    } catch (err: any) {
      console.error(err.message);
      switch (err.message) {
        case 'A slot already exists for the given date and time.':
          return res.status(HttpStatusCode.CONFLICT).json({ message: err.message });
        case 'Advisor not found':
          return res.status(HttpStatusCode.NOT_FOUND).json({ message: err.message });
        default:
          return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Failed to create slot' });
      }
    }
  }
  

  async fetchSlots(req: Request, res: Response): Promise<Response> {
    try {
      const advisorId = req.params.advisorId
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string) || 10
      const search = req.query.search as string
      const { slots, totalPages } = await this._slotService.fetchSlots(advisorId, page, limit, search)
      return res.status(HttpStatusCode.OK).json({ success: true, data: { slots, totalPages } })
    } catch (err) {
      console.error(err)
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "error fetching slots" })
    }
  }

  async updateSlot(req: Request, res: Response): Promise<void> {
    try {
      const { slotId } = req.params;
      const updatedSlotData = req.body;
      const updatedSlot = await this._slotService.updateSlot(slotId, updatedSlotData);
      if (!updatedSlot) {
        res.status(HttpStatusCode.NOT_FOUND).json({ message: "Slot not found" });
      }
      res.status(HttpStatusCode.OK).json({ message: "Slot updated successfully", slot: updatedSlot });
    } catch (error) {
      console.error("Error updating slot:", error);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: messageConstants.INTERNAL_ERROR });
    }
  }

  async deleteSlot(req: Request, res: Response): Promise<void> {
    try {
      const { slotId } = req.params
      const isDeleted = await this._slotService.deleteSlot(slotId)
      if (!isDeleted) {
        res.status(HttpStatusCode.NOT_FOUND).json({ message: "cant found or delete slot" })
      }
      res.status(HttpStatusCode.OK).json({ message: "Slot deleted successfully" })
    } catch (err) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: messageConstants.INTERNAL_ERROR })
    }
  }

  async getBookedSlotsForAdvisor(req: Request, res: Response): Promise<Response> {
    try {
      const advisorId = req.params.advisorId
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string) || 10
      const search = req.query.search as string
      const { bookedSlots, totalPages } = await this._slotService.getBookedSlotsForAdvisor(advisorId, page, limit, search)
      return res.status(HttpStatusCode.OK).json({ success: true, data: { bookedSlots, totalPages } })
    } catch (error) {
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Error fetching booked slots" });
    }
  }

  async cancelBookedSlot(req: Request, res: Response): Promise<Response> {
    try {
      const { slotId } = req.params;
      const { advisorId, userId } = req.body
      const updatedSlot = await this._slotService.cancelBookedSlot(slotId, advisorId, userId);
      return res.status(200).json({ message: "Slot cancelled, amount refunded", updatedSlot });
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }
}