import { inject, injectable } from 'tsyringe';
import { IAdvisorRepository } from '../../../repositories/Interface/IAdvisorRepository';
import { IAdvisorService } from '../../Interface/advisor/IAdvisorService';
import { Slot } from '../../../models/slotSchema';
import { Types } from 'mongoose';
import { IReview } from '../../../models/reviewSchema';
import { IAdvDashboardRepo } from '../../../repositories/Interface/IDashboardRepository';
import IAdvisor from '../../../entities/advisorEntities';
import IUser from '../../../entities/userEntities';

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
  fee: number;
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
      console.log("updated user ; ", updatedUser)
      return updatedUser;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new Error('Error updating user in service');
    }
  }

  async fetchDashboard(advisorId: string): Promise<{ totalRevenue: number, activeClients: number, completedGoals: number, slotUtilization: number }> {
    const dashboardData = await this.advDashboardRepo.getDashboardData(advisorId)
    return dashboardData
  }

  async fetchRevenue(advisorId: string, timeFrame: 'monthly' | 'quarterly' | 'yearly'): Promise<number> {
    const revenue = await this.advDashboardRepo.fetchRevenue(advisorId, timeFrame)
    return revenue
  }

  async getClientGoalProgress(advisorId: string): Promise<{ completed: number; inProgress: number; notStarted: number }> {
    return await this.advDashboardRepo.getClientGoalProgress(advisorId);
  }

  async getUpcomingAppointments(advisorId: string): Promise<IAppointment[]> {
    return await this.advDashboardRepo.getUpcomingAppointments(advisorId)
  }

  async getRecentClients(advisorId: string): Promise<Slot[]> {
    return await this.advDashboardRepo.getRecentClientActivities(advisorId)
  }

  async getAdvisors(): Promise<IAdvisor[]> {
    const advisors = await this.advisorRepository.getAdvisors()
    return advisors
  }

  async fetchAdvisors(page: number, limit: number): Promise<{ users: IUser[]; totalPages: number }> {
    console.log("service....")
    const { users, totalUsers } = await this.advisorRepository.fetchAdvisors(page, limit);
    const totalPages = Math.ceil(totalUsers / limit);
    console.log()
    return { users, totalPages };
  }


  async updateAdvisorBlockStatus(action: string, email: string): Promise<{ message: string; error?: string }> {
    try {
      const isBlocked = action === 'block'
      await this.advisorRepository.updateAdvisorStatus(email, isBlocked)
      return { message: `Advisor ${action}ed successfully` }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      return { message: 'Failed to update advisor status ', error: errorMessage }
    }
  }
}
