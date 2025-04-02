import IAdvisor from "../../../entities/advisorEntities";
import { Slot } from "../../../models/slotSchema";
import { IAppointment } from "../../Implementation/advisor/advisorService";

export interface IAdvisorService {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateUserProfile(userData: { profilePic: string; username: string; email: string; phone: string; country: string; language: string }): Promise<any>;
    fetchDashboard(advisorId:string):Promise<{totalRevenue:number,activeClients:number,completedGoals:number,slotUtilization:number}>
    fetchRevenue(advisorId:string,timeFrame:'monthly' | 'quarterly' | 'yearly'):Promise<number>
    getClientGoalProgress(advisorId:string):Promise<{ completed: number; inProgress: number; notStarted: number }>
    getUpcomingAppointments(advisorId:string):Promise<IAppointment[]>
    getRecentClients(advisorId:string):Promise<Slot[]>
    getAdvisors():Promise<IAdvisor[]>
    fetchAdvisors(page: number, limit: number): Promise<{ users: IAdvisor[]; totalPages: number }>;
    updateAdvisorBlockStatus(action:string,email:string):Promise<{ message: string; error?: string }>
    getClientMeetings(clientId:string):Promise<Slot[] | string>
}