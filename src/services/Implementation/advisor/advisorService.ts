import { inject, injectable } from 'tsyringe';
import { IAdvisorRepository } from '../../../repositories/Interface/IAdvisorRepository';
import { IAdvisorService } from '../../Interface/advisor/IAdvisorService';
import { Slot } from '../../../models/slotSchema';
import { Types } from 'mongoose';
import { IReview } from '../../../models/reviewSchema';
import { IAdvDashboardRepo } from '../../../repositories/Interface/IDashboardRepository';

export interface IAppointment {
  _id: string;
  advisorId: {
    _id: string;
    username: string;
    email: string;
    profilePic: string;
  };
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  maxBookings: number;
  status: "Available" | "Booked" | "Cancelled";
  bookedBy?: {
    _id: string;
    username: string;
    email: string;
    profilePic: string;
  };
  location: "Virtual" | "Physical";
  locationDetails: string;
  description: string;
}

export interface IActivity {
  _id: string;
  advisorId: string;
  clientId: string;
  clientName: string;
  action: string;
  amount: number;
  time: string;
}




@injectable()
export default class AdvisorService implements IAdvisorService {
  private advisorRepository: IAdvisorRepository;
  private advDashboardRepo: IAdvDashboardRepo;

  constructor(
    @inject('IAdvisorRepository') advisorRepository: IAdvisorRepository,
    @inject('IAdvDashboardRepo') advDashboardRep: IAdvDashboardRepo
  ) {
    this.advisorRepository = advisorRepository;
    this.advDashboardRepo = advDashboardRep
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
        const isExist = await this.advisorRepository.findExistingSlot(slotData.date, slotData.startTime);
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


  async fetchSlots(advisorId:string,page:number,limit:number):Promise<{slots:Slot[]|Slot,totalPages:number}>{
    try{
      const {slots,totalSlots} = await this.advisorRepository.fetchSlots(advisorId,page,limit)
      const totalPages = Math.ceil(totalSlots/limit)      
      return {slots,totalPages}
    }catch(err){
      throw err
    }
  }

  async updateSlot(slotId:string,slot:Slot):Promise<Slot | null>{
    try{
      const existingSlot = await this.advisorRepository.findSlotById(slotId)
      if(!existingSlot){
        throw new Error('slot is not found')
      }
      const updatedSlot = await this.advisorRepository.updateSlot(slotId,slot)
      return updatedSlot
    }catch(err){
      console.error(err)
      throw err
    }
  }

  async deleteSlot(slotId:string):Promise<boolean>{
    try{
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
    return reviews
  }

  async addReplyToReview(reviewId:string,advisorId:string,text:string):Promise<IReview | null>{
    const review = await this.advisorRepository.addReplyToReview(reviewId,advisorId,text)
    return review
  }

  async fetchDashboard(advisorId:string):Promise<{totalRevenue:number,activeClients:number,completedGoals:number,slotUtilization:number}>{
    const dashboardData = await this.advDashboardRepo.getDashboardData(advisorId)
    return dashboardData
  }

  async fetchRevenue(advisorId:string,timeFrame:'monthly' | 'quarterly' | 'yearly'):Promise<number>{
    const revenue = await this.advDashboardRepo.fetchRevenue(advisorId,timeFrame)
    return revenue
  }

  async getClientGoalProgress(advisorId: string):Promise<{ completed: number; inProgress: number; notStarted: number }>{
    return await this.advDashboardRepo.getClientGoalProgress(advisorId);
  }

  async getUpcomingAppointments(advisorId:string):Promise<IAppointment[]>{
    return await this.advDashboardRepo.getUpcomingAppointments(advisorId)
  }

  async getRecentClients(advisorId:string):Promise<Slot[]>{
    return await this.advDashboardRepo.getRecentClientActivities(advisorId)
  }
}
