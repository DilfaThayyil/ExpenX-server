import { IReview } from "../../../models/reviewSchema";
import { Slot } from "../../../models/slotSchema";

export interface IAdvisorService {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateUserProfile(userData: { profilePic: string; username: string; email: string; phone: string; country: string; language: string }): Promise<any>;
    createSlot(id:string,slot:Slot):Promise<Slot>
    fetchSlots(page:number,limit:number):Promise<{slots:Slot[] | Slot,totalPages:number}>
    updateSlot(slotId:string,slot:Slot):Promise<Slot | null>
    deleteSlot(slotId:string):Promise<boolean>
    getBookedSlotsForAdvisor(advisorId:string,page:number,limit:number):Promise<{bookedSlots:Slot[] | Slot; totalPages:number}>
    fetchReviews(advisorId:string):Promise<IReview[]>
}