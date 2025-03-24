import { Request, Response } from 'express'
import { ISlotController } from "../../Interface/slot/ISlotController";
import { ISlotService } from '../../../services/Interface/slot/ISlotService';
import { inject, injectable } from 'tsyringe';
import { HttpStatusCode } from '../../../utils/httpStatusCode';
import { messageConstants } from '../../../utils/messageConstants';

@injectable()
export default class SlotController implements ISlotController {
  private slotService: ISlotService

  constructor(@inject('ISlotService') slotService: ISlotService) {
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
    } catch (error: any) {
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
    }
  }

  async createSlot(req: Request, res: Response): Promise<void> {
    try {
      if (req.body.slotData._id === '') {
        delete req.body.slotData._id
      }
      const Slot = await this.slotService.createSlot(req.body.id, req.body.slotData)
      if (!Slot) {
        throw new Error('Slot is already exists')
      }
      res.status(HttpStatusCode.CREATED).json({ message: 'Slot created successfully', Slot })
    } catch (err) {
      console.error(err)
    }
  }

  async fetchSlots(req: Request, res: Response): Promise<Response> {
    try {
      const advisorId = req.params.advisorId
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string) || 10
      const { slots, totalPages } = await this.slotService.fetchSlots(advisorId, page, limit)
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
      const updatedSlot = await this.slotService.updateSlot(slotId, updatedSlotData);
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
      const isDeleted = await this.slotService.deleteSlot(slotId)
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
      const { bookedSlots, totalPages } = await this.slotService.getBookedSlotsForAdvisor(advisorId, page, limit)
      return res.status(HttpStatusCode.OK).json({ success: true, data: { bookedSlots, totalPages } })
    } catch (error) {
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Error fetching booked slots" });
    }
  }
}