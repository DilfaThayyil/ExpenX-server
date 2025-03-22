import IAdvisor from "../../../entities/advisorEntities";
import { IReview } from "../../../models/reviewSchema";
import { Slot } from "../../../models/slotSchema";
import { IAppointment } from "../../Implementation/advisor/advisorService";

export interface IAdvisorService {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateUserProfile(userData: { profilePic: string; username: string; email: string; phone: string; country: string; language: string }): Promise<any>;
    createSlot(id:string,slot:Slot):Promise<Slot>
    fetchSlots(advisorId:string,page:number,limit:number):Promise<{slots:Slot[] | Slot,totalPages:number}>
    updateSlot(slotId:string,slot:Slot):Promise<Slot | null>
    deleteSlot(slotId:string):Promise<boolean>
    getBookedSlotsForAdvisor(advisorId:string,page:number,limit:number):Promise<{bookedSlots:Slot[] | Slot; totalPages:number}>
    fetchReviews(advisorId:string):Promise<IReview[]>
    addReplyToReview(reviewId:string,advisorId:string,text:string):Promise<IReview | null>
    fetchDashboard(advisorId:string):Promise<{totalRevenue:number,activeClients:number,completedGoals:number,slotUtilization:number}>
    fetchRevenue(advisorId:string,timeFrame:'monthly' | 'quarterly' | 'yearly'):Promise<number>
    getClientGoalProgress(advisorId:string):Promise<{ completed: number; inProgress: number; notStarted: number }>
    getUpcomingAppointments(advisorId:string):Promise<IAppointment[]>
    getRecentClients(advisorId:string):Promise<Slot[]>
    getAdvisors():Promise<IAdvisor[]>
}