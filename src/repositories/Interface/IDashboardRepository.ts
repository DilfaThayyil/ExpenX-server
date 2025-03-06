import { Slot } from "../../models/slotSchema";
import { IAppointment } from "../../services/Implementation/advisor/advisorService";

export interface IAdvDashboardRepo{
    getDashboardData(advisorId:string):Promise<{totalRevenue:number,activeClients:number,completedGoals:number,slotUtilization:number}>
    fetchRevenue(advisorId:string,timeFrame:'monthly' | 'quarterly' | 'yearly'):Promise<number>
    getClientGoalProgress(advisorId:string):Promise<{ completed: number; inProgress: number; notStarted: number }>
    getUpcomingAppointments(advisorId:string):Promise<IAppointment[]>
    getRecentClientActivities(advisorId:string):Promise<Slot[]>
}