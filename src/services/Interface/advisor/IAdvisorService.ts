import { IAppointment } from "../../../dto/advisorDTO";
import IAdvisor from "../../../entities/advisorEntities";
import { IDocument } from "../../../models/documentSchema";
import { Slot } from "../../../models/slotSchema";

export interface IAdvisorService {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateUserProfile(userData: { profilePic: string; username: string; email: string; phone: string; country: string; language: string }): Promise<any>;
    fetchDashboard(advisorId:string):Promise<{totalRevenue:number,activeClients:number,completedGoals:number,slotUtilization:number}>
    fetchRevenue(advisorId:string,timeFrame:'monthly' | 'quarterly' | 'yearly'):Promise<number>
    getClientGoalProgress(advisorId:string):Promise<{ completed: number; inProgress: number; notStarted: number }>
    getUpcomingAppointments(advisorId:string):Promise<IAppointment[]>
    getRecentClients(advisorId:string):Promise<Slot[]>
    getAdvisors():Promise<IAdvisor[]>
    fetchAdvisors(page: number, limit: number,search:string): Promise<{ users: IAdvisor[]; totalPages: number }>;
    updateAdvisorBlockStatus(action:string,email:string):Promise<{ message: string; error?: string }>
    getClientMeetings(clientId:string,advisorId:string):Promise<Slot[] | string>
    uploadDocument(userId:string,advisorId:string,file:Express.Multer.File):Promise<IDocument>
    getDocuments(clientId:string,advisorId:string):Promise<IDocument[]>
}