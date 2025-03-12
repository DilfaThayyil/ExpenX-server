import { inject, injectable } from 'tsyringe';
import { IAdvisorController } from '../../Interface/advisor/IAdvisorController';
import { IAdvisorService } from '../../../services/Interface/advisor/IAdvisorService';
import cloudinary from '../../../config/cloudinaryConfig';
import { Request, Response } from 'express';
import { HttpStatusCode } from '../../../utils/httpStatusCode';
import { Types } from 'mongoose';

@injectable()
export default class AdvisorController implements IAdvisorController {
  private advisorService: IAdvisorService;

  constructor(@inject('IAdvisorService') advisorService: IAdvisorService) {
    this.advisorService = advisorService;
  }


  async uploadProfileImage(req: Request, res: Response): Promise<void> {
    try {
      const file = req.file;
      if (!file) {
        res.status(HttpStatusCode.BAD_REQUEST).json({ error: 'No file uploaded' });
        return
      }
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'profile_pictures',
      });
      const imageUrl = result.secure_url;
      res.status(HttpStatusCode.OK).json({ url: imageUrl });
    } catch (error) {
      console.error('Error uploading image:', error);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'Error uploading image' });
    }
  }


  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { profilePic, username, email, phone, country, language } = req.body;
      if (!email || !username) {
        res.status(HttpStatusCode.BAD_REQUEST).json({ error: 'Email and username are required' });
      }
      const updatedUser = await this.advisorService.updateUserProfile({
        profilePic,
        username,
        email,
        phone,
        country,
        language,
      });
      res.status(HttpStatusCode.OK).json(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'Error updating user' });
    }
  }

  async createSlot(req: Request, res: Response): Promise<void> {
    try {
      if (req.body.slotData._id === '') {
        delete req.body.slotData._id
      }
      const Slot = await this.advisorService.createSlot(req.body.id, req.body.slotData)
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
      const { slots, totalPages } = await this.advisorService.fetchSlots(advisorId,page, limit)
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
      const updatedSlot = await this.advisorService.updateSlot(slotId, updatedSlotData);
      if (!updatedSlot) {
        res.status(HttpStatusCode.NOT_FOUND).json({ message: "Slot not found" });
      }
      res.status(HttpStatusCode.OK).json({ message: "Slot updated successfully", slot: updatedSlot });
    } catch (error) {
      console.error("Error updating slot:", error);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
  }

  async deleteSlot(req: Request, res: Response): Promise<void> {
    try {
      const { slotId } = req.params
      const isDeleted = await this.advisorService.deleteSlot(slotId)
      if (!isDeleted) {
        res.status(HttpStatusCode.NOT_FOUND).json({ message: "cant found or delete slot" })
      }
      res.status(HttpStatusCode.OK).json({ message: "Slot deleted successfully" })
    } catch (err) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" })
    }
  }

  async getBookedSlotsForAdvisor(req: Request, res: Response): Promise<Response> {
    try {
      const advisorId = req.params.advisorId
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string) || 10
      const { bookedSlots, totalPages } = await this.advisorService.getBookedSlotsForAdvisor(advisorId, page, limit)
      return res.status(HttpStatusCode.OK).json({ success: true, data: { bookedSlots, totalPages } })
    } catch (error) {
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Error fetching booked slots" });
    }
  }

  async fetchReviews(req: Request, res: Response): Promise<Response> {
    try {
      const { advisorId } = req.params;
      const reviews = await this.advisorService.fetchReviews(advisorId);
      return res.status(HttpStatusCode.OK).json({ success: true, data: reviews });
    } catch (error) {
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'Error fetching reviews' })
    }
  }

  async addReplyToReview(req: Request, res: Response): Promise<Response> {
    try {
      const { reviewId } = req.params
      const { advisorId, text } = req.body
      const review = await this.advisorService.addReplyToReview(reviewId, advisorId, text)
      return res.status(HttpStatusCode.OK).json({ success: true, data: review })
    } catch (err) {
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'Error adding review' })
    }
  }

  async fetchDashboard(req: Request, res: Response): Promise<Response> {
    try {
      const { advisorId } = req.params
      const stats = await this.advisorService.fetchDashboard(advisorId)
      return res.status(HttpStatusCode.OK).json(stats)
    } catch (err) {
      console.error(err)
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json('Error fetching data')
    }
  }

  async fetchRevenue(req: Request, res: Response): Promise<Response> {
    try {
      const advisorId = req.params.advisorId
      const timeframe = req.query.timeFrame as "monthly" | "quarterly" | "yearly"
      console.log("data-contrll : ", advisorId, ",", timeframe)
      if (!advisorId || !timeframe) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({ message: "Missing required parameters" })
      }
      const revenue = await this.advisorService.fetchRevenue(advisorId, timeframe)
      console.log("revenue-contrll : ", revenue)
      return res.status(HttpStatusCode.OK).json({ revenue })
    } catch (error) {
      console.error("Error fetching revenue:", error)
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" })
    }
  }

  async fetchClientGoals(req: Request, res: Response): Promise<Response> {
    try {
      const advisorId = req.params.advisorId
      const clientGoalProgress = await this.advisorService.getClientGoalProgress(advisorId)
      return res.status(HttpStatusCode.OK).json({clientGoalProgress})
    } catch (err) {
      console.error(err)
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({message:'Error fetching clientGoalsProgress'})
    }
  }

  async getUpcomingAppointments(req:Request,res:Response):Promise<Response>{
    try{
      const {advisorId} = req.params
      const upComingAppointments = await this.advisorService.getUpcomingAppointments(advisorId)
      return res.status(HttpStatusCode.OK).json({upComingAppointments})
    }catch(err){
      console.error(err)
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({message:'Error fetching upComingAppointments'})
    }
  }

  async getRecentClients(req:Request,res:Response):Promise<Response>{
    try{
      const {advisorId} = req.params
      const recentClientActivities = await this.advisorService.getRecentClients(advisorId)
      return res.status(HttpStatusCode.OK).json({recentClientActivities})
    }catch(err){
      console.error(err)
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({message:'Error fetching recent clients'})
    }
  }

}
