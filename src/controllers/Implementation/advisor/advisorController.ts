import { inject, injectable } from 'tsyringe';
import { IAdvisorController } from '../../Interface/advisor/IAdvisorController';
import { IAdvisorService } from '../../../services/Interface/advisor/IAdvisorService';
import cloudinary from '../../../config/cloudinaryConfig';
import { Request, Response } from 'express';
import { HttpStatusCode } from '../../../utils/httpStatusCode';
import { messageConstants } from '../../../utils/messageConstants';
import { IUserService } from '../../../services/Interface/user/IUserService';

@injectable()
export default class AdvisorController implements IAdvisorController {
  private advisorService: IAdvisorService;
  private userService: IUserService;

  constructor(
    @inject('IAdvisorService') advisorService: IAdvisorService,
    @inject('IUserService') userService: IUserService,
  ) {
    this.advisorService = advisorService;
    this.userService = userService;
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
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: messageConstants.INTERNAL_ERROR })
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

  
  async getAdvisors(req: Request, res: Response): Promise<Response> {
    try {
      const Advisors = await this.advisorService.getAdvisors()
      return res.status(HttpStatusCode.OK).json({ Advisors })
    } catch (err) {
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: messageConstants.INTERNAL_ERROR });
    }
  }

  async fetchAdvisors(req: Request, res: Response): Promise<Response> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const { users, totalPages } = await this.advisorService.fetchAdvisors(page, limit);
      return res.status(HttpStatusCode.OK).json({ success: true, data: { users, totalPages } });
    } catch (error) {
      console.error(error)
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: messageConstants.INTERNAL_ERROR    });
    }
  }

  async updateAdvisorBlockStatus(req:Request, res:Response):Promise<Response>{
    try{
      const {action,email} = req.body
      const result = await this.advisorService.updateAdvisorBlockStatus(action,email)
      if(result.error){
        return res.status(HttpStatusCode.BAD_REQUEST).json({error: result.error})
      }
      return res.status(HttpStatusCode.OK).json({message:result.message})
    }catch(error){
      console.error(error)
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({error: messageConstants.INTERNAL_ERROR   })
    }
  }

  async getClientMeetings(req:Request,res:Response):Promise<Response>{
    try{
      const {clientId} = req.params
      const clientMeetings = await this.advisorService.getClientMeetings(clientId)
      console.log("getClientMeetings-contrll  ==> ",clientMeetings)
      return res.status(HttpStatusCode.OK).json({success:true,clientMeetings})
    }catch(err){
      console.error(err)
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({error:messageConstants.INTERNAL_ERROR})
    }
  }

  async getClient(req:Request,res:Response):Promise<Response>{
    try{
      const {clientId} = req.params
      const client = await this.userService.fetchUser(clientId)
      console.log("getClient-contrll ==>> ",client)
      return res.status(HttpStatusCode.OK).json({success:true,client})
    }catch(err){
      console.error(err)
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({error:messageConstants.INTERNAL_ERROR})
    }
  }

}
