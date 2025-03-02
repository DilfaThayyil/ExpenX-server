import { inject, injectable } from 'tsyringe';
import { IAdvisorRepository } from '../../../repositories/Interface/IAdvisorRepository';
import { IAdvisorService } from '../../Interface/advisor/IAdvisorService';
import { Slot } from '../../../models/slotSchema';
import { Types } from 'mongoose';
import { IReview } from '../../../models/reviewSchema';


@injectable()
export default class AdvisorService implements IAdvisorService {
  private advisorRepository: IAdvisorRepository;

  constructor(@inject('IAdvisorRepository') advisorRepository: IAdvisorRepository) {
    this.advisorRepository = advisorRepository;
  }

  async updateUserProfile(userData: { profilePic: string; username: string; email: string; phone: string; country: string; language: string }) {
    try {
      const updatedUser = await this.advisorRepository.updateUser(userData, userData.email);
      console.log("updated user ; ",updatedUser)
      return updatedUser;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new Error('Error updating user in service');
    }
  }

  async createSlot(id: string, slotData: Slot): Promise<Slot> {
    try {
        console.log("advisorId-service : ", id);
        console.log("date & time-service : ", slotData.date, "&", slotData.startTime);

        const isExist = await this.advisorRepository.findExistingSlot(slotData.date, slotData.startTime);
        console.log("existingSlot-service : ", isExist);
        if (isExist) {
            throw new Error("A slot already exists for the given date and time.");
        }

        const advisor = await this.advisorRepository.findUserById(id);
        if (!advisor) throw new Error('Advisor not found');

        const creatingSlot: Partial<Slot> = {
            advisorId: {
                _id: new Types.ObjectId(advisor._id), 
                username: advisor.username,
                email: advisor.email,
                profilePic: advisor.profilePic
            },
            date: slotData.date,
            startTime: slotData.startTime,
            endTime: slotData.endTime,
            duration: slotData.duration,
            maxBookings: slotData.maxBookings,
            status: slotData.status,
            bookedBy: {}, // Empty object by default
            location: slotData.location,
            locationDetails: slotData.locationDetails,
            description: slotData.description
        };

        const slot = await this.advisorRepository.createSlot(creatingSlot as Slot);
        return slot;
    } catch (err) {
        console.error('Error creating slot:', err);
        throw new Error('Error creating slot');
    }
}


  async fetchSlots(page:number,limit:number):Promise<{slots:Slot[]|Slot,totalPages:number}>{
    try{
      console.log("fetchSlot-serv...")
      const {slots,totalSlots} = await this.advisorRepository.fetchSlots(page,limit)
      const totalPages = Math.ceil(totalSlots/limit)      
      return {slots,totalPages}
    }catch(err){
      throw err
    }
  }

  async updateSlot(slotId:string,slot:Slot):Promise<Slot | null>{
    try{
      console.log("slotId-service : ",slotId)
      const existingSlot = await this.advisorRepository.findSlotById(slotId)
      console.log("existingSlot : ",existingSlot)
      if(!existingSlot){
        throw new Error('slot is not found')
      }
      const updatedSlot = await this.advisorRepository.updateSlot(slotId,slot)
      console.log("updatedSlot-service ; ",updatedSlot)
      return updatedSlot
    }catch(err){
      console.error(err)
      throw err
    }
  }

  async deleteSlot(slotId:string):Promise<boolean>{
    try{
      console.log("slotId : ",slotId)
      const isDeleted = await this.advisorRepository.deleteSlot(slotId)
      if(!isDeleted){
        throw new Error('Cant found or delete the slot')
      }
      return isDeleted
    }catch(err){
      console.error(err)
      throw err
    }
  }

  async getBookedSlotsForAdvisor(advisorId:string,page:number,limit:number):Promise<{bookedSlots:Slot[] | Slot; totalPages:number}>{
    try{
      const {bookedSlots,totalSlots} = await this.advisorRepository.getBookedSlotsForAdvisor(advisorId,page,limit)
      if(!bookedSlots){
        throw new Error('No slots found')
      }
      const totalPages = Math.ceil(totalSlots/limit)
      return {bookedSlots,totalPages}
    }catch(err){
      console.error(err)
      throw err
    }
  }

  async fetchReviews(advisorId: string): Promise<IReview[]> {
    const reviews =  await this.advisorRepository.fetchReviews(advisorId);
    console.log("reviews-serv : ",reviews)
    return reviews
  }
}
