import { Slot } from "../../models/slotSchema";

export interface ISlotRepository{
    findSlot(slotId:string):Promise<Slot | null>
    bookSlot(slotId:string,slot:Slot):Promise<Slot | null>
    updateSlot(slotId:string):Promise<Slot | null>
    fetchSlotsByUser(userId: string, page: number, limit: number): Promise<{ slots: Slot[], totalPages: number }> 

}