import { Slot } from "../../../models/slotSchema"

export interface ISlotService{
    bookslot(slotId:string,userId:string):Promise<Slot | null>
    fetchSlotsByUser(userId: string, page: number, limit: number): Promise<{ slots: Slot[], totalPages: number }>
}