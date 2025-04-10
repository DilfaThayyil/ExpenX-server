import { IAppointment } from "../../dto/advisorDTO";
import { Slot } from "../../models/slotSchema";

export interface IAdvDashboardRepo{
    getDashboardData(advisorId:string):Promise<{totalRevenue:number,activeClients:number,completedGoals:number,slotUtilization:number}>
    fetchRevenue(advisorId:string,timeFrame:'monthly' | 'quarterly' | 'yearly'):Promise<number>
    getClientGoalProgress(advisorId:string):Promise<{ completed: number; inProgress: number; notStarted: number }>
    getUpcomingAppointments(advisorId:string):Promise<IAppointment[]>
    getRecentClientActivities(advisorId:string):Promise<Slot[]>
}