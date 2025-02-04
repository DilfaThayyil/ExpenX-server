import { inject, injectable } from 'tsyringe';
import { IAdvisorRepository } from '../../../repositories/Interface/IAdvisorRepository';
import { IAdvisorService } from '../../Interface/advisor/IAdvisorService';
import { Slot } from '../../../models/slotSchema';


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

  async createSlot(slotData: Slot) {
    try{
      console.log("date & time-service : ",slotData.date,"&",slotData.startTime)
      const existingSlot = await this.advisorRepository.findExistingSlot(slotData.date, slotData.startTime);
      if (existingSlot) {
        throw new Error("A slot already exists for the given date and time.");
      }
      console.log("existingSlot-service : ",existingSlot)
      return this.advisorRepository.createSlot(slotData)
    }catch(err){
      throw new Error('Error creating slot')
    }
  }

  async fetchSlots(){
    try{
      const slots = await this.advisorRepository.fetchSlots()
      console.log("fetchSlots-service : ",slots )
      if(!slots){
        throw new Error('Error fetching slots...')
      }
      return slots
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

}
