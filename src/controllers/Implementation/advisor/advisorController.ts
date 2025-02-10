import { inject, injectable } from 'tsyringe';
import { IAdvisorController } from '../../Interface/advisor/IAdvisorController';
import { IAdvisorService } from '../../../services/Interface/advisor/IAdvisorService';
import cloudinary from '../../../config/cloudinaryConfig';
import { Request, Response } from 'express';
import { HttpStatusCode } from '../../../utils/httpStatusCode';

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
        res.status(400).json({ error: 'No file uploaded' });
        return
      }
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'profile_pictures',
      });
      // console.log("result : ", result)
      const imageUrl = result.secure_url;
      // console.log("imageUrl : ", imageUrl)
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
        res.status(400).json({ error: 'Email and username are required' });
      }
      const updatedUser = await this.advisorService.updateUserProfile({
        profilePic,
        username,
        email,
        phone,
        country,
        language,
      });
      // console.log("updatedUser : ",updatedUser)
      res.status(HttpStatusCode.OK).json(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'Error updating user' });
    }
  }

  async createSlot(req:Request,res:Response):Promise<void>{
    try{
      // console.log("req body-contr :",req.body)
      if(req.body.slotData._id===''){
        delete req.body.slotData._id
      }
      // console.log("after deltg Id-contrll : ",req.body)
      const Slot = await this.advisorService.createSlot(req.body.id,req.body.slotData)
      // console.log("Slot-contr : ",Slot)
      if(!Slot){
        throw new Error('Slot is already exists')
      }
      res.status(HttpStatusCode.CREATED).json({message:'Slot created successfully',Slot})
    }catch(err){
      console.error(err)
    }
  }

  async fetchSlots(req:Request,res:Response):Promise<Response>{
    try{
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string) || 10
      // console.log("fetch-page-cotrll :",page)
      const {slots,totalPages} = await this.advisorService.fetchSlots(page,limit)
      // console.log("slts , totalPages : ",slots," ",totalPages)
      return res.status(HttpStatusCode.OK).json({success:true,data:{slots,totalPages}})
    }catch(err){
      console.error(err)
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({error:"error fetching slots"})
    }
  }

  async updateSlot(req: Request, res: Response):Promise<void> {
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

  async deleteSlot(req:Request,res:Response):Promise<void>{
    try{
      const {slotId} = req.params
      const isDeleted = await this.advisorService.deleteSlot(slotId)
      if(!isDeleted){
        res.status(HttpStatusCode.NOT_FOUND).json({message:"cant found or delete slot"})
      }
      res.status(HttpStatusCode.OK).json({message: "Slot deleted successfully"})
    }catch(err){
      // console.log("Error deleting slot : ",err)
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({message:"Internal server error"})
    }
  }


  async getBookedSlotsForAdvisor(req: Request, res: Response):Promise<Response>{
    try {
      const advisorId = req.params.advisorId
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string) || 10
      // console.log("booked-page-contrll :",page)
      // console.log("advisorId-contrll : ",advisorId)
      const {bookedSlots,totalPages} = await this.advisorService.getBookedSlotsForAdvisor(advisorId,page,limit)
      // console.log("bookedSlot-contrll,totalPages : ",bookedSlots," ",totalPages)
      return  res.status(HttpStatusCode.OK).json({ success:true,data:{bookedSlots,totalPages} })
    } catch (error) {
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Error fetching booked slots" });
    }
  }
  
  
}
