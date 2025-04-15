import { Slot } from "../../../models/slotSchema"

export interface ISlotService{
    bookslot(slotId:string,userId:string):Promise<Slot | null>
    fetchSlotsByUser(userId: string, page: number, limit: number): Promise<{ slots: Slot[], totalPages: number }>
    createSlot(id:string,slot:Slot):Promise<Slot>
    fetchSlots(advisorId:string,page:number,limit:number,search:string):Promise<{slots:Slot[] | Slot,totalPages:number}>
    updateSlot(slotId:string,slot:Slot):Promise<Slot | null>
    deleteSlot(slotId:string):Promise<boolean>
    getBookedSlotsForAdvisor(advisorId:string,page:number,limit:number,search:string):Promise<{bookedSlots:Slot[] | Slot; totalPages:number}>
    cancelBookedSlot(slotId:string,advisorId:string,userId:string):Promise<Slot | null>
}