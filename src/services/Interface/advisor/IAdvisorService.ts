import { Slot } from "../../../models/slotSchema";

export interface IAdvisorService {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateUserProfile(userData: { profilePic: string; username: string; email: string; phone: string; country: string; language: string }): Promise<any>;
    createSlot(id:string,slot:Slot):Promise<Slot>
    fetchSlots():Promise<Slot[] | Slot>
    updateSlot(slotId:string,slot:Slot):Promise<Slot | null>
    deleteSlot(slotId:string):Promise<boolean>
}