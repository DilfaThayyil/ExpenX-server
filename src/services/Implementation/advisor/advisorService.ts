import { inject, injectable } from 'tsyringe';
import { IAdvisorRepository } from '../../../repositories/Interface/IAdvisorRepository';
import { IAdvisorService } from '../../Interface/advisor/IAdvisorService';
import { Slot } from '../../../models/slotSchema';
import { IAdvDashboardRepo } from '../../../repositories/Interface/IDashboardRepository';
import IAdvisor from '../../../entities/advisorEntities';
import IUser from '../../../entities/userEntities';
import { messageConstants } from '../../../utils/messageConstants';
import { ISlotRepository } from '../../../repositories/Interface/ISlotRepository';
import { IDocument } from '../../../models/documentSchema';
import { IDocumentRepository } from '../../../repositories/Interface/IDocumentRepository';
import { IAppointment } from '../../../dto/advisorDTO';



@injectable()
export default class AdvisorService implements IAdvisorService {
  private _advisorRepository: IAdvisorRepository;
  private _advDashboardRepo: IAdvDashboardRepo;
  private _slotRepository: ISlotRepository;
  private _documentRepository: IDocumentRepository;

  constructor(
    @inject('IAdvisorRepository') advisorRepository: IAdvisorRepository,
    @inject('IAdvDashboardRepo') advDashboardRep: IAdvDashboardRepo,
    @inject('ISlotRepository') slotRepository: ISlotRepository,
    @inject('IDocumentRepository') documentRepository: IDocumentRepository
  ) {
    this._advisorRepository = advisorRepository;
    this._advDashboardRepo = advDashboardRep;
    this._slotRepository = slotRepository;
    this._documentRepository = documentRepository;
  }

  async updateUserProfile(userData: { profilePic: string; username: string; email: string; phone: string; country: string; language: string }) {
    try {
      const updatedUser = await this._advisorRepository.updateUser(userData, userData.email);
      return updatedUser;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new Error('Error updating user in service');
    }
  }

  async fetchDashboard(advisorId: string): Promise<{ totalRevenue: number, activeClients: number, completedGoals: number, slotUtilization: number }> {
    const dashboardData = await this._advDashboardRepo.getDashboardData(advisorId)
    return dashboardData
  }

  async fetchRevenue(advisorId: string, timeFrame: 'monthly' | 'quarterly' | 'yearly'): Promise<number> {
    const revenue = await this._advDashboardRepo.fetchRevenue(advisorId, timeFrame)
    return revenue
  }

  async getClientGoalProgress(advisorId: string): Promise<{ completed: number; inProgress: number; notStarted: number }> {
    return await this._advDashboardRepo.getClientGoalProgress(advisorId);
  }

  async getUpcomingAppointments(advisorId: string): Promise<IAppointment[]> {
    return await this._advDashboardRepo.getUpcomingAppointments(advisorId)
  }

  async getRecentClients(advisorId: string): Promise<Slot[]> {
    return await this._advDashboardRepo.getRecentClientActivities(advisorId)
  }

  async getAdvisors(): Promise<IAdvisor[]> {
    const advisors = await this._advisorRepository.getAdvisors()
    return advisors
  }

  async fetchAdvisors(page: number, limit: number,search:string): Promise<{ users: IUser[]; totalPages: number }> {
    const { users, totalUsers } = await this._advisorRepository.fetchAdvisors(page, limit,search);
    const totalPages = Math.ceil(totalUsers / limit);
    return { users, totalPages };
  }


  async updateAdvisorBlockStatus(action: string, email: string): Promise<{ message: string; error?: string }> {
    try {
      const isBlocked = action === 'block'
      await this._advisorRepository.updateAdvisorStatus(email, isBlocked)
      return { message: `Advisor ${action}ed successfully` }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      return { message: 'Failed to update advisor status ', error: errorMessage }
    }
  }

  async getClientMeetings(clientId: string,advisorId:string): Promise<Slot[] | string> {
    try {
      const getClientMeetings = await this._slotRepository.getClientMeetings(clientId,advisorId)
      return getClientMeetings
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : messageConstants.UNEXPECTED_ERROR
      return errorMessage
    }
  }

  async uploadDocument(userId: string, advisorId: string, file: Express.Multer.File): Promise<IDocument> {
    try {
      const mimeMap: Record<string, IDocument["type"]> = {
        "application/pdf": "PDF",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "XLSX",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "DOCX",
        "text/csv": "CSV"
      }
      const type = mimeMap[file.mimetype] || "PDF";
      if (!mimeMap[file.mimetype]) {
        throw new Error(`Unsupported file type: ${file.mimetype}`);
      }
      const doc = {
        userId,
        advisorId,
        name: file.originalname,
        type: type,
        url: file.path,
        uploadedAt: new Date()
      }
      const document = await this._documentRepository.uploadDocument(doc)
      return document
    } catch (err) {
      console.error("🚨 Upload Error:", err);
      throw new Error("Failed to upload document");
    }
  }

  async getDocuments(clientId: string, advisorId: string): Promise<IDocument[]> {
    const documents = await this._documentRepository.getDocuments(clientId, advisorId)
    return documents
  }
}
