import { Slot } from "../../models/slotSchema";

export interface ISlotRepository{
    findSlot(slotId:string):Promise<Slot | null>
    bookSlot(slotId:string,slot:Slot):Promise<Slot | null>
    updateSlotStatus(slotId:string):Promise<Slot | null>
    fetchSlotsByUser(userId: string, page: number, limit: number): Promise<{ slots: Slot[], totalPages: number }> 
    createSlot(slotData:Slot):Promise<Slot>
    findExistingSlot(date:string,startTime:string):Promise<boolean>
    fetchSlots(advisorId:string,page:number,limit:number):Promise<{slots:Slot[] | Slot; totalSlots:number}>
    findSlotById(slotId:string):Promise<Slot | null>
    updateSlot(slotId:string,slot:Slot):Promise<Slot | null>
    deleteSlot(slotId:string):Promise<boolean>
    getBookedSlotsForAdvisor(advisorid:string,page:number,limit:number):Promise<{bookedSlots:Slot[] | Slot; totalSlots:number}>
}