import { inject, injectable } from 'tsyringe';
import { IAdvisorController } from '../../Interface/advisor/IAdvisorController';
import { IAdvisorService } from '../../../services/Interface/advisor/IAdvisorService';
import cloudinary from '../../../config/cloudinaryConfig';
import { Request, Response } from 'express';
import { HttpStatusCode } from 'axios';

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
      console.log("result : ", result)
      const imageUrl = result.secure_url;
      console.log("imageUrl : ", imageUrl)
      res.status(200).json({ url: imageUrl });
    } catch (error) {
      console.error('Error uploading image:', error);
      res.status(500).json({ error: 'Error uploading image' });
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
      console.log("updatedUser : ",updatedUser)
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ error: 'Error updating user' });
    }
  }

  async createSlot(req:Request,res:Response):Promise<void>{
    try{
      console.log("req body-contr :",req.body)
      if(req.body.slotData._id===''){
        delete req.body.slotData._id
      }
      console.log("after deltg Id-contrll : ",req.body)
      const Slot = await this.advisorService.createSlot(req.body.id,req.body.slotData)
      console.log("Slot-contr : ",Slot)
      if(!Slot){
        throw new Error('Slot is already exists')
      }
      res.status(HttpStatusCode.Created).json({message:'Slot created successfully',Slot})
    }catch(err){
      console.error(err)
    }
  }

  async fetchSlots(req:Request,res:Response):Promise<void>{
    try{
      const slots = await this.advisorService.fetchSlots()
      console.log("slots-contrll : ",slots)
      if(!slots){
        res.status(HttpStatusCode.NotFound).json({message:'No slots found'})
      }
      res.status(HttpStatusCode.Ok).json({slots})
    }catch(err){
      console.error(err)
    }
  }

  async updateSlot(req: Request, res: Response):Promise<void> {
    try {
      const { slotId } = req.params;
      const updatedSlotData = req.body;
      
      const updatedSlot = await this.advisorService.updateSlot(slotId, updatedSlotData);

      if (!updatedSlot) {
         res.status(HttpStatusCode.NotFound).json({ message: "Slot not found" });
      }

       res.status(HttpStatusCode.Ok).json({ message: "Slot updated successfully", slot: updatedSlot });
    } catch (error) {
      console.error("Error updating slot:", error);
       res.status(500).json({ message: "Internal server error" });
    }
  }

  async deleteSlot(req:Request,res:Response):Promise<void>{
    try{
      const {slotId} = req.params
      const isDeleted = await this.advisorService.deleteSlot(slotId)
      if(!isDeleted){
        res.status(HttpStatusCode.NotFound).json({message:"cant found or delete slot"})
      }
      res.status(HttpStatusCode.Ok).json({message: "Slot deleted successfully"})
    }catch(err){
      console.log("Error deleting slot : ",err)
      res.status(HttpStatusCode.InternalServerError).json({message:"Internal server error"})
    }
  }
  
}
